/**
 * Race Up Work — Post Event Sheet → Hub Link Sync
 * ================================================
 * Sync Form submissions จาก Master Numbers Post Event Sheet → Hub Link Sheet
 *
 * Deploy to:
 *   Apps Script project attached to "Master Numbers Post Event Sheet"
 *   (https://docs.google.com/spreadsheets/d/1S660jE9zT_gN4fqNqrtPDRVUkEbQqCJzkSfUkUsqE-E/edit)
 *
 * Direction: Form Sheet (write by form.raceup.co.th) → Hub Link (read-only mirror)
 *
 * Why separate from WorkingToHubLink.gs:
 *   - คนละ Sheet (สิทธิ์ต่างกัน)
 *   - schema ต่างกัน (form submissions vs manual edits)
 *   - sync less frequent (form submissions ไม่ urgent — daily OK)
 */

const POST_EVENT_SHEET_ID = '1S660jE9zT_gN4fqNqrtPDRVUkEbQqCJzkSfUkUsqE-E';
const HUB_LINK_SHEET_ID   = '1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q';

// Sync mapping — adjust ตาม actual tabs ใน Post Event Sheet
// (ผมไม่รู้ tab names จริง — ใช้ generic placeholder · user แก้ตาม actual)
const POST_EVENT_SYNC_MAP = [
  { from: 'Form Responses 1',  to: 'Live_PostEvent_Submissions', description: 'Post-event form submissions' },
  // เพิ่ม tabs อื่นๆ ถ้ามี (เช่น "AAR Notes", "Summary", "Per Event")
];

const LOG_TAB = 'Sync Log';

// ====================================================
// Main
// ====================================================
function syncPostEventToHubLink() {
  const src = SpreadsheetApp.openById(POST_EVENT_SHEET_ID);
  const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
  const log = [];
  let okCount = 0;

  POST_EVENT_SYNC_MAP.forEach(({ from, to, description }) => {
    try {
      const result = syncTab_(src, dst, from, to);
      log.push([new Date(), from, to, 'OK', result.rows, description]);
      okCount++;
    } catch (err) {
      log.push([new Date(), from, to, 'ERROR', 0, err.toString()]);
    }
  });

  appendSyncLog_(dst, log);
  return { ok: okCount, total: POST_EVENT_SYNC_MAP.length };
}

function syncTab_(srcWb, dstWb, fromName, toName) {
  const srcSheet = srcWb.getSheetByName(fromName);
  if (!srcSheet) throw new Error('Source tab not found: ' + fromName);

  const data = srcSheet.getDataRange().getValues();
  if (data.length === 0) return { rows: 0 };

  let dstSheet = dstWb.getSheetByName(toName);
  if (!dstSheet) {
    dstSheet = dstWb.insertSheet(toName);
  } else {
    dstSheet.clear();
  }

  dstSheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  dstSheet.getRange(1, 1).setNote(
    'Auto-synced from Post Event Sheet (1S660jE9)\n' +
    'Sync time: ' + new Date().toISOString() + '\n' +
    '⚠️ Read-only — submissions มาจาก form.raceup.co.th'
  );

  return { rows: data.length };
}

function appendSyncLog_(dstWb, logEntries) {
  let logSheet = dstWb.getSheetByName(LOG_TAB);
  if (!logSheet) {
    logSheet = dstWb.insertSheet(LOG_TAB);
    logSheet.appendRow(['Timestamp', 'Source Tab', 'Dest Tab', 'Status', 'Rows', 'Details']);
  }
  logEntries.forEach(row => logSheet.appendRow(row));
}

// ====================================================
// Triggers — daily 06:30 ICT (30 min after WorkingToHubLink)
// ====================================================
function setupPostEventTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'syncPostEventToHubLink') ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('syncPostEventToHubLink')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .nearMinute(30)
    .create();

  return 'OK — daily trigger 06:30 ICT installed';
}

function verifyPostEventAccess() {
  try {
    const src = SpreadsheetApp.openById(POST_EVENT_SHEET_ID);
    const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    return '✅ Source: ' + src.getName() + '\n' +
           '✅ Dest:   ' + dst.getName() + '\n' +
           '✅ Tabs in source: ' + src.getSheets().map(s => s.getName()).join(', ');
  } catch (e) {
    return '❌ ' + e.toString();
  }
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🔄 Sync to Hub Link')
    .addItem('▶️ Sync Post Events now', 'syncPostEventToHubLink')
    .addItem('🔧 Setup Triggers', 'setupPostEventTriggers')
    .addItem('🔍 Verify Access', 'verifyPostEventAccess_menu')
    .addToUi();
}

function verifyPostEventAccess_menu() {
  SpreadsheetApp.getUi().alert(verifyPostEventAccess());
}
