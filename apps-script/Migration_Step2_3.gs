/**
 * Hub Link Migration — STEP 2 + 3
 * ============================================================
 * Safe migration script: backup → dry-run → execute
 *
 * STEP 2: Clean Hub Link title rows (Project Assignment, Staff Directory,
 *         Chat Spaces, Project Links, RunnerStats group headers)
 *
 * STEP 3: Enrich Events (Project Info) tab with missing columns:
 *         Province, Venue, Status, Color, Series (from master events.js fallback)
 *
 * HOW TO USE:
 *   1. Paste this file as new file in master Apps Script editor
 *      (don't replace Code.gs — this is a separate file)
 *   2. Run backupHubLinkSheet()         — creates timestamped backup tabs
 *   3. Run dryRunStep2()                — shows what would change (no edits)
 *   4. Run executeStep2()               — does the actual edits
 *   5. Verify: open Hub Link Sheet manually, then run ?action=health
 *   6. If happy: run dryRunStep3() then executeStep3()
 *
 * SAFETY:
 *   - All destructive operations create backup tabs first
 *   - Dry-run shows exact changes before commit
 *   - Each STEP is idempotent (safe to re-run)
 *   - To rollback: restore from backup tabs (manual rename)
 */

const MIG_HUB_ID = '1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q';

// ====================================================
// LIST ALL TABS — print exact names + visibility + row/col count
// ====================================================
function listAllTabs() {
  const out = [];
  out.push('=== HUB LINK SHEET ===');
  const hub = SpreadsheetApp.openById(MIG_HUB_ID);
  hub.getSheets().forEach((s, i) => {
    out.push((i+1).toString().padStart(2) + '. "' + s.getName() + '"  ' +
      (s.isSheetHidden() ? '[HIDDEN]' : '[visible]') +
      '  rows=' + s.getLastRow() + ' cols=' + s.getLastColumn());
  });

  out.push('\n=== WORKING SHEET ===');
  const ws = SpreadsheetApp.openById('13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI');
  ws.getSheets().forEach((s, i) => {
    out.push((i+1).toString().padStart(2) + '. "' + s.getName() + '"  ' +
      (s.isSheetHidden() ? '[HIDDEN]' : '[visible]') +
      '  rows=' + s.getLastRow() + ' cols=' + s.getLastColumn());
  });

  Logger.log(out.join('\n'));
  return out.join('\n');
}

// ====================================================
// BACKUP — duplicate all data tabs with timestamp suffix
// ====================================================
function backupHubLinkSheet() {
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const ts = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmm');

  const tabsToBackup = [
    'Project Assignment',
    'Staff Directory',
    'Chat Spaces',
    'Project Links',
    'RunnerStats',
    'Project Info',
  ];

  const log = [];
  tabsToBackup.forEach(name => {
    const src = sh.getSheetByName(name);
    if (!src) {
      log.push('SKIP (not found): ' + name);
      return;
    }
    const backupName = '_BAK_' + name + '_' + ts;
    if (sh.getSheetByName(backupName)) {
      log.push('SKIP (backup exists): ' + backupName);
      return;
    }
    src.copyTo(sh).setName(backupName).hideSheet();
    log.push('BACKED UP: ' + name + ' → ' + backupName);
  });
  Logger.log(log.join('\n'));
  return log;
}

// ====================================================
// STEP 2 — Clean title rows
// ====================================================
// Each entry: tab name, number of top rows to delete to expose real headers
const STEP2_CLEAN = {
  'Project Assignment': 3,  // row 1 = title, 2 = blank, 3 = source note → real headers at row 4
  'Staff Directory':    3,  // row 1 = title, 2 = source, 3 = blank → real headers at row 4
  'Chat Spaces':        3,
  'Project Links':      3,
};

function dryRunStep2() {
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const report = [];
  report.push('=== DRY RUN: STEP 2 — Clean title rows ===\n');

  Object.entries(STEP2_CLEAN).forEach(([tabName, rowsToDelete]) => {
    const tab = sh.getSheetByName(tabName);
    if (!tab) { report.push('SKIP: ' + tabName + ' (not found)'); return; }

    const before = tab.getRange(1, 1, Math.min(5, tab.getLastRow()), Math.min(5, tab.getLastColumn())).getValues();
    const afterRowStart = rowsToDelete + 1;
    const after = tab.getLastRow() >= afterRowStart
      ? tab.getRange(afterRowStart, 1, 1, Math.min(8, tab.getLastColumn())).getValues()[0]
      : ['(empty)'];

    report.push('TAB: ' + tabName);
    report.push('  Current row 1 (title): ' + JSON.stringify(before[0]).slice(0, 100));
    report.push('  Will delete top ' + rowsToDelete + ' rows');
    report.push('  After cleanup, row 1 (real headers): ' + JSON.stringify(after).slice(0, 150));
    report.push('  Total rows after: ' + (tab.getLastRow() - rowsToDelete));
    report.push('');
  });

  Logger.log(report.join('\n'));
  return report.join('\n');
}

