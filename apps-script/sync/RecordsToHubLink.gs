/**
 * Race Up Work — Records Sheets → Hub Link Sync
 * ==============================================
 * Sync ผลการแข่งขัน (records) จาก platform sheets → Hub Link Sheet
 *
 * Deploy to:
 *   Apps Script project ที่ standalone (ไม่ attach Sheet ใด ๆ)
 *   หรือ attach กับ Hub Link Sheet ก็ได้
 *
 * Sources:
 *   1. SSP10 Records      `1xFdxW8WtbOZnawDkU6AsmTCeK1dEP_bfw48qR6fbmWo`
 *      (ใช้โดย korat-marathon-2026, supersports-10mile-2026, scenic-631-members)
 *   2. Scenic Records     `1fGgFEkCaWVp8yPAEhwrjlAHCqOEb8rs1W7iE30d3THM`
 *      (ใช้โดย scenicmarathon-website)
 *   3. Checkracer Events  `1x6iAav9rgP9zwKwtbJg3LGMgszc15V-D` (ID อาจไม่ครบ — ต้อง verify)
 *
 * Strategy:
 *   - ดึงทุก tab จากแต่ละ Sheet
 *   - mirror ลง Hub Link Sheet เป็น `Live_Records_<source>_<tabname>`
 *   - Run weekly (records ไม่ urgent — เปลี่ยนแค่หลังงานวิ่ง)
 *
 * Phase 2 (future): generate records-<event>.js files in master-data repo
 */

const HUB_LINK_SHEET_ID = '1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q';

const RECORDS_SOURCES = [
  {
    name:     'ssp10',
    sheetId:  '1xFdxW8WtbOZnawDkU6AsmTCeK1dEP_bfw48qR6fbmWo',
    label:    'SSP10 / Korat Records',
    tabPrefix:'Live_Records_SSP10_',
    syncAll:  true, // sync ทุก tab
  },
  {
    name:     'scenic',
    sheetId:  '1fGgFEkCaWVp8yPAEhwrjlAHCqOEb8rs1W7iE30d3THM',
    label:    'Scenic Marathon Records',
    tabPrefix:'Live_Records_Scenic_',
    syncAll:  true,
  },
  {
    name:     'checkracer',
    sheetId:  '1x6iAav9rgP9zwKwtbJg3LGMgszc15V-D',  // ⚠️ ID อาจไม่สมบูรณ์ — verify ก่อน deploy
    label:    'Checkracer Events',
    tabPrefix:'Live_Records_Checkracer_',
    syncAll:  true,
  },
];

const LOG_TAB = 'Sync Log';
const MAX_TABS_PER_SOURCE = 30; // limit ป้องกัน sheet explode (มี records เก่าๆ เยอะ)

// ====================================================
// Main
// ====================================================
function syncRecordsToHubLink() {
  const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
  const log = [];
  let okCount = 0, errCount = 0;

  RECORDS_SOURCES.forEach(source => {
    try {
      const src = SpreadsheetApp.openById(source.sheetId);
      const tabs = src.getSheets().slice(0, MAX_TABS_PER_SOURCE);
      let sourceOk = 0;
      tabs.forEach(srcSheet => {
        const tabName = srcSheet.getName();
        const dstName = source.tabPrefix + tabName.replace(/\s+/g, '_').slice(0, 80);
        try {
          const result = syncOneRecordsTab_(srcSheet, dst, dstName, source);
          log.push([new Date(), source.name + '/' + tabName, dstName, 'OK', result.rows, source.label]);
          sourceOk++;
        } catch (err) {
          log.push([new Date(), source.name + '/' + tabName, dstName, 'ERROR', 0, err.toString()]);
          errCount++;
        }
      });
      okCount += sourceOk;
    } catch (err) {
      log.push([new Date(), source.name, '-', 'ERROR-source', 0, 'Cannot open: ' + err.toString()]);
      errCount++;
    }
  });

  appendSyncLog_(dst, log);
  return { ok: okCount, errors: errCount };
}

function syncOneRecordsTab_(srcSheet, dstWb, dstName, sourceMeta) {
  const data = srcSheet.getDataRange().getValues();
  if (data.length === 0) return { rows: 0 };

  let dstSheet = dstWb.getSheetByName(dstName);
  if (!dstSheet) {
    dstSheet = dstWb.insertSheet(dstName);
  } else {
    dstSheet.clear();
  }
  dstSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  dstSheet.getRange(1, 1).setNote(
    'Auto-synced from ' + sourceMeta.label + '\n' +
    'Source: ' + sourceMeta.sheetId + '\n' +
    'Source tab: ' + srcSheet.getName() + '\n' +
    'Sync time: ' + new Date().toISOString()
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
// Trigger — weekly Monday 07:00 ICT
// ====================================================
function setupRecordsTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'syncRecordsToHubLink') ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('syncRecordsToHubLink')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .create();

  return 'OK — weekly Monday 07:00 trigger installed';
}

function verifyRecordsAccess() {
  const results = [];
  RECORDS_SOURCES.forEach(source => {
    try {
      const ss = SpreadsheetApp.openById(source.sheetId);
      results.push('✅ ' + source.name + ': ' + ss.getName() + ' (' + ss.getSheets().length + ' tabs)');
    } catch (e) {
      results.push('❌ ' + source.name + ': ' + e.toString());
    }
  });
  try {
    const dst = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    results.push('✅ DEST: ' + dst.getName());
  } catch (e) {
    results.push('❌ DEST: ' + e.toString());
  }
  return results.join('\n');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🔄 Sync Records to Hub Link')
    .addItem('▶️ Sync ALL records now', 'syncRecordsToHubLink')
    .addItem('🔧 Setup Trigger', 'setupRecordsTriggers')
    .addItem('🔍 Verify Access', 'verifyRecordsAccess_menu')
    .addToUi();
}

function verifyRecordsAccess_menu() {
  SpreadsheetApp.getUi().alert(verifyRecordsAccess());
}
