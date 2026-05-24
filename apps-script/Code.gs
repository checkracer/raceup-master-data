/**
 * Raceup Master Data — Google Apps Script Web App
 * Single source of truth สำหรับข้อมูลงานวิ่ง 22 งาน + categories
 *
 * Endpoints:
 *  ?action=events           — รายชื่อ 22 งาน (sync จาก Master Numbers Sheet)
 *  ?action=categories       — Race Pack categories + status flow
 *  ?action=event&code=XX    — รายละเอียดงานเดียว
 *  ?action=ping
 *
 * Deploy:
 *  1. New Project → name "RaceupMasterData API"
 *  2. Paste Code.gs + appsscript.json
 *  3. Deploy → Web app → Execute as Me, Anyone access
 *  4. ใช้ URL กับ subdomain ที่อยากดึง master data
 */

const MASTER_NUMBERS_SHEET_ID = '157hY6e059YxC8m73h6aTufExRiupZgaSsd7lVl9kuQM';
const ALLOWED_ORIGINS = ['https://no.raceup.co.th', 'https://racepack.raceup.co.th', 'https://hub.raceup.co.th'];

// ====================================================
// Hardcoded fallback — ใช้เมื่อ Sheet ไม่ available
// (Sync ครั้งสุดท้าย: 2026-05-22 จาก ops.raceup.co.th)
// ====================================================
const EVENTS_FALLBACK = [
  { code:'KYM26',   name:'Khao Yai Marathon 2026',                     expoDate:'2026-01-10', date:'2026-01-11', province:'นครราชสีมา', venueShort:'เขาใหญ่', distances:['42K','21K','10K','5K','2K'], color:'#2E8B57', category:'OE', series:'Standalone OE', target:7500 },
  { code:'PO26',    name:'Pocari Sweat Run 2026',                       expoDate:'2026-01-16', date:'2026-01-17', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K','3K'], color:'#0072CE', category:'EO', series:'EO Brand', target:6000 },
  { code:'AMN26',   name:'Amino Vital Run 2026',                        expoDate:'2026-02-07', date:'2026-02-08', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K','3K'], color:'#E60012', category:'EO', series:'EO Brand', target:4000 },
  { code:'PSMH26',  name:'Scenic Half Marathon Pranburi 2026',          expoDate:'2026-02-14', date:'2026-02-15', province:'ประจวบคีรีขันธ์', venueShort:'ปราณบุรี', distances:['21K','10K','5K','3K'], color:'#1D7BC4', category:'OE', series:'Scenic Series', target:3500 },
  { code:'SSP26',   name:'Supersports 10 Mile Run 2026',                expoDate:'2026-05-16', date:'2026-05-17', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10Mile','10K','5K'], color:'#39FF14', category:'EO', series:'EO Brand', target:7500 },
  { code:'PBR26',   name:'Pink Blue Run 2026',                          expoDate:null,         date:'2026-05-24', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K','3K'], color:'#FF69B4', category:'EO', series:'EO Brand', target:3000 },
  { code:'CSMH26',  name:'Scenic Half Marathon Chanthaburi 2026',       expoDate:'2026-06-06', date:'2026-06-07', province:'จันทบุรี', venueShort:'จันทบุรี', distances:['21K','10K','5K','3K'], color:'#06A77D', category:'OE', series:'Scenic Series', target:4500 },
  { code:'KTJ26',   name:'ก้าวท้าใจ 10K Thailand Championship 2026',   expoDate:'2026-06-20', date:'2026-06-21', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K'], color:'#F4A300', category:'EO', series:'EO Brand', target:8000 },
  { code:'LR26',    name:'League Run 2026',                             expoDate:null,         date:'2026-06-28', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['Team 10K','Team 5K'], color:'#FFC107', category:'OE', series:'Standalone OE', target:1000 },
  { code:'RSMH26',  name:'Scenic Half Marathon Rayong 2026',            expoDate:'2026-08-01', date:'2026-08-02', province:'ระยอง', venueShort:'ระยอง', distances:['21K','10K'], color:'#5B8DEF', category:'OE', series:'Scenic Series', target:4500 },
  { code:'CTP-BKK', name:'Counterpain Run 2026 Bangkok',                expoDate:'2026-08-22', date:'2026-08-23', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K'], color:'#00A6A6', category:'OE', series:'Counterpain Series', target:1000 },
  { code:'CTP-KR',  name:'Counterpain Run 2026 Korat',                  expoDate:null,         date:'2026-09-06', province:'นครราชสีมา', venueShort:'โคราช', distances:['10K','5K'], color:'#00A6A6', category:'EO', series:'Counterpain Series', target:500 },
  { code:'KSMH26',  name:'Scenic Half Marathon Krabi 2026',             expoDate:'2026-09-12', date:'2026-09-13', province:'กระบี่', venueShort:'กระบี่', distances:['21K','10K','5K','3K'], color:'#00A8A8', category:'OE', series:'Scenic Series', target:4000 },
  { code:'CTP-KAN', name:'Counterpain Run 2026 Kanchanaburi',           expoDate:null,         date:'2026-09-20', province:'กาญจนบุรี', venueShort:'กาญจนบุรี', distances:['10K','5K'], color:'#00A6A6', category:'EO', series:'Counterpain Series', target:500 },
  { code:'KCT26',   name:'Koh Chang Trail 2026',                        expoDate:'2026-09-26', date:'2026-09-27', province:'ตราด', venueShort:'เกาะช้าง', distances:['Trail 55K','30K','15K','8K'], color:'#7B5E3C', category:'OE', series:'Standalone OE', target:1500 },
  { code:'CTP-KK',  name:'Counterpain Run 2026 Khon Kaen',              expoDate:null,         date:'2026-10-04', province:'ขอนแก่น', venueShort:'ขอนแก่น', distances:['10K','5K'], color:'#00A6A6', category:'EO', series:'Counterpain Series', target:500 },
  { code:'CMSH26',  name:'Scenic Half Marathon Chiang Mai 2026',        expoDate:'2026-10-31', date:'2026-11-01', province:'เชียงใหม่', venueShort:'เชียงใหม่', distances:['21K','10K','5K','3K'], color:'#FF6B35', category:'OE', series:'Scenic Series', target:4500 },
  { code:'KRM26',   name:'Korat Marathon 2026',                         expoDate:'2026-11-07', date:'2026-11-08', province:'นครราชสีมา', venueShort:'โคราช', distances:['42K','21K','10K','5K'], color:'#E63946', category:'OE', series:'Standalone OE', target:10000 },
  { code:'WR26',    name:'Allianz Ayudhya World Run 2026',              expoDate:'2026-11-21', date:'2026-11-22', province:'นครราชสีมา', venueShort:'โคราช', distances:['10K','5K'], color:'#0033A0', category:'EO', series:'EO Brand', target:5000 },
  { code:'GR26',    name:'Garmin Run Thailand 2026 World Series',       expoDate:'2026-12-05', date:'2026-12-06', province:'พระนครศรีอยุธยา', venueShort:'อยุธยา', distances:['21K','10K','5K'], color:'#007AC1', category:'EO', series:'EO Brand', target:5500 },
  { code:'NSMH26',  name:'Scenic Half Marathon Nakhon Phanom 2026',     expoDate:'2026-12-12', date:'2026-12-13', province:'นครพนม', venueShort:'นครพนม', distances:['42K','21K','10K','5K'], color:'#8B5A3C', category:'OE', series:'Scenic Series', target:4000 },
  { code:'GAT26',   name:'Gatorade Run 2026',                           expoDate:'2026-12-26', date:'2026-12-27', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K'], color:'#FF6F00', category:'EO', series:'EO Brand', target:5000 }
];

const CATEGORIES = [
  { id:'medal',  name:'เหรียญ Finisher',  icon:'medal',         lots:3, buffer:true,  default_buffer_no_show:5 },
  { id:'shirt',  name:'เสื้อนักวิ่ง',     icon:'shirt',         lots:3, buffer:false, size_ratio:{ XS:.05, S:.15, M:.25, L:.25, XL:.18, '2XL':.08, '3XL':.04 } },
  { id:'bib',    name:'BIB (Runner #)',   icon:'hash',          lots:1, buffer:true,  default_buffer:50 },
  { id:'trophy', name:'โล่รางวัล',        icon:'trophy',        lots:1, buffer:false },
  { id:'bag',    name:'ถุงผ้า',           icon:'shopping-bag',  lots:1, buffer:true,  default_buffer_no_show:5 },
  { id:'top100', name:'รางวัล Top 100',   icon:'award',         lots:1, buffer:false, fixed_qty:200 }
];

const STATUS_FLOW = [
  { id:'planning',   label:'วางแผน',         color:'#8E939B' },
  { id:'quoted',     label:'ขอใบเสนอราคา',   color:'#185FA5' },
  { id:'po-sent',    label:'ส่ง PO',          color:'#EF9F27' },
  { id:'production', label:'กำลังผลิต',      color:'#EE4439' },
  { id:'qc',         label:'QC',              color:'#534AB7' },
  { id:'shipping',   label:'ขนส่ง',          color:'#185FA5' },
  { id:'arrived',    label:'รับของแล้ว',     color:'#1D9E75' },
  { id:'completed',  label:'เสร็จสิ้น',      color:'#1D9E75' }
];

// ====================================================
// Entry Points
// ====================================================
function doGet(e) {
  const action = (e.parameter.action || 'events').toLowerCase();
  let result;
  try {
    switch (action) {
      case 'ping':        result = { ok:true, time:new Date().toISOString() }; break;
      case 'events':      result = getEvents(); break;
      case 'categories':  result = getCategories(); break;
      case 'event':       result = getEvent(e.parameter.code); break;
      case 'js':          return serveEventsJs();
      default: result = { error:'Unknown action. Try: ping, events, categories, event, js' };
    }
  } catch (err) {
    result = { error: err.toString() };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ====================================================
// Endpoints
// ====================================================
function getEvents() {
  // ตอนนี้ใช้ fallback. ในอนาคต = sync จาก Master Numbers Sheet
  // หรือจาก Sheet กลาง "RaceupMasterData" ที่ทีม edit ผ่าน Google Sheets
  return {
    ok: true,
    count: EVENTS_FALLBACK.length,
    events: EVENTS_FALLBACK,
    updated_at: new Date().toISOString(),
    source: 'fallback-v2026.05.22'
  };
}

function getCategories() {
  return {
    ok: true,
    categories: CATEGORIES,
    status_flow: STATUS_FLOW
  };
}

function getEvent(code) {
  if (!code) return { error: 'Missing code parameter' };
  const ev = EVENTS_FALLBACK.find(e => e.code.toUpperCase() === code.toUpperCase());
  return ev ? { ok:true, event:ev } : { error:'Event not found: ' + code };
}

// ====================================================
// Serve as JS file (for direct <script src> include)
// GET ?action=js → returns events.js content (window.RACEUP_EVENTS = [...])
// ====================================================
function serveEventsJs() {
  const lines = [
    '/* Auto-generated from RaceupMasterData Apps Script — ' + new Date().toISOString() + ' */',
    'window.RACEUP_EVENTS = ' + JSON.stringify(EVENTS_FALLBACK, null, 2) + ';',
    'window.RACEPACK_CATEGORIES = ' + JSON.stringify(CATEGORIES) + ';',
    'window.RACEPACK_STATUS_FLOW = ' + JSON.stringify(STATUS_FLOW) + ';',
    'window.getEventByCode = function(code) { return (window.RACEUP_EVENTS||[]).find(e => e.code.toUpperCase()===String(code).toUpperCase()) || null; };',
    'window.getNextEvent = function() { const today=new Date().toISOString().slice(0,10); return (window.RACEUP_EVENTS||[]).filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0] || null; };',
    'window.getEventsBySeries = function(s) { return (window.RACEUP_EVENTS||[]).filter(e=>e.series===s); };',
    'window.getTotalTarget = function() { return (window.RACEUP_EVENTS||[]).reduce((sum,e)=>sum+(e.target||0),0); };'
  ];
  return ContentService.createTextOutput(lines.join('\n'))
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// ====================================================
// Test
// ====================================================
function testEvents() {
  Logger.log(JSON.stringify(getEvents(), null, 2));
}