function executeStep2() {
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const log = [];
  log.push('=== EXECUTING: STEP 2 — Clean title rows ===\n');

  // Safety check: ensure backup exists
  const tabs = sh.getSheets().map(s => s.getName());
  const hasBackup = tabs.some(t => t.startsWith('_BAK_'));
  if (!hasBackup) {
    const msg = 'ABORT: No backup found. Run backupHubLinkSheet() first.';
    Logger.log(msg);
    return msg;
  }

  Object.entries(STEP2_CLEAN).forEach(([tabName, rowsToDelete]) => {
    const tab = sh.getSheetByName(tabName);
    if (!tab) { log.push('SKIP: ' + tabName + ' (not found)'); return; }

    // Check if already cleaned (idempotency check)
    const row1Col1 = tab.getRange(1, 1).getValue();
    const row1Col2 = tab.getRange(1, 2).getValue();
    const looksLikeTitle = (typeof row1Col1 === 'string' && (
      row1Col1.indexOf('Raceup') !== -1 ||
      row1Col1.indexOf('Hub') !== -1 ||
      row1Col1.indexOf('Project') !== -1 && !row1Col2
    ));
    if (!looksLikeTitle) {
      log.push('SKIP: ' + tabName + ' (already cleaned — row 1 col 1 = "' + row1Col1 + '")');
      return;
    }

    tab.deleteRows(1, rowsToDelete);
    log.push('CLEANED: ' + tabName + ' (deleted ' + rowsToDelete + ' top rows)');
  });

  Logger.log(log.join('\n'));
  return log.join('\n');
}

// ====================================================
// STEP 3 — Enrich Events (Project Info) with missing columns
// ====================================================
// Uses master events.js fallback (EVENTS_FALLBACK in Code.gs) as source
function dryRunStep3() {
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const tab = sh.getSheetByName('Project Info');
  if (!tab) return 'ABORT: Project Info tab not found';

  const headers = tab.getRange(1, 1, 1, tab.getLastColumn()).getValues()[0];
  const report = [];
  report.push('=== DRY RUN: STEP 3 — Enrich Project Info ===\n');
  report.push('Current columns (' + headers.length + '):');
  headers.forEach((h, i) => report.push('  Col ' + (i+1) + ': "' + h + '"'));

  // Check what's missing vs canonical Events schema
  const canonical = ['Province', 'Venue', 'Status', 'Color', 'Series'];
  const missing = canonical.filter(c => !headers.some(h => String(h).toLowerCase().indexOf(c.toLowerCase()) !== -1));
  report.push('\nMissing columns to add: ' + missing.join(', '));
  report.push('\nWill add ' + missing.length + ' columns at end (col ' + (headers.length + 1) + ' onwards)');
  report.push('Data source: EVENTS_FALLBACK in Code.gs (22 events)');
  report.push('\nNo edits made yet — run executeStep3() to apply.');

  Logger.log(report.join('\n'));
  return report.join('\n');
}

function executeStep3() {
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const tab = sh.getSheetByName('Project Info');
  if (!tab) return 'ABORT: Project Info tab not found';

  const tabs = sh.getSheets().map(s => s.getName());
  if (!tabs.some(t => t.startsWith('_BAK_'))) {
    return 'ABORT: No backup found. Run backupHubLinkSheet() first.';
  }

  // Read current headers
  const lastCol = tab.getLastColumn();
  const headers = tab.getRange(1, 1, 1, lastCol).getValues()[0];

  // Find Code column to use as join key
  const codeColIdx = headers.findIndex(h => String(h).toLowerCase().trim() === 'code');
  if (codeColIdx === -1) return 'ABORT: "Code" column not found in Project Info';

  // Get all existing rows
  const lastRow = tab.getLastRow();
  if (lastRow < 2) return 'ABORT: No data rows in Project Info';
  const dataRows = tab.getRange(2, 1, lastRow - 1, lastCol).getValues();

  // Canonical columns to add (only if missing)
  const additions = [
    { name: 'Province',  source: 'province' },
    { name: 'Venue',     source: 'venueShort' },
    { name: 'Status',    source: 'status' },  // not in fallback — leave blank
    { name: 'Color',     source: 'color' },
    { name: 'Series',    source: 'series' },
  ];
  const toAdd = additions.filter(a => !headers.some(h => String(h).toLowerCase().indexOf(a.name.toLowerCase()) !== -1));
  if (toAdd.length === 0) return 'OK: All canonical columns already present.';

  // Build lookup map from EVENTS_FALLBACK (defined in Code.gs)
  if (typeof EVENTS_FALLBACK === 'undefined') {
    return 'ABORT: EVENTS_FALLBACK not found. Make sure Code.gs is in the same Apps Script project.';
  }
  const eventMap = {};
  EVENTS_FALLBACK.forEach(ev => { eventMap[ev.code] = ev; });

  // Write new headers + values
  let writeCol = lastCol + 1;
  const log = [];
  toAdd.forEach(a => {
    tab.getRange(1, writeCol).setValue(a.name).setFontWeight('bold').setBackground('#1F4E78').setFontColor('#FFFFFF');
    // Fill values per row
    const values = dataRows.map(row => {
      const code = row[codeColIdx];
      const ev = eventMap[code];
      return [ev && ev[a.source] !== undefined ? ev[a.source] : ''];
    });
    if (values.length > 0) {
      tab.getRange(2, writeCol, values.length, 1).setValues(values);
    }
    log.push('ADDED: ' + a.name + ' (col ' + writeCol + ', source: ' + a.source + ')');
    writeCol++;
  });

  Logger.log(log.join('\n'));
  return log.join('\n');
}

