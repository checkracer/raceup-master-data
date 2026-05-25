/**
 * Race Up Work — Working Sheet → Hub Link Sheet Sync
 * ===================================================
 * One-way sync: Working Sheet (manual edits) → Hub Link Sheet (Single Source of Truth)
 *
 * Deploy to:
 *   Apps Script project attached to "2026 Raceup Working Sheet"
 *   (https://docs.google.com/spreadsheets/d/13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI/edit)
 *
 * What it does:
 *   1. onEdit() — auto-sync when team edits Working Sheet tab (debounced 5s)
 *   2. syncAllToHubLink() — full sync all 7 tabs (manual or cron)
 *   3. Audit log → "Sync Log" tab in Hub Link Sheet
 *   4. Email alert when sync fails 3 times in a row
 *
 * Critical rules:
 *   ⚠️ One-way only — never write back to Working Sheet
 *   ⚠️ Hub Link tabs prefixed "Live_" so they don't overwrite existing manual tabs
 *   ⚠️ Apps Script service account must have edit access to BOTH sheets
 */

// ====================================================
// CONFIG
// ====================================================
const WORKING_SHEET_ID  = '13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI';
const HUB_LINK_SHEET_ID = '1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q';

// Mapping: source tab name → destination tab name (Live_ prefix)
const SYNC_MAP = [
  { from: 'Quick Fact',     to: 'Live_QuickFact',     description: '24 events 2026 + 2027' },
  { from: 'Project Assign', to: 'Live_ProjectAssign', description: '37 project assignments' },
  { from: 'Contact',        to: 'Live_Contact',       description: '22 staff with phone' },
  { from: 'Sponsor Update', to: 'Live_SponsorUpdate', description: 'Sponsors per event' },
  { from: 'Coming',         to: 'Live_Coming',        description: 'Coming projects pipeline' },
  { from: 'Pacer Slot',     to: 'Live_PacerSlot',     description: 'Pacer/Sweeper assignments' },
  { from: 'จอง Supplier',   to: 'Live_SupplierBooking', description: 'Supplier booking status' },
];

const ALERT_EMAIL          = 'alongkorn@raceup.co.th';
const FAILURE_THRESHOLD     = 3;        // alert after N consecutive failures
const DEBOUNCE_MS           = 5000;     // wait 5s after edit before sync
const LOG_TAB               = 'Sync Log';
const FAILURE_COUNTER_KEY   = 'sync_failure_count';

// ====================================================
// PUBLIC API — Manual triggers
// ====================================================

/** Full sync all 7 tabs + ProjectInfo merge — call from custom menu */
function syncAllToHubLink() {
  const src = SpreadsheetApp.openById(WORKING_SHEET_ID);
  const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
  const log = [];
  let okCount = 0;
  let errCount = 0;

  // Step 1: sync individual tabs (sources first — needed for ProjectInfo merge)
  SYNC_MAP.forEach(({ from, to, description }) => {
    try {
      const result = syncOneTab_(src, dst, from, to);
      log.push([new Date(), from, to, 'OK', result.rows, description + ' (' + result.cols + ' cols)']);
      okCount++;
    } catch (err) {
      log.push([new Date(), from, to, 'ERROR', 0, err.toString()]);
      errCount++;
    }
  });

  // Step 2: build merged "Live_ProjectInfo" tab (Quick Fact + Project Assign joined by code)
  try {
    const merged = buildProjectInfoMerged_(src);
    writeMergedTab_(dst, 'Live_ProjectInfo', merged);
    log.push([new Date(), 'Quick Fact + Project Assign', 'Live_ProjectInfo', 'OK-merged', merged.length - 1, 'denormalized join by event code']);
    okCount++;
  } catch (err) {
    log.push([new Date(), 'merge', 'Live_ProjectInfo', 'ERROR', 0, err.toString()]);
    errCount++;
  }

  appendSyncLog_(dst, log);
  trackFailures_(errCount > 0);

  return { ok: okCount, errors: errCount, total: SYNC_MAP.length + 1 };
}

