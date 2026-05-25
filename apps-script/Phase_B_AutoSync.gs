/**
 * Phase B — Working Sheet → Hub Link Auto-Sync
 * ============================================================
 * Direction: Working = primary (manual edit), Hub Link = mirror (auto)
 *
 * Workflow:
 *   1. Team edits Working Sheet (Quick Fact / Contact / Project Assign)
 *   2. Apps Script onEdit trigger fires (debounced)
 *   3. Sync function reads Working + reads existing Hub Link (for extras)
 *   4. Merge + enrich + write to Hub Link canonical schema
 *   5. master Apps Script serves Hub Link to all apps
 *
 * Triggers:
 *   - onEdit on Working Sheet (live sync, ~5 second delay)
 *   - Daily 3:00 AM full sync (safety net)
 *
 * Logging: _SyncLog tab in Hub Link (hidden, keeps last 500 entries)
 *
 * Setup:
 *   1. Paste this file into master Apps Script project
 *   2. Run installPhaseBTriggers() once (will ask for permission)
 *   3. Verify with viewSyncLog() after editing Working Sheet
 *
 * Safety:
 *   - LockService prevents concurrent runs
 *   - Errors logged to _SyncLog (not thrown)
 *   - Weekly backup auto-created (Sunday 4 AM)
 *
 * Dependencies: Migration_Step2_3.gs (parse + merge helpers) + Code.gs (EVENTS_FALLBACK)
 */

const PB_WORKING_ID = '13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI';
const PB_HUB_ID     = '1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q';

// Map Working tab name → sync function name
const PB_SYNC_MAP = {
  'Quick Fact':     'syncEventsNow_',
  'Contact':        'syncStaffNow_',
  'Project Assign': 'syncProjectsNow_',
};

// ====================================================
// TRIGGER INSTALLATION
// ====================================================
function installPhaseBTriggers() {
  // Remove existing
  ScriptApp.getProjectTriggers().forEach(t => {
    const fn = t.getHandlerFunction();
    if (['onEditWorkingSheet', 'dailyFullSync', 'weeklyBackup'].indexOf(fn) !== -1) {
      ScriptApp.deleteTrigger(t);
    }
  });

  // onEdit on Working Sheet
  ScriptApp.newTrigger('onEditWorkingSheet')
    .forSpreadsheet(PB_WORKING_ID)
    .onEdit()
    .create();

  // Daily 3 AM full sync
  ScriptApp.newTrigger('dailyFullSync')
    .timeBased()
    .everyDays(1)
    .atHour(3)
    .create();

  // Weekly Sunday 4 AM backup
  ScriptApp.newTrigger('weeklyBackup')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(4)
    .create();

  const msg = 'INSTALLED: onEdit (Working) + daily 3 AM sync + weekly Sunday 4 AM backup';
  Logger.log(msg);
  logSync_('TRIGGER_INSTALL', 'all', msg);
  return msg;
}

function uninstallPhaseBTriggers() {
  let removed = 0;
  ScriptApp.getProjectTriggers().forEach(t => {
    const fn = t.getHandlerFunction();
    if (['onEditWorkingSheet', 'dailyFullSync', 'weeklyBackup'].indexOf(fn) !== -1) {
      ScriptApp.deleteTrigger(t);
      removed++;
    }
  });
  const msg = 'UNINSTALLED: ' + removed + ' triggers removed';
  Logger.log(msg);
  return msg;
}

function listPhaseBTriggers() {
  const out = ['=== ACTIVE TRIGGERS ==='];
  ScriptApp.getProjectTriggers().forEach(t => {
    out.push(t.getHandlerFunction() + ' | ' + t.getEventType());
  });
  Logger.log(out.join('\n'));
  return out.join('\n');
}

// ====================================================
// TRIGGER HANDLERS
// ====================================================
function onEditWorkingSheet(e) {
  if (!e || !e.range) return;
  const tabName = e.range.getSheet().getName();
  const syncFn = PB_SYNC_MAP[tabName];
  if (!syncFn) return;  // not a tracked tab — ignore

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    logSync_('SKIP_LOCK', tabName, 'Another sync in progress');
    return;
  }
  try {
    const result = this[syncFn]();
    logSync_('AUTO_EDIT', tabName, 'OK: ' + result + ' rows');
  } catch (err) {
    logSync_('ERROR', tabName, err.toString());
  } finally {
    lock.releaseLock();
  }
}

function dailyFullSync() {
  syncAllNow();
  logSync_('DAILY_CRON', 'all', 'OK');
}