// ====================================================
// VERIFY — read current state of clean tabs
// ====================================================
function verifyMigration() {
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const report = { ok: true, tabs: {} };

  ['Project Assignment', 'Staff Directory', 'Project Info'].forEach(name => {
    const tab = sh.getSheetByName(name);
    if (!tab) { report.tabs[name] = { ok: false, err: 'not found' }; return; }
    const lastRow = tab.getLastRow();
    const lastCol = tab.getLastColumn();
    const headers = tab.getRange(1, 1, 1, lastCol).getValues()[0]
      .map(h => String(h).trim()).filter(Boolean);
    const looksClean = headers.length >= 3 && headers[0] !== '' && !headers[0].includes('Raceup');
    report.tabs[name] = {
      ok: looksClean,
      headers: headers,
      rowCount: lastRow - 1,
      colCount: lastCol,
    };
    if (!looksClean) report.ok = false;
  });

  Logger.log(JSON.stringify(report, null, 2));
  return report;
}

// ====================================================
// BOOTSTRAP — copy Working > Project Assign → Hub Link > Project Assignment
// (Clean structure: headers at row 1, no title row)
// ====================================================
const MIG_WORKING_ID = '13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI';

function dryRunBootstrapProjectAssignment() {
  const report = [];
  report.push('=== DRY RUN: Bootstrap Project Assignment ===\n');

  // Source: Working > Project Assign
  const wsBook = SpreadsheetApp.openById(MIG_WORKING_ID);
  const src = wsBook.getSheetByName('Project Assign');
  if (!src) return 'ABORT: Working > "Project Assign" not found';

  const srcData = src.getDataRange().getValues();
  report.push('SOURCE: Working Sheet > "Project Assign"');
  report.push('  Total rows: ' + srcData.length);
  report.push('  Total cols: ' + srcData[0].length);

  // Find header row (first row that has "project" or "no." or "lead")
  let headerIdx = -1;
  for (let i = 0; i < Math.min(srcData.length, 5); i++) {
    const row = srcData[i].map(c => String(c || '').toLowerCase().trim());
    if (row.some(c => c === 'project') && row.some(c => c.indexOf('lead') !== -1 || c === 'no.')) {
      headerIdx = i; break;
    }
  }
  if (headerIdx < 0) return 'ABORT: Could not find header row in Working > Project Assign';

  report.push('  Header row found at index: ' + headerIdx + ' (row ' + (headerIdx + 1) + ')');
  report.push('  Headers: ' + JSON.stringify(srcData[headerIdx]));

  // Count data rows (non-empty Project column)
  const projectColIdx = srcData[headerIdx].findIndex(c => String(c).toLowerCase().trim() === 'project');
  const dataRows = srcData.slice(headerIdx + 1).filter(r => r[projectColIdx] && String(r[projectColIdx]).trim());
  report.push('  Data rows (non-empty Project): ' + dataRows.length);
  report.push('  Sample first 3 projects: ' + dataRows.slice(0, 3).map(r => r[projectColIdx]).join(', '));

  // Target: Hub Link > Project Assignment
  const hubBook = SpreadsheetApp.openById(MIG_HUB_ID);
  const tgt = hubBook.getSheetByName('Project Assignment');
  report.push('\nTARGET: Hub Link > "Project Assignment"');
  if (tgt) {
    report.push('  Tab EXISTS (current rows: ' + tgt.getLastRow() + ', cols: ' + tgt.getLastColumn() + ')');
    report.push('  Will CLEAR all content and REPLACE with clean data');
  } else {
    report.push('  Tab DOES NOT EXIST — will CREATE new tab');
  }

  report.push('\n=== PLAN ===');
  report.push('  1. Backup existing tab (if exists) → _BAK_ProjectAssignment_' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmm'));
  report.push('  2. Clear all content of Hub Link > "Project Assignment"');
  report.push('  3. Write headers (' + srcData[headerIdx].length + ' cols) at row 1');
  report.push('  4. Write ' + dataRows.length + ' data rows from row 2');
  report.push('\nRun executeBootstrapProjectAssignment() to apply.');

  Logger.log(report.join('\n'));
  return report.join('\n');
}

function executeBootstrapProjectAssignment() {
  const log = [];
  log.push('=== EXECUTING: Bootstrap Project Assignment ===\n');

  // Source: Working > Project Assign
  const wsBook = SpreadsheetApp.openById(MIG_WORKING_ID);
  const src = wsBook.getSheetByName('Project Assign');
  if (!src) return 'ABORT: Working > "Project Assign" not found';

  const srcData = src.getDataRange().getValues();

  // Find header row
  let headerIdx = -1;
  for (let i = 0; i < Math.min(srcData.length, 5); i++) {
    const row = srcData[i].map(c => String(c || '').toLowerCase().trim());
    if (row.some(c => c === 'project') && row.some(c => c.indexOf('lead') !== -1 || c === 'no.')) {
      headerIdx = i; break;
    }
  }
  if (headerIdx < 0) return 'ABORT: Could not find header row';

  const headers = srcData[headerIdx];
  const projectColIdx = headers.findIndex(c => String(c).toLowerCase().trim() === 'project');
  const dataRows = srcData.slice(headerIdx + 1).filter(r => r[projectColIdx] && String(r[projectColIdx]).trim());

  if (dataRows.length === 0) return 'ABORT: No data rows found';

  // Target: Hub Link > Project Assignment
  const hubBook = SpreadsheetApp.openById(MIG_HUB_ID);
  let tgt = hubBook.getSheetByName('Project Assignment');

  // Backup if exists
  if (tgt && tgt.getLastRow() > 0) {
    const ts = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmm');
    const bakName = '_BAK_ProjectAssignment_' + ts;
    if (!hubBook.getSheetByName(bakName)) {
      tgt.copyTo(hubBook).setName(bakName).hideSheet();
      log.push('BACKED UP: Project Assignment → ' + bakName);
    } else {
      log.push('SKIP backup (exists): ' + bakName);
    }
  }

  // Create if not exists
  if (!tgt) {
    tgt = hubBook.insertSheet('Project Assignment');
    log.push('CREATED new tab: Project Assignment');
  }

  // Clear all content
  tgt.clear();
  log.push('CLEARED: Project Assignment');

  // Write headers + data
  const allRows = [headers].concat(dataRows);
  tgt.getRange(1, 1, allRows.length, headers.length).setValues(allRows);

  // Style header row
  tgt.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1F4E78')
    .setFontColor('#FFFFFF');
  tgt.setFrozenRows(1);
  tgt.autoResizeColumns(1, headers.length);

  log.push('WROTE: 1 header row + ' + dataRows.length + ' data rows');
  log.push('STYLED: headers (bold, white on dark blue) + frozen row 1');
  log.push('\nNext: verify with ?action=projects in browser');
  log.push('  URL: https://script.google.com/macros/s/AKfycbyZlPkRkq4Bqd5FbR-DrPfaAQgu9cQ4OzEY9JXxL3qwzZ3M3PbnUCQ4j0rqX7jQwjLo/exec?action=projects');

  Logger.log(log.join('\n'));
  return log.join('\n');
}

// ====================================================
// BOOTSTRAP — Staff Directory (MERGE Working + Hub Link)
// Working > Contact gives: Phone, EmergencyContact, Alias
// Hub Link > Staff Directory gives: Role, Status, NameLastname, EmpCode, StartDate, Department
// Join key: Email
// Canonical output: No, Nickname, NameLastname, Level, Role, Department, Email,
//                   Phone, EmergencyContact, Alias, EmpCode, StartDate, Status
// ====================================================

// Canonical Staff schema (Hub Link output)
const STAFF_CANONICAL_HEADERS = [
  'No', 'Nickname', 'NameLastname', 'Level', 'Role', 'Department',
  'Email', 'Phone', 'EmergencyContact', 'Alias', 'EmpCode', 'StartDate', 'Status'
];

// Email cleanup rules (per Korn's review 2026-05-25, updated 2026-05-25 14:30)
// MAP: Working has wrong/old email → use the correct one (preserves Phone from Working row)
const STAFF_EMAIL_MAP = {
  'nacha@raceup.co.th':         'natcha@raceup.co.th',   // typo: missing 't'
  'iziing666@gmail.com':        'ize@raceup.co.th',      // old personal email
  'jiratchayada.pp@gmail.com':  'graphic@raceup.co.th',  // พรีม — moved to work email
  'thanakorn@raceup.co.th':     'checkpr@raceup.co.th',  // มาย — moved to work email
};
// SKIP: people no longer with company — drop these Working rows entirely
const STAFF_EMAIL_SKIP = [
  // (none currently — all staff active)
];

// Column name mapping (lowercase) → canonical field
const STAFF_COL_MAP = {
  // Working > Contact
  'no.': 'No', 'no': 'No',
  'ชื่อ': 'Nickname', 'nickname': 'Nickname',
  'level': 'Level',
  'อิเมล์': 'Email', 'email': 'Email', 'อีเมล': 'Email', 'อีเมล์': 'Email',
  'เบอร์ติดต่อ': 'Phone', 'phone': 'Phone', 'mobile': 'Phone',
  'alias': 'Alias',
  'เบอร์ฉุกเฉิน': 'EmergencyContact', 'emergency': 'EmergencyContact', 'emergencycontact': 'EmergencyContact',
  // Hub Link > Staff Directory (extra cols)
  'role': 'Role',
  'status': 'Status',
  'name lastname': 'NameLastname', 'fullname': 'NameLastname', 'name': 'NameLastname',
  'employee code': 'EmpCode', 'empcode': 'EmpCode', 'emp code': 'EmpCode',
  'start date': 'StartDate', 'startdate': 'StartDate',
  'department': 'Department', 'dept': 'Department',
};

function parseStaffSheet_(sheet) {
  if (!sheet) return { rows: [], headers: [], headerIdx: -1 };
  const data = sheet.getDataRange().getValues();
  // Find header row (within first 5 rows) that contains "Email" or "อิเมล" column
  let headerIdx = -1;
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const row = data[i].map(c => String(c || '').toLowerCase().trim());
    if (row.some(c => c === 'email' || c.indexOf('อิเมล') !== -1 || c.indexOf('อีเมล') !== -1)) {
      headerIdx = i; break;
    }
  }
  if (headerIdx < 0) return { rows: [], headers: [], headerIdx: -1 };

  const rawHeaders = data[headerIdx].map(c => String(c || '').trim());
  const canonicalHeaders = rawHeaders.map(h => STAFF_COL_MAP[h.toLowerCase()] || null);

  // Find email col idx (for filtering valid rows)
  const emailIdx = canonicalHeaders.findIndex(h => h === 'Email');

  const rows = [];
  for (let i = headerIdx + 1; i < data.length; i++) {
    const rawRow = data[i];
    if (emailIdx >= 0 && !rawRow[emailIdx]) continue;
    const obj = {};
    rawRow.forEach((val, idx) => {
      const canon = canonicalHeaders[idx];
      if (!canon) return;
      let cleaned = String(val || '').trim();
      // Email field — take only first line (some rows have "email\nrole description")
      if (canon === 'Email') {
        cleaned = cleaned.split(/[\n\r]/)[0].trim().toLowerCase();
        // Apply email mapping (fix typos/old addresses)
        if (STAFF_EMAIL_MAP[cleaned]) cleaned = STAFF_EMAIL_MAP[cleaned];
      }
      // Phone field — strip non-digit chars except + and -
      if (canon === 'Phone' || canon === 'EmergencyContact') {
        cleaned = cleaned.replace(/[\s]/g, '');  // remove spaces
      }
      obj[canon] = cleaned;
    });
    // Skip people no longer with company
    if (obj.Email && STAFF_EMAIL_SKIP.indexOf(obj.Email) !== -1) continue;
    if (Object.values(obj).some(v => v)) rows.push(obj);  // skip blank rows
  }
  return { rows: rows, headers: rawHeaders, canonicalHeaders: canonicalHeaders, headerIdx: headerIdx };
}

