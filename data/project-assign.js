/**
 * Race Up Work — Project Assignment Master 2026
 * ============================================================
 * ที่มา:  2026 Raceup Working Sheet (13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI)
 *         Tab: "Project Assign"
 *
 * Sync date: 2026-05-24 (manual sync จาก sheet snapshot — 37 rows)
 *
 * โครงสร้าง (mirror ของ Working Sheet schema):
 *   project:    Event code/name
 *   point:      จำนวน "Point" (สำหรับ workload calc)
 *   eventDate:  วันงาน (string รูปแบบเดิม จาก sheet)
 *   lead:       Race Director nickname
 *   co1:        Co-RD / Event Director nickname
 *   co2:        Co-Race Director nickname
 *   route:      On Course / Route Lead nickname
 *   ae:         Account Executive nickname
 *   pr:         PR Lead nickname
 *   graphic:    Graphic Designer nickname
 *   tech:       Tech lead (default: ฟีม)
 *   teamEvent:  Event team (Raceup/BB)
 *   teamRace:   On-course race team (Inhouse)
 *
 * ⚠️ NOTE: Working Sheet มี press events + GAT Runclub mini events ด้วย — ไม่ใช่แค่ 22 main races
 */

window.RACEUP_PROJECT_ASSIGN = [
  { no:1,  project:'KYM26',          point:2,    eventDate:'10-11 Jan26', lead:'เบส',  co1:'ภูมิ',   co2:'จา',  route:'เฟิร์ส', ae:'เบส',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'' },
  { no:2,  project:'POCARI26',       point:2,    eventDate:'17 Jan 26',   lead:'เบส',  co1:'จา',    co2:'โฟร์', route:'เฟิร์ส', ae:'ริน',   pr:'นัชชา', graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'Inhouse' },
  { no:3,  project:'AMN26',          point:2,    eventDate:'8 Feb 26',    lead:'เบส',  co1:'จา',    co2:'ภูมิ', route:'เฟิร์ส', ae:'พลอย',  pr:'ต้นอ้อ',graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:4,  project:'PSMH26',         point:1.5,  eventDate:'15 Feb 26',   lead:'จา',   co1:'จา',    co2:'ภูมิ', route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'Inhouse' },
  { no:5,  project:'KTJ26 Press',    point:1,    eventDate:'8 May 26',    lead:'เบส',  co1:'ภูมิ',   co2:'',    route:'',       ae:'เบส',   pr:'ข้าว',   graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:6,  project:'SSP26',          point:2,    eventDate:'17 May 26',   lead:'จา',   co1:'ภูมิ',   co2:'โฟร์', route:'เฟิร์ส', ae:'ริน',   pr:'ต้นอ้อ',graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'Inhouse' },
  { no:7,  project:'PBR26',          point:1.5,  eventDate:'24 May 26',   lead:'วุฒิ', co1:'โฟร์',  co2:'ภูมิ', route:'เฟิร์ส', ae:'วุฒิ',  pr:'ข้าว',   graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:8,  project:'CSMH26',         point:1.5,  eventDate:'7 June 26',   lead:'จา',   co1:'โฟร์',  co2:'ภูมิ', route:'เฟิร์ส', ae:'พลอย',  pr:'นัชชา', graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:9,  project:'KTJ26',          point:2,    eventDate:'21 Jun 26',   lead:'เบส',  co1:'ภูมิ',   co2:'จา',  route:'เฟิร์ส', ae:'เบส',   pr:'ข้าว',   graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'Inhouse' },
  { no:10, project:'LR26',           point:1,    eventDate:'28 Jun 26',   lead:'ก๋อย', co1:'เฟิร์ส', co2:'',    route:'ตั้ม',    ae:'-',     pr:'ต้นอ้อ',graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:11, project:'KRM26 Press',    point:1,    eventDate:'1 Jul 26',    lead:'เบส',  co1:'ภูมิ',   co2:'',    route:'',       ae:'เบส',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:12, project:'KCT26 Press',    point:1,    eventDate:'16 Jul 26',   lead:'เบส',  co1:'ภูมิ',   co2:'',    route:'',       ae:'พลอย',  pr:'นัชชา', graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:13, project:'CTP-BKK',        point:1,    eventDate:'23 Aug',      lead:'จา',   co1:'ภูมิ',   co2:'',    route:'',       ae:'ริน',   pr:'นัชชา', graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:14, project:'RSMH26',         point:1.5,  eventDate:'2 Aug',       lead:'จา',   co1:'โฟร์',  co2:'ภูมิ', route:'เฟิร์ส', ae:'พลอย',  pr:'ต้นอ้อ',graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:15, project:'KYM27 Press',    point:1,    eventDate:'27 Aug',      lead:'เบส',  co1:'โฟร์',  co2:'',    route:'',       ae:'เบส',   pr:'ต้นอ้อ',graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:16, project:'KDM27 Press',    point:1,    eventDate:'28 Aug',      lead:'เบส',  co1:'โฟร์',  co2:'',    route:'',       ae:'พลอย',  pr:'ข้าว',   graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:17, project:'CTP-KR',         point:1,    eventDate:'6 Sep',       lead:'ภูมิ', co1:'เฟิร์ส', co2:'',    route:'',       ae:'ริน',   pr:'นัชชา', graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:18, project:'CTP-KAN',        point:1,    eventDate:'20 Sep',      lead:'เฟิร์ส',co1:'วุฒิ',  co2:'',    route:'',       ae:'ริน',   pr:'นัชชา', graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:19, project:'KSMH26',         point:1.5,  eventDate:'12-13 Sep',   lead:'จา',   co1:'ภูมิ',   co2:'',    route:'เฟิร์ส', ae:'พลอย',  pr:'ข้าว',   graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:20, project:'KCT26',          point:1.5,  eventDate:'26-27 Sep',   lead:'ก๋อย', co1:'ภูมิ',   co2:'',    route:'ตั้ม',    ae:'พลอย',  pr:'นัชชา', graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:21, project:'CTP-KK',         point:1,    eventDate:'4 Oct',       lead:'จา',   co1:'',      co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'นัชชา', graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:22, project:'RVK26',          point:2,    eventDate:'11 Oct',      lead:'ก๋อย', co1:'ภูมิ',   co2:'โฟร์', route:'ตั้ม',    ae:'เบส',   pr:'ข้าว',   graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:23, project:'POST26 (TBC)',   point:2,    eventDate:'18 Oct',      lead:'เบส',  co1:'จา',    co2:'',    route:'เฟิร์ส', ae:'พลอย',  pr:'นัชชา', graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:24, project:'SCN26 (TBC)',    point:2,    eventDate:'25 Oct',      lead:'',     co1:'',      co2:'',    route:'',       ae:'เกด',   pr:'ต้นอ้อ',graphic:'',     tech:'ฟีม', teamEvent:'Checkrace/DD', teamRace:'Inhouse' },
  { no:25, project:'CMSH26',         point:2,    eventDate:'1 Nov',       lead:'ก๋อย', co1:'โฟร์',  co2:'',    route:'เฟิร์ส', ae:'พลอย',  pr:'นัชชา', graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:26, project:'KRM26',          point:2,    eventDate:'8 Nov',       lead:'เบส',  co1:'จา',    co2:'ภูมิ', route:'เฟิร์ส', ae:'เบส',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'Inhouse' },
  { no:27, project:'WR26',           point:2,    eventDate:'22 Nov',      lead:'จา',   co1:'ภูมิ',   co2:'โฟร์', route:'วุฒิ',    ae:'พลอย',  pr:'ต้นอ้อ',graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup/DD', teamRace:'' },
  { no:28, project:'GR26',           point:2,    eventDate:'6 Dec',       lead:'เบส',  co1:'จา',    co2:'ภูมิ', route:'เฟิร์ส', ae:'ริน',   pr:'นัชชา', graphic:'ไอซ์',  tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'Inhouse' },
  { no:29, project:'NSM26',          point:2,    eventDate:'12-13 Dec',   lead:'จา',   co1:'เฟิร์ส', co2:'โฟร์', route:'วุฒิ',    ae:'พลอย',  pr:'ต้นอ้อ',graphic:'พีม',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:30, project:'GAT26',          point:2,    eventDate:'27 Dec',      lead:'ก๋อย', co1:'โฟร์',  co2:'ภูมิ', route:'เฟิร์ส', ae:'พลอย',  pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup/BB', teamRace:'Inhouse' },
  { no:31, project:'GATRUNCLUB26-1', point:0.5,  eventDate:'30 May',      lead:'ภูมิ', co1:'วุฒิ',  co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:32, project:'GATRUNCLUB26-2', point:0.5,  eventDate:'13 Jun',      lead:'ภูมิ', co1:'วุฒิ',  co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:33, project:'GATRUNCLUB26-3', point:0.5,  eventDate:'27 Jun',      lead:'ภูมิ', co1:'วุฒิ',  co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:34, project:'GATRUNCLUB26-4', point:0.5,  eventDate:'10 Oct',      lead:'ภูมิ', co1:'วุฒิ',  co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:35, project:'GATRUNCLUB26-5', point:0.5,  eventDate:'17 Oct',      lead:'ภูมิ', co1:'วุฒิ',  co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:36, project:'GATRUNCLUB26-6', point:0.5,  eventDate:'14 Nov',      lead:'ภูมิ', co1:'วุฒิ',  co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
  { no:37, project:'GATRUNCLUB26-7', point:0.5,  eventDate:'28 Nov',      lead:'ภูมิ', co1:'วุฒิ',  co2:'',    route:'เฟิร์ส', ae:'ริน',   pr:'ข้าว',   graphic:'เนย',   tech:'ฟีม', teamEvent:'Raceup',    teamRace:'' },
];

/* ============================================================
   HELPERS
   ============================================================ */

window.getProjectByEvent = function(code) {
  if (!code) return null;
  const q = String(code).toUpperCase().trim();
  return window.RACEUP_PROJECT_ASSIGN.find(p => {
    const proj = p.project.toUpperCase();
    return proj === q || proj.startsWith(q + ' ') || proj.startsWith(q + '-');
  }) || null;
};

window.getProjectsByLead = function(nickname) {
  if (!nickname) return [];
  const q = String(nickname).toLowerCase().trim();
  return window.RACEUP_PROJECT_ASSIGN.filter(p =>
    String(p.lead).toLowerCase() === q
  );
};

/** หา project ทั้งหมดที่ staff คนใดคนหนึ่งเกี่ยวข้อง (any role) */
window.getProjectsByStaff = function(nickname) {
  if (!nickname) return [];
  const q = String(nickname).toLowerCase().trim();
  const fields = ['lead','co1','co2','route','ae','pr','graphic'];
  return window.RACEUP_PROJECT_ASSIGN.filter(p =>
    fields.some(f => String(p[f] || '').toLowerCase() === q)
  );
};

window.getProjectAssignStats = function() {
  const arr = window.RACEUP_PROJECT_ASSIGN;
  return {
    total:         arr.length,
    mainEvents:    arr.filter(p => !p.project.includes('Press') && !p.project.includes('RUNCLUB')).length,
    pressEvents:   arr.filter(p => p.project.includes('Press')).length,
    runClubEvents: arr.filter(p => p.project.includes('RUNCLUB')).length,
    totalPoints:   arr.reduce((s, p) => s + (parseFloat(p.point) || 0), 0),
  };
};