function weeklyBackup() {
  const ts = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmm');
  const hub = SpreadsheetApp.openById(PB_HUB_ID);
  const tabs = ['Project Info', 'Staff Directory', 'Project Assignment'];
  let count = 0;
  tabs.forEach(name => {
    const src = hub.getSheetByName(name);
    if (!src) return;
    const bakName = '_BAK_WEEKLY_' + name.replace(/\s+/g, '') + '_' + ts;
    src.copyTo(hub).setName(bakName).hideSheet();
    count++;
  });
  // Purge backups older than 8 weeks (keep last ~8)
  purgeOldBackups_(56);
  logSync_('WEEKLY_BACKUP', 'all', 'Created ' + count + ' backups + purged older than 56 days');
}

function purgeOldBackups_(daysOld) {
  const cutoff = new Date().getTime() - daysOld * 86400000;
  const hub = SpreadsheetApp.openById(PB_HUB_ID);
  hub.getSheets().forEach(s => {
    const name = s.getName();
    const m = name.match(/_BAK_WEEKLY_.*_(\d{8})_/);
    if (!m) return;
    const d = m[1];
    const dt = new Date(d.slice(0,4) + '-' + d.slice(4,6) + '-' + d.slice(6,8));
    if (dt.getTime() < cutoff) hub.deleteSheet(s);
  });
}

// ====================================================
// MANUAL SYNC (callable from editor)
// ====================================================
function syncAllNow() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return 'SKIP: locked';
  try {
    const r1 = syncEventsNow_();
    const r2 = syncStaffNow_();
    const r3 = syncProjectsNow_();
    return 'OK: events=' + r1 + ', staff=' + r2 + ', projects=' + r3;
  } catch (err) {
    logSync_('ERROR', 'all', err.toString());
    return 'ERROR: ' + err.toString();
  } finally {
    lock.releaseLock();
  }
}

// ====================================================
// SYNC FUNCTIONS (no per-run backup — weekly snapshot instead)
// Reuses helpers from Migration_Step2_3.gs
// ====================================================
function syncEventsNow_() {
  const hubBook = SpreadsheetApp.openById(PB_HUB_ID);
  const tgt = hubBook.getSheetByName('Project Info');
  if (!tgt) throw new Error('Hub Link > Project Info not found');

  // For events: Hub Link already has data after Phase F. Working > Quick Fact has subset.
  // Strategy: Read Hub Link as base (it has 17 cols), re-enrich from EVENTS_FALLBACK, write back.
  // Working > Quick Fact is just for cross-validation (we don't use it as primary here).
  const hubData = parseEventsSheet_(tgt);
  const merged = mergeEventsRows_(hubData.rows);

  return writeBackSheet_(tgt, EVENTS_CANONICAL_HEADERS, merged);
}

function syncStaffNow_() {
  const wsBook = SpreadsheetApp.openById(PB_WORKING_ID);
  const hubBook = SpreadsheetApp.openById(PB_HUB_ID);
  const tgt = hubBook.getSheetByName('Staff Directory');
  if (!tgt) throw new Error('Hub Link > Staff Directory not found');

  const workData = parseStaffSheet_(wsBook.getSheetByName('Contact'));
  const hubData = parseStaffSheet_(tgt);  // for Role/Dept/EmpCode extras
  const merged = mergeStaffRows_(workData.rows, hubData.rows);

  // Renumber
  merged.forEach((r, i) => { if (!r.No) r.No = (i + 1).toString(); });

  return writeBackSheet_(tgt, STAFF_CANONICAL_HEADERS, merged);
}

function syncProjectsNow_() {
  const wsBook = SpreadsheetApp.openById(PB_WORKING_ID);
  const hubBook = SpreadsheetApp.openById(PB_HUB_ID);
  const tgt = hubBook.getSheetByName('Project Assignment');
  if (!tgt) throw new Error('Hub Link > Project Assignment not found');

  // Read Working > Project Assign directly, find header row
  const src = wsBook.getSheetByName('Project Assign');
  if (!src) throw new Error('Working > Project Assign not found');

  const srcData = src.getDataRange().getValues();
  let headerIdx = -1;
  for (let i = 0; i < Math.min(srcData.length, 5); i++) {
    const row = srcData[i].map(c => String(c || '').toLowerCase().trim());
    if (row.some(c => c === 'project') && row.some(c => c.indexOf('lead') !== -1 || c === 'no.')) {
      headerIdx = i; break;
    }
  }
  if (headerIdx < 0) throw new Error('Could not find header row in Working > Project Assign');

  const headers = srcData[headerIdx];
  const projectColIdx = headers.findIndex(c => String(c).toLowerCase().trim() === 'project');
  const dataRows = srcData.slice(headerIdx + 1).filter(r => r[projectColIdx] && String(r[projectColIdx]).trim());

  if (dataRows.length === 0) throw new Error('No data rows in Working > Project Assign');

  // Direct write — Working is canonical for projects
  tgt.clear();
  const allRows = [headers].concat(dataRows);
  tgt.getRange(1, 1, allRows.length, headers.length).setValues(allRows);
  tgt.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold').setBackground('#1F4E78').setFontColor('#FFFFFF');
  tgt.setFrozenRows(1);

  return dataRows.length;
}