function dryRunBootstrapStaff() {
  const report = [];
  report.push('=== DRY RUN: Bootstrap Staff Directory (merge Working + Hub Link) ===\n');

  // Source A: Working > Contact
  const wsBook = SpreadsheetApp.openById(MIG_WORKING_ID);
  const wsContactTab = wsBook.getSheetByName('Contact');
  const workData = parseStaffSheet_(wsContactTab);
  report.push('SOURCE A: Working > "Contact"');
  report.push('  Header row at index: ' + workData.headerIdx);
  report.push('  Raw headers: ' + JSON.stringify(workData.headers));
  report.push('  Canonical mapped: ' + JSON.stringify(workData.canonicalHeaders));
  report.push('  Valid data rows: ' + workData.rows.length);
  report.push('  Sample emails: ' + workData.rows.slice(0, 3).map(r => r.Email).join(', '));

  // Source B: Hub Link > Staff Directory
  const hubBook = SpreadsheetApp.openById(MIG_HUB_ID);
  const hubStaffTab = hubBook.getSheetByName('Staff Directory');
  const hubData = parseStaffSheet_(hubStaffTab);
  report.push('\nSOURCE B: Hub Link > "Staff Directory"');
  if (!hubStaffTab) {
    report.push('  TAB NOT FOUND — will create new');
  } else {
    report.push('  Header row at index: ' + hubData.headerIdx);
    report.push('  Raw headers: ' + JSON.stringify(hubData.headers));
    report.push('  Canonical mapped: ' + JSON.stringify(hubData.canonicalHeaders));
    report.push('  Valid data rows: ' + hubData.rows.length);
    report.push('  Sample with extras: ' + hubData.rows.slice(0, 2).map(r =>
      r.Email + ' (Role=' + (r.Role || '-') + ', Dept=' + (r.Department || '-') + ')'
    ).join(' | '));
  }

  // Merge
  const merged = mergeStaffRows_(workData.rows, hubData.rows);
  report.push('\nMERGE RESULT: ' + merged.length + ' unified staff entries');
  report.push('Canonical output schema (' + STAFF_CANONICAL_HEADERS.length + ' cols): ' + STAFF_CANONICAL_HEADERS.join(', '));

  // Count how many have data in each canonical field
  const fieldStats = {};
  STAFF_CANONICAL_HEADERS.forEach(h => fieldStats[h] = 0);
  merged.forEach(r => STAFF_CANONICAL_HEADERS.forEach(h => { if (r[h]) fieldStats[h]++; }));
  report.push('\nField completeness (out of ' + merged.length + '):');
  STAFF_CANONICAL_HEADERS.forEach(h => {
    report.push('  ' + h.padEnd(20) + ' ' + fieldStats[h] + '/' + merged.length +
      (fieldStats[h] === merged.length ? ' ✓' : (fieldStats[h] > 0 ? '' : ' (EMPTY)')));
  });

  report.push('\nTo apply, run executeBootstrapStaff()');
  Logger.log(report.join('\n'));
  return report.join('\n');
}

