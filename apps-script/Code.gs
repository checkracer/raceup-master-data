/**
 * Raceup Master Data — Google Apps Script Web App
 * ============================================================
 * Single source of truth สำหรับข้อมูลงานวิ่ง + staff + project + sponsors + suppliers
 *
 * Phase C update (2026-05-25):
 *   - Source switched: Working Sheet (13t_phz) → Hub Link Sheet (1Um6I4VG)
 *   - Smart tab fallback: Live_* (synced) → direct tabs → embedded fallback
 *   - Works regardless of whether sync is deployed
 *
 * Endpoints:
 *   ?action=ping          — heartbeat
 *   ?action=events        — 22+ events (events list)
 *   ?action=event&code=XX — single event by code
 *   ?action=categories    — Race Pack categories
 *   ?action=staff         — 22 staff with phone + emergency
 *   ?action=projects      — 37 project assignments
 *   ?action=project&code=XX — single project by event code
 *   ?action=sponsors[&event=XX] — sponsors all or per event
 *   ?action=suppliers[&category=medal] — suppliers all or per category
 *   ?action=js            — events.js as JavaScript file (for direct <script src>)
 *   ?action=health        — health check ดูทุก endpoint + sheet source
 *
 * Deploy:
 *   1. ไปที่ Apps Script project ของ master.raceup.co.th
 *   2. Replace Code.gs ด้วยไฟล์นี้
 *   3. Deploy → New Version (URL เดิม)
 *   4. Verify: curl https://<apps-script-url>/exec?action=health
 */

// ====================================================
// CONFIG
// ====================================================
const HUB_LINK_SHEET_ID = '1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q';
// Working Sheet เก็บไว้สำหรับ fallback กรณี Hub Link ยังไม่มี tab
const WORKING_SHEET_ID  = '13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI';

// Tab name fallback order — try Live_* (auto-synced) first, then direct tabs
const TAB_FALLBACKS = {
  events:   ['Live_QuickFact', 'Live_ProjectInfo', 'Quick Fact', 'Master Event List'],
  staff:    ['Live_Contact', 'Contact', 'Employee Registry', 'Employees'],
  projects: ['Live_ProjectAssign', 'Project Assign', 'Project Assignment'],
  sponsors: ['Live_SponsorUpdate', 'Sponsor Update', 'Sponsors', 'Event Sponsor'],
};