/**
 * Build merged "Project Info" — join Quick Fact (events basic) + Project Assign (team roles) by event code
 * Output: 2D array with header row + data rows · ready to setValues()
 *
 * Why this exists: ops apps want "tell me everything about CSMH26" — currently need to read 2 tabs
 * Solution: pre-merge into denormalized view
 */
function buildProjectInfoMerged_(srcWb) {
  const qfSheet = srcWb.getSheetByName('Quick Fact');
  const paSheet = srcWb.getSheetByName('Project Assign');
  if (!qfSheet) throw new Error('Quick Fact tab not found');
  if (!paSheet) throw new Error('Project Assign tab not found');

  // ---- Parse Quick Fact ----
  // Schema: row[0]=No · row[1]=Event Name · row[2]=Code · row[3]=Expo Day · row[4]=Race Day · row[5]=Target · row[6]=Venue
  const qfData = qfSheet.getDataRange().getValues();
  const eventsByCode = {};
  qfData.forEach(row => {
    const code = String(row[2] || '').trim().toUpperCase();
    if (!code || code === 'CODE') return; // skip header
    if (!/^[A-Z0-9\-]+$/.test(code)) return; // skip non-codes
    eventsByCode[code] = {
      no:         row[0],
      name:       String(row[1] || '').trim(),
      code:       code,
      expoDate:   String(row[3] || '').trim(),
      raceDay:    String(row[4] || '').trim(),
      target:     row[5] || 0,
      venue:      String(row[6] || '').trim(),
    };
  });

  // ---- Parse Project Assign ----
  // Schema: No · Project · Point · Event Date · Lead · CO1 · CO2 · Route · AE · PR · Graphic · Tech · Team Event · Team Race
  const paData = paSheet.getDataRange().getValues();
  const projectsByCode = {};
  let headerRow = -1;
  for (let i = 0; i < paData.length; i++) {
    const v = String(paData[i][1] || '').trim().toLowerCase();
    if (v === 'project') { headerRow = i; break; }
  }
  if (headerRow === -1) throw new Error('Project Assign header row not found');

  for (let i = headerRow + 1; i < paData.length; i++) {
    const row = paData[i];
    let project = String(row[1] || '').trim();
    if (!project) continue;
    // Normalize event code — strip suffixes like " Press" or " #1 BKK"
    const code = project
      .replace(/\s*Press$/i, '')
      .replace(/\s*#\d+\s*\w*$/i, '')
      .trim().toUpperCase();
    // เก็บ original ใน .projectFull
    projectsByCode[code] = projectsByCode[code] || [];
    projectsByCode[code].push({
      projectFull: project,
      point:       row[2],
      eventDate:   String(row[3] || '').trim(),
      lead:        String(row[4] || '').trim(),
      co1:         String(row[5] || '').trim(),
      co2:         String(row[6] || '').trim(),
      route:       String(row[7] || '').trim(),
      ae:          String(row[8] || '').trim(),
      pr:          String(row[9] || '').trim(),
      graphic:     String(row[10] || '').trim(),
      tech:        String(row[11] || '').trim(),
      teamEvent:   String(row[12] || '').trim(),
      teamRace:    String(row[13] || '').trim(),
    });
  }

  // ---- Merge ----
  // Output schema: Code · Event Name · Expo · Race Day · Target · Venue · Point · Lead · CO1 · CO2 · Route · AE · PR · Graphic · Tech · Team Event · Team Race · Project Variants
  const out = [
    ['Code', 'Event Name', 'Expo Day', 'Race Day', 'Target', 'Venue',
     'Point', 'Lead', 'CO1', 'CO2', 'Route', 'AE', 'PR', 'Graphic', 'Tech',
     'Team Event', 'Team Race', 'Project Variants (from PA)']
  ];

  // Union of all codes (from both sources)
  const allCodes = [...new Set([...Object.keys(eventsByCode), ...Object.keys(projectsByCode)])];
  allCodes.sort();

  allCodes.forEach(code => {
    const ev = eventsByCode[code] || {};
    const projs = projectsByCode[code] || [];
    // Use first PA entry for the row · list project full names in last column
    const pa = projs[0] || {};
    out.push([
      code,
      ev.name || pa.projectFull || '',
      ev.expoDate || '',
      ev.raceDay || pa.eventDate || '',
      ev.target || '',
      ev.venue || '',
      pa.point || '',
      pa.lead || '',
      pa.co1 || '',
      pa.co2 || '',
      pa.route || '',
      pa.ae || '',
      pa.pr || '',
      pa.graphic || '',
      pa.tech || '',
      pa.teamEvent || '',
      pa.teamRace || '',
      projs.map(p => p.projectFull).join(' | '), // all variants (e.g., "KYM26 | KYM26 Press")
    ]);
  });

  return out;
}

/** Write 2D array to sheet, replacing existing data */
function writeMergedTab_(dstWb, tabName, dataArray) {
  if (!dataArray || dataArray.length === 0) return;
  let sheet = dstWb.getSheetByName(tabName);
  if (!sheet) {
    sheet = dstWb.insertSheet(tabName);
  } else {
    sheet.clear();
  }
  sheet.getRange(1, 1, dataArray.length, dataArray[0].length).setValues(dataArray);
  // Format header row
  sheet.getRange(1, 1, 1, dataArray[0].length)
    .setFontWeight('bold')
    .setBackground('#1d2c4d')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1).setNote(
    'Auto-merged from "Quick Fact" + "Project Assign" tabs in Working Sheet\n' +
    'Sync time: ' + new Date().toISOString() + '\n' +
    '⚠️ Denormalized view — DO NOT EDIT\n' +
    'แก้ที่ Quick Fact หรือ Project Assign แทน · merge อัตโนมัติทุก sync'
  );
}