function mergeStaffRows_(workRows, hubRows) {
  // Index hub rows by Email (lowercase)
  const hubByEmail = {};
  hubRows.forEach(r => {
    if (r.Email) hubByEmail[r.Email.toLowerCase()] = r;
  });

  const merged = [];
  workRows.forEach(wr => {
    const emailKey = wr.Email ? wr.Email.toLowerCase() : '';
    const hr = hubByEmail[emailKey] || {};
    // Combine — work first (Phone/Alias/Emergency), then hub (Role/Dept/etc)
    const combined = {};
    STAFF_CANONICAL_HEADERS.forEach(h => {
      combined[h] = wr[h] || hr[h] || '';
    });
    merged.push(combined);
  });

  // Also include hub-only rows (someone in Hub but not Working)
  const workEmails = workRows.map(r => (r.Email || '').toLowerCase());
  hubRows.forEach(hr => {
    if (hr.Email && workEmails.indexOf(hr.Email.toLowerCase()) === -1) {
      const combined = {};
      STAFF_CANONICAL_HEADERS.forEach(h => { combined[h] = hr[h] || ''; });
      combined._hubOnly = true;
      merged.push(combined);
    }
  });

  return merged;
}

// Diagnostic: show email overlap between Working and Hub Link Staff
function diagnoseStaffEmails() {
  const report = [];
  report.push('=== DIAGNOSE: Staff Email Match ===\n');

  const wsBook = SpreadsheetApp.openById(MIG_WORKING_ID);
  const workData = parseStaffSheet_(wsBook.getSheetByName('Contact'));

  const hubBook = SpreadsheetApp.openById(MIG_HUB_ID);
  const hubData = parseStaffSheet_(hubBook.getSheetByName('Staff Directory'));

  const workEmails = workData.rows.map(r => (r.Email || '').toLowerCase().trim()).filter(Boolean);
  const hubEmails = hubData.rows.map(r => (r.Email || '').toLowerCase().trim()).filter(Boolean);

  report.push('Working Contact emails (' + workEmails.length + '):');
  workEmails.forEach(e => report.push('  ' + e));

  report.push('\nHub Link Staff Directory emails (' + hubEmails.length + '):');
  hubEmails.forEach(e => report.push('  ' + e));

  const matched = workEmails.filter(e => hubEmails.indexOf(e) !== -1);
  const workOnly = workEmails.filter(e => hubEmails.indexOf(e) === -1);
  const hubOnly = hubEmails.filter(e => workEmails.indexOf(e) === -1);

  report.push('\n=== ANALYSIS ===');
  report.push('Matched (in both): ' + matched.length);
  matched.forEach(e => report.push('  ✓ ' + e));
  report.push('\nWORKING ONLY (need to add to Hub Link): ' + workOnly.length);
  workOnly.forEach(e => report.push('  W ' + e));
  report.push('\nHUB LINK ONLY (might be duplicates/typos): ' + hubOnly.length);
  hubOnly.forEach(e => report.push('  H ' + e));

  // Show full details of hub-only entries (name + role + dept + status) for decision
  report.push('\n=== HUB-ONLY DETAILS (review before delete/keep) ===');
  const hubByEmail = {};
  hubData.rows.forEach(r => { if (r.Email) hubByEmail[r.Email.toLowerCase().trim()] = r; });
  hubOnly.forEach(e => {
    const r = hubByEmail[e] || {};
    report.push('  • ' + (r.Nickname || '(no name)') +
      '  | Email: ' + e +
      '  | Role: ' + (r.Role || '-') +
      '  | Dept: ' + (r.Department || '-') +
      '  | Status: ' + (r.Status || '-') +
      '  | EmpCode: ' + (r.EmpCode || '-'));
  });

  // Find possible typo matches (Levenshtein-ish: same except 1 char)
  report.push('\n=== POSSIBLE TYPOS (W↔H differ by 1-2 chars) ===');
  workOnly.forEach(we => {
    hubOnly.forEach(he => {
      const dist = simpleDist_(we, he);
      if (dist <= 2 && we !== he) {
        report.push('  W="' + we + '"  ↔  H="' + he + '"  (dist=' + dist + ')');
      }
    });
  });

  Logger.log(report.join('\n'));
  return report.join('\n');
}