// ====================================================
// EMBEDDED FALLBACK (used if Hub Link unreachable)
// Sync date: 2026-05-25
// ====================================================
const EVENTS_FALLBACK = [
  { code:'KYM26',   name:'Khao Yai Marathon 2026',                       expoDate:'2026-01-10', date:'2026-01-11', province:'นครราชสีมา', venueShort:'เขาใหญ่', distances:['42K','21K','10K','5K','2K'], color:'#2E8B57', category:'OE', series:'Standalone OE', target:7500 },
  { code:'PO26',    name:'Pocari Sweat Run 2026',                        expoDate:'2026-01-16', date:'2026-01-17', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K','3K'], color:'#0072CE', category:'EO', series:'EO Brand', target:6000 },
  { code:'AMN26',   name:'Amino Vital Run 2026',                         expoDate:'2026-02-07', date:'2026-02-08', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K','3K'], color:'#E60012', category:'EO', series:'EO Brand', target:4000 },
  { code:'PSMH26',  name:'Scenic Half Marathon Pranburi 2026',           expoDate:'2026-02-14', date:'2026-02-15', province:'ประจวบคีรีขันธ์', venueShort:'ปราณบุรี', distances:['21K','10K','5K','3K'], color:'#1D7BC4', category:'OE', series:'Scenic Series', target:3500 },
  { code:'SSP26',   name:'Supersports 10 Mile Run 2026',                 expoDate:'2026-05-16', date:'2026-05-17', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10Mile','10K','5K'], color:'#39FF14', category:'EO', series:'EO Brand', target:7500 },
  { code:'PBR26',   name:'Pink Blue Run 2026',                           expoDate:null,         date:'2026-05-24', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K','3K'], color:'#FF69B4', category:'EO', series:'EO Brand', target:3000 },
  { code:'CSMH26',  name:'Prudentia Scenic 1/2 Marathon Chanthaburi 2026', expoDate:'2026-06-06', date:'2026-06-07', province:'จันทบุรี', venueShort:'หาดคุ้งวิมาน', distances:['21K','10K','5K','3K'], color:'#7444F5', category:'OE', series:'Scenic Series', target:4500 },
  { code:'KTJ26',   name:'ก้าวท้าใจ 10K Thailand Championship 2026',     expoDate:'2026-06-20', date:'2026-06-21', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K'], color:'#F4A300', category:'EO', series:'EO Brand', target:8000 },
  { code:'LR26',    name:'League Run 2026',                              expoDate:null,         date:'2026-06-28', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['Team 10K','Team 5K'], color:'#FFC107', category:'OE', series:'Standalone OE', target:1000 },
  { code:'RSMH26',  name:'Scenic Half Marathon Rayong 2026',             expoDate:'2026-08-01', date:'2026-08-02', province:'ระยอง', venueShort:'ระยอง', distances:['21K','10K'], color:'#5B8DEF', category:'OE', series:'Scenic Series', target:4500 },
  { code:'CTP-BKK', name:'Counterpain Run 2026 Bangkok',                 expoDate:'2026-08-22', date:'2026-08-23', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K'], color:'#00A6A6', category:'OE', series:'Counterpain Series', target:1000 },
  { code:'CTP-KR',  name:'Counterpain Run 2026 Korat',                   expoDate:null,         date:'2026-09-06', province:'นครราชสีมา', venueShort:'โคราช', distances:['10K','5K'], color:'#00A6A6', category:'EO', series:'Counterpain Series', target:500 },
  { code:'KSMH26',  name:'Scenic Half Marathon Krabi 2026',              expoDate:'2026-09-12', date:'2026-09-13', province:'กระบี่', venueShort:'กระบี่', distances:['21K','10K','5K','3K'], color:'#00A8A8', category:'OE', series:'Scenic Series', target:4000 },
  { code:'CTP-KAN', name:'Counterpain Run 2026 Kanchanaburi',            expoDate:null,         date:'2026-09-20', province:'กาญจนบุรี', venueShort:'กาญจนบุรี', distances:['10K','5K'], color:'#00A6A6', category:'EO', series:'Counterpain Series', target:500 },
  { code:'KCT26',   name:'Koh Chang Trail 2026',                         expoDate:'2026-09-26', date:'2026-09-27', province:'ตราด', venueShort:'เกาะช้าง', distances:['Trail 55K','30K','15K','8K'], color:'#7B5E3C', category:'OE', series:'Standalone OE', target:1500 },
  { code:'CTP-KK',  name:'Counterpain Run 2026 Khon Kaen',               expoDate:null,         date:'2026-10-04', province:'ขอนแก่น', venueShort:'ขอนแก่น', distances:['10K','5K'], color:'#00A6A6', category:'EO', series:'Counterpain Series', target:500 },
  { code:'CMSH26',  name:'Scenic Half Marathon Chiang Mai 2026',         expoDate:'2026-10-31', date:'2026-11-01', province:'เชียงใหม่', venueShort:'เชียงใหม่', distances:['21K','10K','5K','3K'], color:'#FF6B35', category:'OE', series:'Scenic Series', target:4500 },
  { code:'KRM26',   name:'Korat Marathon 2026',                          expoDate:'2026-11-07', date:'2026-11-08', province:'นครราชสีมา', venueShort:'โคราช', distances:['42K','21K','10K','5K'], color:'#E63946', category:'OE', series:'Standalone OE', target:10000 },
  { code:'WR26',    name:'Allianz Ayudhya World Run 2026',               expoDate:'2026-11-21', date:'2026-11-22', province:'นครราชสีมา', venueShort:'โคราช', distances:['10K','5K'], color:'#0033A0', category:'EO', series:'EO Brand', target:5000 },
  { code:'GR26',    name:'Garmin Run Thailand 2026 World Series',        expoDate:'2026-12-05', date:'2026-12-06', province:'พระนครศรีอยุธยา', venueShort:'อยุธยา', distances:['21K','10K','5K'], color:'#007AC1', category:'EO', series:'EO Brand', target:5500 },
  { code:'NSMH26',  name:'Scenic Half Marathon Nakhon Phanom 2026',      expoDate:'2026-12-12', date:'2026-12-13', province:'นครพนม', venueShort:'นครพนม', distances:['42K','21K','10K','5K'], color:'#8B5A3C', category:'OE', series:'Scenic Series', target:4000 },
  { code:'GAT26',   name:'Gatorade Run 2026',                            expoDate:'2026-12-26', date:'2026-12-27', province:'กรุงเทพมหานคร', venueShort:'กรุงเทพ', distances:['10K','5K'], color:'#FF6F00', category:'EO', series:'EO Brand', target:5000 }
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
// Entry Point
// ====================================================
function doGet(e) {
  const action = (e.parameter.action || 'events').toLowerCase();
  let result;
  try {
    switch (action) {
      case 'ping':        result = { ok:true, time:new Date().toISOString(), version:'phase-c-1.0' }; break;
      case 'events':      result = getEvents(); break;
      case 'event':       result = getEvent(e.parameter.code); break;
      case 'categories':  result = getCategories(); break;
      case 'staff':       result = getStaff(); break;
      case 'projects':    result = getProjects(); break;
      case 'project':     result = getProject(e.parameter.code); break;
      case 'sponsors':    result = getSponsors(e.parameter.event); break;
      case 'suppliers':   result = getSuppliers(e.parameter.category); break;
      case 'js':          return serveEventsJs();
      case 'health':      result = healthCheck(); break;
      case 'schemaaudit': result = schemaAudit(); break;
      default: result = { error:'Unknown action. Try: ping, events, event, categories, staff, projects, project, sponsors, suppliers, js, health, schemaAudit' };
    }
  } catch (err) {
    result = { error: err.toString(), action: action };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ====================================================
// Smart tab opener — try Hub Link first, then Working Sheet, with tab fallbacks
// ====================================================
function openTabWithFallback_(kind) {
  const fallbacks = TAB_FALLBACKS[kind] || [];

  // Try Hub Link Sheet first
  try {
    const ss = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    for (let i = 0; i < fallbacks.length; i++) {
      const tab = ss.getSheetByName(fallbacks[i]);
      if (tab) return { sheet: tab, tabName: fallbacks[i], source: 'hub-link' };
    }
  } catch (e) { /* Hub Link inaccessible */ }

  // Fallback to Working Sheet
  try {
    const ws = SpreadsheetApp.openById(WORKING_SHEET_ID);
    for (let i = 0; i < fallbacks.length; i++) {
      const tab = ws.getSheetByName(fallbacks[i]);
      if (tab) return { sheet: tab, tabName: fallbacks[i], source: 'working' };
    }
  } catch (e) { /* Working Sheet inaccessible */ }

  return null;
}

// ====================================================
// Events
// ====================================================
function getEvents() {
  const ctx = openTabWithFallback_('events');
  if (ctx) {
    try {
      const events = parseEventsFromSheet_(ctx.sheet, ctx.tabName);
      if (events.length > 0) {
        return {
          ok: true, count: events.length, events: events,
          updated_at: new Date().toISOString(),
          source: ctx.source + ':' + ctx.tabName
        };
      }
    } catch (e) { /* parse fail — fallback */ }
  }
  return {
    ok: true, count: EVENTS_FALLBACK.length, events: EVENTS_FALLBACK,
    updated_at: new Date().toISOString(),
    source: 'embedded-fallback'
  };
}

function getEvent(code) {
  if (!code) return { error: 'Missing code parameter' };
  const all = getEvents();
  const ev = (all.events || []).find(e => String(e.code || '').toUpperCase() === code.toUpperCase());
  return ev ? { ok:true, event:ev, source: all.source } : { error:'Event not found: ' + code };
}

/** Parse events from any of the supported tab formats */
function parseEventsFromSheet_(sheet, tabName) {
  const data = sheet.getDataRange().getValues();
  const out = [];

  // Find header row (column with "Code")
  let headerIdx = -1;
  let codeCol = -1, nameCol = -1, expoCol = -1, raceCol = -1, targetCol = -1, venueCol = -1;

  for (let i = 0; i < Math.min(data.length, 10); i++) {
    const row = data[i].map(c => String(c || '').toLowerCase().trim());
    const cIdx = row.findIndex(c => c === 'code');
    if (cIdx >= 0) {
      headerIdx = i;
      codeCol   = cIdx;
      nameCol   = row.findIndex(c => c.includes('event name') || c === 'name');
      expoCol   = row.findIndex(c => c.includes('expo'));
      raceCol   = row.findIndex(c => c.includes('race day') || c === 'date');
      targetCol = row.findIndex(c => c.includes('target') || c.includes('runner'));
      venueCol  = row.findIndex(c => c.includes('venue'));
      break;
    }
  }

  if (headerIdx < 0 || codeCol < 0) {
    throw new Error('Cannot find header row with "Code" column in ' + tabName);
  }

  // Embedded events keyed by code for color/series/category fallback enrichment
  const enrichMap = {};
  EVENTS_FALLBACK.forEach(e => enrichMap[e.code] = e);

  for (let i = headerIdx + 1; i < data.length; i++) {
    const row = data[i];
    const code = String(row[codeCol] || '').trim().toUpperCase();
    if (!code || !/^[A-Z0-9\-]+$/.test(code)) continue;

    const enrich = enrichMap[code] || {};
    out.push({
      code:       code,
      name:       String(row[nameCol] || enrich.name || '').trim(),
      expoDate:   String(row[expoCol] || enrich.expoDate || '').trim() || null,
      date:       String(row[raceCol] || enrich.date || '').trim(),
      target:     parseInt(row[targetCol] || enrich.target || 0, 10) || 0,
      venue:      String(row[venueCol] || '').trim(),
      venueShort: enrich.venueShort || '',
      province:   enrich.province || '',
      distances:  enrich.distances || [],
      color:      enrich.color || '#888',
      category:   enrich.category || '',
      series:     enrich.series || '',
    });
  }
  return out;
}

// ====================================================
// Categories
// ====================================================
function getCategories() {
  return { ok: true, categories: CATEGORIES, status_flow: STATUS_FLOW };
}

// ====================================================
// Staff
// ====================================================
function getStaff() {
  const ctx = openTabWithFallback_('staff');
  if (!ctx) return { ok: false, error: 'No staff tab found in any sheet', source: 'none', staff: [] };

  try {
    const data = ctx.sheet.getDataRange().getValues();
    const out = [];

    // Find header row — look for "name" or "ชื่อ" column
    let headerIdx = -1;
    let nameCol = -1, emailCol = -1, phoneCol = -1, levelCol = -1, aliasCol = -1, emCol = -1;

    for (let i = 0; i < Math.min(data.length, 10); i++) {
      const row = data[i].map(c => String(c || '').toLowerCase().trim());
      const nIdx = row.findIndex(c => c === 'ชื่อ' || c === 'name' || c === 'nickname');
      if (nIdx >= 0) {
        headerIdx = i;
        nameCol  = nIdx;
        emailCol = row.findIndex(c => c.includes('email') || c.includes('อีเมล') || c.includes('อิเมล'));
        phoneCol = row.findIndex(c => c.includes('phone') || c.includes('เบอร์ติด') || c.includes('เบอร์โทร'));
        levelCol = row.findIndex(c => c === 'level' || c === 'ระดับ');
        aliasCol = row.findIndex(c => c.includes('alias'));
        emCol    = row.findIndex(c => c.includes('เบอร์ฉุกเฉิน') || c.includes('emergency'));
        break;
      }
    }

    if (headerIdx < 0 || nameCol < 0) {
      return { ok: false, error: 'Cannot find header in ' + ctx.tabName, source: ctx.source };
    }

    for (let i = headerIdx + 1; i < data.length; i++) {
      const row = data[i];
      const rawName = String(row[nameCol] || '').trim();
      if (!rawName) continue;

      const email = emailCol >= 0 ? String(row[emailCol] || '').toLowerCase().split('\n')[0].trim() : '';
      if (!email) continue;

      const nickname = rawName.replace(/^พี่\s*/, '').split(/[\s\-]/)[0].trim();
      out.push({
        nickname:       nickname,
        rawName:        rawName,
        email:          email,
        phone:          phoneCol >= 0 ? String(row[phoneCol] || '').trim() : '',
        phoneEmergency: emCol    >= 0 ? String(row[emCol] || '').trim()    : '',
        level:          levelCol >= 0 ? String(row[levelCol] || '').trim() : '',
        aliases:        aliasCol >= 0 ? String(row[aliasCol] || '').split(/[,，]/).map(s => s.trim()).filter(Boolean) : [],
      });
    }
    return { ok: true, count: out.length, staff: out, source: ctx.source + ':' + ctx.tabName };
  } catch (err) {
    return { ok: false, error: err.toString(), source: ctx.source, staff: [] };
  }
}

// ====================================================
// Projects
// ====================================================
function getProjects() {
  const ctx = openTabWithFallback_('projects');
  if (!ctx) return { ok: false, error: 'No projects tab found', source: 'none', projects: [] };

  try {
    const data = ctx.sheet.getDataRange().getValues();
    let headerIdx = -1;
    for (let i = 0; i < Math.min(data.length, 10); i++) {
      const row = data[i].map(c => String(c || '').toLowerCase().trim());
      if (row.findIndex(c => c === 'project') >= 0) { headerIdx = i; break; }
    }
    if (headerIdx < 0) throw new Error('Header not found');

    const header = data[headerIdx].map(c => String(c || '').toLowerCase().trim());
    const col = label => header.findIndex(c => c === label || c.includes(label));

    const projects = [];
    for (let i = headerIdx + 1; i < data.length; i++) {
      const row = data[i];
      const project = String(row[col('project')] || '').trim();
      if (!project) continue;
      const graphicIdx = col('graphic') >= 0 ? col('graphic') : col('กราฟ');
      projects.push({
        project:   project,
        point:     row[col('point')] || '',
        eventDate: String(row[col('event date')] || '').trim(),
        lead:      String(row[col('lead')] || '').trim(),
        co1:       String(row[col('co1')] || '').trim(),
        co2:       String(row[col('co2')] || '').trim(),
        route:     String(row[col('route')] || '').trim(),
        ae:        String(row[col('ae')] || '').trim(),
        pr:        String(row[col('pr')] || '').trim(),
        graphic:   String(row[graphicIdx >= 0 ? graphicIdx : -1] || '').trim(),
        tech:      String(row[col('tech')] || '').trim(),
        teamEvent: String(row[col('ทีม event')] || '').trim(),
        teamRace:  String(row[col('ทีม race')] || '').trim(),
      });
    }
    return { ok: true, count: projects.length, projects: projects, source: ctx.source + ':' + ctx.tabName };
  } catch (err) {
    return { ok: false, error: err.toString(), source: ctx.source, projects: [] };
  }
}

function getProject(code) {
  if (!code) return { error: 'Missing code parameter' };
  const all = getProjects();
  if (!all.ok) return all;
  const q = code.toUpperCase().trim();
  const proj = (all.projects || []).find(p => {
    const projUp = p.project.toUpperCase();
    return projUp === q || projUp.startsWith(q + ' ') || projUp.startsWith(q + '-') || projUp.includes(q);
  });
  return proj ? { ok:true, project:proj, source: all.source } : { error:'Project not found: ' + code };
}

// ====================================================
// Sponsors
// ====================================================
function getSponsors(eventFilter) {
  const ctx = openTabWithFallback_('sponsors');
  if (!ctx) return { ok: false, error: 'No sponsors tab found', sponsors: [] };

  try {
    const data = ctx.sheet.getDataRange().getValues();
    const out = [];
    let currentEvent = '';

    // Sponsor Update tab format: per-event sections with header "<Event Name>, <Code>"
    // followed by table: No, CLIENTS, PACKAGE, CATEGORY, STATUS, PIC, Remark, ...
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const a = String(row[0] || '').trim();
      const b = String(row[1] || '').trim();
      const c = String(row[2] || '').trim();

      // Section header: "<Event Name>, <Code>"
      if (!a && b && /^[A-Z0-9\-]{3,15}$/.test(c)) {
        currentEvent = c.toUpperCase();
        continue;
      }
      // Skip header row
      if (a.toLowerCase() === 'no' || b.toLowerCase() === 'clients') continue;

      // Data row
      const no = parseInt(a, 10);
      if (!isNaN(no) && b && currentEvent) {
        const entry = {
          event:    currentEvent,
          no:       no,
          client:   b,
          package:  c,
          category: String(row[3] || '').trim(),
          status:   String(row[4] || '').trim(),
          pic:      String(row[5] || '').trim(),
          remark:   String(row[6] || '').trim(),
          budget:   parseInt(row[8] || 0, 10) || 0,
        };
        if (!eventFilter || entry.event === eventFilter.toUpperCase()) {
          out.push(entry);
        }
      }
    }
    return { ok: true, count: out.length, sponsors: out, event: eventFilter || 'all', source: ctx.source + ':' + ctx.tabName };
  } catch (err) {
    return { ok: false, error: err.toString(), sponsors: [] };
  }
}

// ====================================================
// Suppliers (stub)
// ====================================================
function getSuppliers(category) {
  return {
    ok: true, count: 0, suppliers: [],
    category: category || 'all',
    note: 'getSuppliers reads from supplier database sheet — implement when needed'
  };
}

// ====================================================
// JS endpoint — returns events as JavaScript file
// ====================================================
function serveEventsJs() {
  const events = (getEvents().events || EVENTS_FALLBACK);
  const lines = [
    '/* Auto-generated from RaceupMasterData Apps Script — ' + new Date().toISOString() + ' */',
    '/* Source: Hub Link Sheet (1Um6I4VG...) · falls back to embedded if Sheet unreachable */',
    'window.RACEUP_EVENTS = ' + JSON.stringify(events, null, 2) + ';',
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
// Health check — verify all sources reachable
// ====================================================
function healthCheck() {
  const report = {
    ok: true,
    time: new Date().toISOString(),
    version: 'phase-c-1.0',
    sources: {},
    endpoints: {}
  };
  try {
    const hub = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    report.sources.hubLink = {
      ok: true,
      name: hub.getName(),
      tabs: hub.getSheets().map(s => s.getName()),
    };
  } catch (e) {
    report.sources.hubLink = { ok: false, error: e.toString() };
    report.ok = false;
  }
  try {
    const ws = SpreadsheetApp.openById(WORKING_SHEET_ID);
    report.sources.working = {
      ok: true,
      name: ws.getName(),
      tabs: ws.getSheets().map(s => s.getName()),
    };
  } catch (e) {
    report.sources.working = { ok: false, error: e.toString() };
  }
  // Test each endpoint
  report.endpoints.events    = safeCall_(getEvents);
  report.endpoints.staff     = safeCall_(getStaff);
  report.endpoints.projects  = safeCall_(getProjects);
  report.endpoints.sponsors  = safeCall_(() => getSponsors());
  return report;
}

function safeCall_(fn) {
  try {
    const r = fn();
    const cnt = r.count || (r.events || r.staff || r.projects || r.sponsors || []).length;
    return { ok: r.ok, count: cnt, source: r.source };
  } catch (e) { return { ok: false, error: e.toString() }; }
}

// ====================================================
// Schema Audit — read-only inventory of all tabs in both sheets
// Returns per-tab: headers, rowCount, colCount, sample rows
// Use this to design canonical schema for Hub Link (SoT)
// ====================================================
function schemaAudit() {
  const report = {
    ok: true,
    time: new Date().toISOString(),
    version: 'audit-1.0',
    summary: { hubLink: { tabCount: 0, totalRows: 0 }, working: { tabCount: 0, totalRows: 0 } },
    hubLink: { id: HUB_LINK_SHEET_ID, name: '', tabs: {} },
    working: { id: WORKING_SHEET_ID,  name: '', tabs: {} }
  };

  // ---- Hub Link Sheet ----
  try {
    const hub = SpreadsheetApp.openById(HUB_LINK_SHEET_ID);
    report.hubLink.name = hub.getName();
    hub.getSheets().forEach(sh => {
      report.hubLink.tabs[sh.getName()] = inventoryTab_(sh);
      report.summary.hubLink.tabCount++;
      report.summary.hubLink.totalRows += sh.getLastRow();
    });
  } catch (e) {
    report.hubLink.error = e.toString();
    report.ok = false;
  }

  // ---- Working Sheet ----
  try {
    const ws = SpreadsheetApp.openById(WORKING_SHEET_ID);
    report.working.name = ws.getName();
    ws.getSheets().forEach(sh => {
      report.working.tabs[sh.getName()] = inventoryTab_(sh);
      report.summary.working.tabCount++;
      report.summary.working.totalRows += sh.getLastRow();
    });
  } catch (e) {
    report.working.error = e.toString();
    report.ok = false;
  }

  return report;
}

function inventoryTab_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow === 0 || lastCol === 0) {
    return { headers: [], rowCount: 0, colCount: 0, sample: [], hidden: sheet.isSheetHidden() };
  }
  // Row 1 = headers (assumed)
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(h => (h === null || h === undefined) ? '' : String(h).trim());

  // Sample: rows 2-4 (up to 3 sample rows)
  let sample = [];
  if (lastRow >= 2) {
    const sampleRowCount = Math.min(3, lastRow - 1);
    const raw = sheet.getRange(2, 1, sampleRowCount, lastCol).getValues();
    sample = raw.map(row => row.map(v => {
      if (v === null || v === undefined) return '';
      if (v instanceof Date) return Utilities.formatDate(v, 'GMT+7', 'yyyy-MM-dd');
      const s = String(v);
      return s.length > 80 ? s.slice(0, 80) + '…' : s;
    }));
  }

  return {
    headers: headers,
    rowCount: lastRow - 1,  // exclude header
    colCount: lastCol,
    sample: sample,
    hidden: sheet.isSheetHidden()
  };
}

// ====================================================
// Test functions (run from Apps Script editor)
// ====================================================
function testEvents()      { Logger.log(JSON.stringify(getEvents(),    null, 2)); }
function testStaff()       { Logger.log(JSON.stringify(getStaff(),     null, 2)); }
function testProjects()    { Logger.log(JSON.stringify(getProjects(),  null, 2)); }
function testSponsors()    { Logger.log(JSON.stringify(getSponsors(),  null, 2)); }
function testHealth()      { Logger.log(JSON.stringify(healthCheck(),  null, 2)); }
function testSchemaAudit() { Logger.log(JSON.stringify(schemaAudit(),  null, 2)); }