/** Sync only one tab — call from menu per-tab item */
function syncOneTabByName(tabName) {
  const mapping = SYNC_MAP.find(m => m.from === tabName);
  if (!mapping) throw new Error('Unknown tab: ' + tabName);

  const src = SpreadsheetApp.openById(WORKING_SHEET_ID);
  const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);

  try {
    const result = syncOneTab_(src, dst, mapping.from, mapping.to);
    appendSyncLog_(dst, [[new Date(), mapping.from, mapping.to, 'OK-manual', result.rows, 'one-tab manual']]);
    return result;
  } catch (err) {
    appendSyncLog_(dst, [[new Date(), mapping.from, mapping.to, 'ERROR-manual', 0, err.toString()]]);
    throw err;
  }
}

// ====================================================
// onEdit Trigger (auto-sync when team edits)
// ====================================================
function onWorkingSheetEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  const mapping = SYNC_MAP.find(m => m.from === sheetName);
  if (!mapping) return; // edit is in a tab we don't sync

  // Debounce — wait 5s. If another edit comes in, this one is cancelled by ScriptProperties marker
  const props = PropertiesService.getScriptProperties();
  const debounceKey = 'debounce_' + sheetName;
  const editTimestamp = Date.now();
  props.setProperty(debounceKey, String(editTimestamp));

  Utilities.sleep(DEBOUNCE_MS);

  // ตรวจว่า edit ใหม่มาแทรกหรือเปล่า — ถ้ามี cancel การ sync
  const latestEdit = parseInt(props.getProperty(debounceKey) || '0', 10);
  if (latestEdit !== editTimestamp) {
    // มี edit ใหม่ระหว่าง debounce — รอ next trigger sync แทน
    return;
  }

  try {
    const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    const src = SpreadsheetApp.openById(WORKING_SHEET_ID);
    const result = syncOneTab_(src, dst, mapping.from, mapping.to);
    appendSyncLog_(dst, [[new Date(), mapping.from, mapping.to, 'OK-onEdit', result.rows, 'auto debounced ' + DEBOUNCE_MS + 'ms']]);
    trackFailures_(false);
  } catch (err) {
    const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    appendSyncLog_(dst, [[new Date(), mapping.from, mapping.to, 'ERROR-onEdit', 0, err.toString()]]);
    trackFailures_(true);
  }
}