function simpleDist_(a, b) {
  if (Math.abs(a.length - b.length) > 3) return 99;
  let diff = 0;
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) if (a[i] !== b[i]) diff++;
  return diff;
}

function executeBootstrapStaff() {
  const log = [];
  log.push('=== EXECUTING: Bootstrap Staff Directory ===\n');

  // Parse both sources
  const wsBook = SpreadsheetApp.openById(MIG_WORKING_ID);
  const workData = parseStaffSheet_(wsBook.getSheetByName('Contact'));
  if (workData.rows.length === 0) return 'ABORT: No data in Working > Contact';

  const hubBook = SpreadsheetApp.openById(MIG_HUB_ID);
  const hubStaffTab = hubBook.getSheetByName('Staff Directory');
  const hubData = parseStaffSheet_(hubStaffTab);

  // Merge
  const merged = mergeStaffRows_(workData.rows, hubData.rows);
  if (merged.length === 0) return 'ABORT: Merge resulted in 0 rows';
  log.push('Merged: ' + merged.length + ' staff entries');

  // Backup existing tab (if exists)
  let tgt = hubStaffTab;
  if (tgt && tgt.getLastRow() > 0) {
    const ts = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmm');
    const bakName = '_BAK_StaffDirectory_' + ts;
    if (!hubBook.getSheetByName(bakName)) {
      tgt.copyTo(hubBook).setName(bakName).hideSheet();
      log.push('BACKED UP: Staff Directory → ' + bakName);
    }
  }

  if (!tgt) {
    tgt = hubBook.insertSheet('Staff Directory');
    log.push('CREATED new tab: Staff Directory');
  }

  // Clear + write
  tgt.clear();
  log.push('CLEARED: Staff Directory');

  // Renumber No column (sequential)
  merged.forEach((r, i) => { if (!r.No) r.No = (i + 1).toString(); });

  // Build rows
  const headerRow = STAFF_CANONICAL_HEADERS;
  const dataRows = merged.map(r => STAFF_CANONICAL_HEADERS.map(h => r[h] || ''));
  const allRows = [headerRow].concat(dataRows);

  tgt.getRange(1, 1, allRows.length, headerRow.length).setValues(allRows);

  // Style header
  tgt.getRange(1, 1, 1, headerRow.length)
    .setFontWeight('bold')
    .setBackground('#1F4E78')
    .setFontColor('#FFFFFF');
  tgt.setFrozenRows(1);
  tgt.autoResizeColumns(1, headerRow.length);

  log.push('WROTE: 1 header row + ' + dataRows.length + ' data rows');
  log.push('SCHEMA: ' + headerRow.join(' | '));
  log.push('\nNext: verify with ?action=staff');

  Logger.log(log.join('\n'));
  return log.join('\n');
}