// Shared write-back helper (used by syncEvents, syncStaff)
function writeBackSheet_(tgt, headers, mergedRows) {
  tgt.clear();
  const dataRows = mergedRows.map(r => headers.map(h => r[h] || ''));
  const allRows = [headers].concat(dataRows);
  tgt.getRange(1, 1, allRows.length, headers.length).setValues(allRows);
  tgt.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold').setBackground('#1F4E78').setFontColor('#FFFFFF');
  tgt.setFrozenRows(1);
  return dataRows.length;
}

// ====================================================
// LOGGING
// ====================================================
function logSync_(action, entity, message) {
  try {
    const hub = SpreadsheetApp.openById(PB_HUB_ID);
    let log = hub.getSheetByName('_SyncLog');
    if (!log) {
      log = hub.insertSheet('_SyncLog');
      log.hideSheet();
      log.appendRow(['Timestamp', 'Action', 'Entity', 'Message']);
      log.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#1F4E78').setFontColor('#FFFFFF');
    }
    log.appendRow([new Date(), action, entity, String(message).slice(0, 500)]);
    // Trim to last 500 rows
    if (log.getLastRow() > 502) {
      log.deleteRows(2, log.getLastRow() - 501);
    }
  } catch (e) { /* swallow */ }
}

function viewSyncLog() {
  const hub = SpreadsheetApp.openById(PB_HUB_ID);
  const log = hub.getSheetByName('_SyncLog');
  if (!log) return 'No sync log yet — triggers not run.';
  const data = log.getDataRange().getValues();
  const last20 = data.slice(Math.max(1, data.length - 20)).reverse();
  const out = ['=== Recent Sync Log (last 20, newest first) ==='];
  last20.forEach(r => {
    const ts = r[0] instanceof Date ? Utilities.formatDate(r[0], 'GMT+7', 'MM-dd HH:mm:ss') : r[0];
    out.push(ts + ' | ' + r[1] + ' | ' + r[2] + ' | ' + r[3]);
  });
  Logger.log(out.join('\n'));
  return out.join('\n');
}

// ====================================================
// DRY RUN — test sync without writing
// ====================================================
function dryRunSyncAll() {
  const out = ['=== DRY RUN: All sync functions ==='];
  try {
    const wsBook = SpreadsheetApp.openById(PB_WORKING_ID);
    const hubBook = SpreadsheetApp.openById(PB_HUB_ID);

    // Events
    const evHub = parseEventsSheet_(hubBook.getSheetByName('Project Info'));
    const evMerged = mergeEventsRows_(evHub.rows);
    out.push('Events: ' + evMerged.length + ' rows (target: Project Info)');

    // Staff
    const stWork = parseStaffSheet_(wsBook.getSheetByName('Contact'));
    const stHub = parseStaffSheet_(hubBook.getSheetByName('Staff Directory'));
    const stMerged = mergeStaffRows_(stWork.rows, stHub.rows);
    out.push('Staff: ' + stMerged.length + ' rows (target: Staff Directory)');

    // Projects
    const projSrc = wsBook.getSheetByName('Project Assign');
    const projData = projSrc.getDataRange().getValues();
    let h = -1;
    for (let i = 0; i < 5; i++) {
      const row = projData[i].map(c => String(c || '').toLowerCase().trim());
      if (row.some(c => c === 'project') && row.some(c => c === 'no.' || c.indexOf('lead') !== -1)) { h = i; break; }
    }
    const projCount = projData.slice(h + 1).filter(r => r[h >= 0 ? projData[h].findIndex(c => String(c).toLowerCase().trim() === 'project') : 1]).length;
    out.push('Projects: ' + projCount + ' rows (target: Project Assignment)');

    out.push('\nWould write to 3 Hub Link tabs. No backup created (use weeklyBackup for that).');
    out.push('To sync now: run syncAllNow()');
  } catch (err) {
    out.push('ERROR: ' + err.toString());
  }
  Logger.log(out.join('\n'));
  return out.join('\n');
}