// ====================================================
// Time-driven Trigger — daily 06:00 ICT (full sync as safety net)
// ====================================================
function dailyFullSync() {
  const result = syncAllToHubLink();
  console.log('Daily full sync:', JSON.stringify(result));
  return result;
}

// ====================================================
// CORE — sync logic
// ====================================================
function syncOneTab_(srcWb, dstWb, fromName, toName) {
  const srcSheet = srcWb.getSheetByName(fromName);
  if (!srcSheet) throw new Error('Source tab not found in Working Sheet: ' + fromName);

  const data = srcSheet.getDataRange().getValues();
  if (data.length === 0) return { rows: 0, cols: 0 };
  const numRows = data.length;
  const numCols = data[0].length;

  let dstSheet = dstWb.getSheetByName(toName);
  if (!dstSheet) {
    dstSheet = dstWb.insertSheet(toName);
  } else {
    dstSheet.clear();
  }

  if (numRows > 0 && numCols > 0) {
    dstSheet.getRange(1, 1, numRows, numCols).setValues(data);
  }

  // Add sync metadata to cell A1 note
  dstSheet.getRange(1, 1).setNote(
    'Auto-synced from "' + fromName + '" in Working Sheet\n' +
    'Sync time: ' + new Date().toISOString() + '\n' +
    '⚠️ DO NOT EDIT MANUALLY — changes will be overwritten\n' +
    'Edit the source tab in Working Sheet instead'
  );

  // Freeze top row + protect from editing (read-only)
  try {
    dstSheet.setFrozenRows(1);
    const protection = dstSheet.protect().setDescription('Auto-synced — read-only');
    // Allow only the script owner to edit (the script account itself)
    const owner = Session.getEffectiveUser();
    protection.removeEditors(protection.getEditors());
    protection.addEditor(owner);
    protection.setWarningOnly(false);
  } catch (e) { /* protection might fail if no perms — non-fatal */ }

  return { rows: numRows, cols: numCols };
}

// ====================================================
// Audit log
// ====================================================
function appendSyncLog_(dstWb, logEntries) {
  let logSheet = dstWb.getSheetByName(LOG_TAB);
  if (!logSheet) {
    logSheet = dstWb.insertSheet(LOG_TAB);
    logSheet.appendRow(['Timestamp', 'Source Tab', 'Dest Tab', 'Status', 'Rows', 'Details']);
    logSheet.getRange(1, 1, 1, 6)
      .setFontWeight('bold')
      .setBackground('#1d2c4d')
      .setFontColor('#ffffff');
    logSheet.setFrozenRows(1);
  }
  logEntries.forEach(row => logSheet.appendRow(row));

  // Auto-prune: keep only last 1000 rows
  const lastRow = logSheet.getLastRow();
  if (lastRow > 1001) {
    logSheet.deleteRows(2, lastRow - 1001);
  }
}

// ====================================================
// Failure tracking + email alert
// ====================================================
function trackFailures_(failed) {
  const props = PropertiesService.getScriptProperties();
  if (failed) {
    const count = parseInt(props.getProperty(FAILURE_COUNTER_KEY) || '0', 10) + 1;
    props.setProperty(FAILURE_COUNTER_KEY, String(count));

    if (count >= FAILURE_THRESHOLD) {
      sendFailureAlert_(count);
      props.setProperty(FAILURE_COUNTER_KEY, '0'); // reset after alert
    }
  } else {
    props.setProperty(FAILURE_COUNTER_KEY, '0'); // reset on success
  }
}