// ====================================================
// BOOTSTRAP — Events (enrich Hub Link Project Info)
// Adds canonical cols: Province, Venue, Color, Series, Status
// Data source: EVENTS_FALLBACK in Code.gs (master events.js authoritative)
// ====================================================
const EVENTS_CANONICAL_HEADERS = [
  'No', 'EventName', 'Code', 'ExpoDate', 'RaceDate', 'Target',
  'Province', 'Venue', 'Distance', 'Category', 'Series', 'Color', 'Status',
  'FB', 'BannerLink', 'LogoLink', 'RegistrationLink'
];

// Map old (raw) header → canonical
const EVENTS_COL_MAP = {
  '': 'No',
  'no': 'No', 'no.': 'No', '#': 'No',
  'event name': 'EventName', 'name': 'EventName', 'eventname': 'EventName',
  'code': 'Code',
  'expo day': 'ExpoDate', 'expo': 'ExpoDate', 'expodate': 'ExpoDate',
  'race day': 'RaceDate', 'date': 'RaceDate', 'race date': 'RaceDate', 'racedate': 'RaceDate',
  'runner target': 'Target', 'target': 'Target',
  'venue': 'Venue', 'venueshort': 'Venue', 'venue short': 'Venue',
  'distance': 'Distance', 'distances': 'Distance',
  'location': 'Province', 'province': 'Province',
  'event catagory': 'Category', 'event category': 'Category', 'category': 'Category',
  'series': 'Series',
  'color': 'Color',
  'status': 'Status',
  'fb': 'FB', 'facebook': 'FB',
  'banner link': 'BannerLink', 'banner': 'BannerLink',
  'logo link': 'LogoLink', 'logo': 'LogoLink',
  'registration link': 'RegistrationLink', 'registration': 'RegistrationLink', 'reglink': 'RegistrationLink',
};

function parseEventsSheet_(sheet) {
  if (!sheet) return { rows: [], headers: [], headerIdx: -1 };
  const data = sheet.getDataRange().getValues();

  // Find header row (within first 5 rows) that contains "Code"
  let headerIdx = -1;
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const row = data[i].map(c => String(c || '').toLowerCase().trim());
    if (row.indexOf('code') !== -1) { headerIdx = i; break; }
  }
  if (headerIdx < 0) return { rows: [], headers: [], headerIdx: -1 };

  const rawHeaders = data[headerIdx].map(c => String(c || '').trim());
  const canonicalHeaders = rawHeaders.map(h => EVENTS_COL_MAP[h.toLowerCase()] || null);
  const codeIdx = canonicalHeaders.findIndex(h => h === 'Code');

  const rows = [];
  for (let i = headerIdx + 1; i < data.length; i++) {
    const rawRow = data[i];
    if (codeIdx >= 0 && !rawRow[codeIdx]) continue;
    const obj = {};
    rawRow.forEach((val, idx) => {
      const canon = canonicalHeaders[idx];
      if (!canon) return;
      let v = val;
      if (v instanceof Date) v = Utilities.formatDate(v, 'GMT+7', 'yyyy-MM-dd');
      else v = String(v || '').trim();
      obj[canon] = v;
    });
    if (obj.Code) rows.push(obj);
  }
  return { rows: rows, headers: rawHeaders, canonicalHeaders: canonicalHeaders, headerIdx: headerIdx };
}

function dryRunBootstrapEvents() {
  const report = [];
  report.push('=== DRY RUN: Bootstrap Events (Project Info) ===\n');

  // Source A: Hub Link > Project Info (primary)
  const hubBook = SpreadsheetApp.openById(MIG_HUB_ID);
  const hubData = parseEventsSheet_(hubBook.getSheetByName('Project Info'));
  report.push('SOURCE A: Hub Link > "Project Info"');
  report.push('  Header row at index: ' + hubData.headerIdx);
  report.push('  Raw headers: ' + JSON.stringify(hubData.headers));
  report.push('  Canonical mapped: ' + JSON.stringify(hubData.canonicalHeaders));
  report.push('  Valid data rows: ' + hubData.rows.length);
  report.push('  Sample codes: ' + hubData.rows.slice(0, 5).map(r => r.Code).join(', '));

  // Source B: Working > Quick Fact (for cross-check)
  const wsBook = SpreadsheetApp.openById(MIG_WORKING_ID);
  const wsData = parseEventsSheet_(wsBook.getSheetByName('Quick Fact'));
  report.push('\nSOURCE B: Working > "Quick Fact" (cross-check only)');
  report.push('  Valid data rows: ' + wsData.rows.length);

  // Source C: EVENTS_FALLBACK (master events.js — authoritative for Province/Color/Series)
  if (typeof EVENTS_FALLBACK === 'undefined') {
    return 'ABORT: EVENTS_FALLBACK not found. Make sure Code.gs is in same Apps Script project.';
  }
  report.push('\nSOURCE C: EVENTS_FALLBACK (in Code.gs): ' + EVENTS_FALLBACK.length + ' events');

  // Merge: Hub Link primary + EVENTS_FALLBACK enrichment
  const merged = mergeEventsRows_(hubData.rows);
  report.push('\nMERGE RESULT: ' + merged.length + ' enriched events');
  report.push('Canonical output (' + EVENTS_CANONICAL_HEADERS.length + ' cols): ' + EVENTS_CANONICAL_HEADERS.join(', '));

  // Field completeness
  const stats = {};
  EVENTS_CANONICAL_HEADERS.forEach(h => stats[h] = 0);
  merged.forEach(r => EVENTS_CANONICAL_HEADERS.forEach(h => { if (r[h]) stats[h]++; }));
  report.push('\nField completeness (out of ' + merged.length + '):');
  EVENTS_CANONICAL_HEADERS.forEach(h => {
    report.push('  ' + h.padEnd(18) + ' ' + stats[h] + '/' + merged.length +
      (stats[h] === merged.length ? ' ✓' : (stats[h] > 0 ? '' : ' (EMPTY)')));
  });

  // Codes mismatch check
  const hubCodes = hubData.rows.map(r => r.Code);
  const fbCodes = EVENTS_FALLBACK.map(e => e.code);
  const inHubNotFB = hubCodes.filter(c => fbCodes.indexOf(c) === -1);
  const inFBNotHub = fbCodes.filter(c => hubCodes.indexOf(c) === -1);
  if (inHubNotFB.length || inFBNotHub.length) {
    report.push('\n⚠️ CODE MISMATCH between Hub Link and EVENTS_FALLBACK:');
    if (inHubNotFB.length) report.push('  Hub only (not in fallback): ' + inHubNotFB.join(', '));
    if (inFBNotHub.length) report.push('  Fallback only (not in Hub): ' + inFBNotHub.join(', '));
  } else {
    report.push('\n✓ Codes match perfectly between Hub Link and EVENTS_FALLBACK');
  }

  report.push('\nTo apply, run executeBootstrapEvents()');
  Logger.log(report.join('\n'));
  return report.join('\n');
}