function sendFailureAlert_(failureCount) {
  try {
    MailApp.sendEmail({
      to: ALERT_EMAIL,
      subject: '🚨 Race Up Master Data Sync FAILED (' + failureCount + ' times)',
      body: 'Working Sheet → Hub Link Sheet sync ล้มเหลว ' + failureCount + ' ครั้งติด\n\n' +
            'ดู Sync Log tab ที่:\n' +
            'https://docs.google.com/spreadsheets/d/' + HUB_LINK_SHEET_ID + '/edit#gid=0\n\n' +
            'Apps Script project:\n' +
            'https://script.google.com/home\n\n' +
            'Time: ' + new Date().toISOString(),
    });
  } catch (e) { /* email might fail — non-fatal */ }
}

// ====================================================
// Setup — run once after deploying
// ====================================================

/** Setup all triggers (onEdit + daily) — run once manually after deploy */
function setupTriggers() {
  // Delete existing triggers สำหรับ functions ของเรา
  ScriptApp.getProjectTriggers().forEach(t => {
    const fn = t.getHandlerFunction();
    if (['onWorkingSheetEdit', 'dailyFullSync'].includes(fn)) {
      ScriptApp.deleteTrigger(t);
    }
  });

  // 1. onEdit trigger — sync ทันทีเมื่อ Working Sheet ถูกแก้
  ScriptApp.newTrigger('onWorkingSheetEdit')
    .forSpreadsheet(WORKING_SHEET_ID)
    .onEdit()
    .create();

  // 2. Daily full sync 06:00 ICT (safety net + initial sync)
  ScriptApp.newTrigger('dailyFullSync')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();

  console.log('Triggers installed: onEdit + daily 06:00');
  return 'OK — triggers ready';
}

/** Verify access — run to check Hub Link Sheet permissions */
function verifyAccess() {
  try {
    const src = SpreadsheetApp.openById(WORKING_SHEET_ID);
    const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    const srcName = src.getName();
    const dstName = dst.getName();
    const result = '✅ Source: ' + srcName + ' (' + WORKING_SHEET_ID + ')\n' +
                   '✅ Dest:   ' + dstName + ' (' + HUB_LINK_SHEET_ID + ')\n' +
                   'Effective user: ' + Session.getEffectiveUser().getEmail();
    console.log(result);
    return result;
  } catch (e) {
    return '❌ Access failed: ' + e.toString();
  }
}

// ====================================================
// Custom menu (auto-added when sheet opened)
// ====================================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('🔄 Sync to Hub Link');

  menu.addItem('▶️ Sync ALL tabs now', 'syncAllToHubLink_menu');
  menu.addSeparator();
  SYNC_MAP.forEach(m => {
    menu.addItem('• ' + m.from, 'menu_sync_' + m.from.replace(/\s+/g, '_'));
  });
  menu.addSeparator();
  menu.addItem('🔧 Setup Triggers (run once)', 'setupTriggers');
  menu.addItem('🔍 Verify Access', 'verifyAccess_menu');
  menu.addItem('📋 Open Sync Log', 'openSyncLog_menu');
  menu.addToUi();
}

function syncAllToHubLink_menu() {
  const result = syncAllToHubLink();
  SpreadsheetApp.getUi().alert(
    'Sync complete!\n\nSuccess: ' + result.ok + '/' + result.total + ' tabs\n' +
    (result.errors > 0 ? '⚠️ Errors: ' + result.errors + ' — check Sync Log' : '✅ All OK')
  );
}

function verifyAccess_menu() {
  SpreadsheetApp.getUi().alert(verifyAccess());
}

function openSyncLog_menu() {
  const url = 'https://docs.google.com/spreadsheets/d/' + HUB_LINK_SHEET_ID + '/edit#gid=0';
  SpreadsheetApp.getUi().alert('Sync Log:\n' + url);
}

// Per-tab menu handlers (auto-generated)
SYNC_MAP.forEach(m => {
  const fnName = 'menu_sync_' + m.from.replace(/\s+/g, '_');
  this[fnName] = function() {
    try {
      const r = syncOneTabByName(m.from);
      SpreadsheetApp.getUi().alert('✅ Synced: ' + m.from + ' (' + r.rows + ' rows)');
    } catch (e) {
      SpreadsheetApp.getUi().alert('❌ Failed: ' + e.toString());
    }
  };
});