function mergeEventsRows_(hubRows) {
  const fbMap = {};
  EVENTS_FALLBACK.forEach(e => { fbMap[e.code] = e; });

  return hubRows.map((hr, i) => {
    const fb = fbMap[hr.Code] || {};
    return {
      No:               hr.No || (i + 1).toString(),
      EventName:        hr.EventName || fb.name || '',
      Code:             hr.Code,
      ExpoDate:         hr.ExpoDate || fb.expoDate || '',
      RaceDate:         hr.RaceDate || fb.date || '',
      Target:           hr.Target || fb.target || '',
      Province:         hr.Province || fb.province || '',
      Venue:            hr.Venue || fb.venueShort || '',
      Distance:         hr.Distance || (fb.distances ? fb.distances.join(' ') : ''),
      Category:         hr.Category || fb.category || '',
      Series:           fb.series || hr.Series || '',
      Color:            fb.color || hr.Color || '',
      Status:           hr.Status || 'Active',
      FB:               hr.FB || '',
      BannerLink:       hr.BannerLink || '',
      LogoLink:         hr.LogoLink || '',
      RegistrationLink: hr.RegistrationLink || '',
    };
  });
}

function executeBootstrapEvents() {
  const log = [];
  log.push('=== EXECUTING: Bootstrap Events (Project Info) ===\n');

  const hubBook = SpreadsheetApp.openById(MIG_HUB_ID);
  const tgt = hubBook.getSheetByName('Project Info');
  if (!tgt) return 'ABORT: Hub Link > "Project Info" not found';

  const hubData = parseEventsSheet_(tgt);
  if (hubData.rows.length === 0) return 'ABORT: No data parsed from Project Info';

  // Merge with EVENTS_FALLBACK enrichment
  const merged = mergeEventsRows_(hubData.rows);
  log.push('Merged: ' + merged.length + ' enriched events');

  // Backup
  const ts = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmm');
  const bakName = '_BAK_ProjectInfo_' + ts;
  if (!hubBook.getSheetByName(bakName)) {
    tgt.copyTo(hubBook).setName(bakName).hideSheet();
    log.push('BACKED UP: Project Info → ' + bakName);
  }

  // Clear + write
  tgt.clear();
  const headerRow = EVENTS_CANONICAL_HEADERS;
  const dataRows = merged.map(r => headerRow.map(h => r[h] || ''));
  const allRows = [headerRow].concat(dataRows);
  tgt.getRange(1, 1, allRows.length, headerRow.length).setValues(allRows);

  // Style
  tgt.getRange(1, 1, 1, headerRow.length)
    .setFontWeight('bold')
    .setBackground('#1F4E78')
    .setFontColor('#FFFFFF');
  tgt.setFrozenRows(1);
  tgt.autoResizeColumns(1, headerRow.length);

  log.push('CLEARED + WROTE: 1 header + ' + dataRows.length + ' rows');
  log.push('SCHEMA: ' + headerRow.join(' | '));
  log.push('\nIMPORTANT: Must also redeploy Code.gs (Phase F.7 added "Project Info" to events fallback)');

  Logger.log(log.join('\n'));
  return log.join('\n');
}

// ====================================================
// ROLLBACK — restore from latest backup (manual operation)
// ====================================================
function listBackups() {
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const backups = sh.getSheets().map(s => s.getName()).filter(n => n.startsWith('_BAK_'));
  Logger.log('Backups found:\n' + backups.join('\n'));
  return backups;
}

function deleteBackups_DANGER() {
  // Only run after verifying migration is OK and you no longer need backups
  // This is destructive — confirm twice before running
  const sh = SpreadsheetApp.openById(MIG_HUB_ID);
  const backups = sh.getSheets().filter(s => s.getName().startsWith('_BAK_'));
  if (backups.length === 0) return 'No backups to delete.';
  backups.forEach(b => sh.deleteSheet(b));
  return 'Deleted ' + backups.length + ' backup tabs.';
}
