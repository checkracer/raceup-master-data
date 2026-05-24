/**
 * Race Up Work — Sponsors Master 2026
 * ============================================================
 * ที่มา: 2026 Raceup Working Sheet → Sponsor Update tab
 *        (currently — เปลี่ยนเป็น "Master Sponsors" tab หลัง refactor)
 *
 * โครงสร้าง:
 *   event:          Event code (KYM26, ...)
 *   tier:           Title | Main | Co | Local | Media | Product
 *   brand:          ชื่อแบรนด์
 *   contact:        ชื่อผู้ติดต่อ + เบอร์ (PIC)
 *   amount:         งบ (THB) — 0 = in-kind/barter
 *   contractStatus: planning | quoted | signed | activated | done
 *   logoUrl:        URL ของไฟล์ logo (PNG/SVG)
 *   brandColor:     สี hex
 *   notes:          เพิ่มเติม
 *
 * Status meanings:
 *   planning   = วางแผน · ยังไม่ติดต่อ
 *   quoted     = ส่ง proposal/quote ไปแล้ว
 *   signed     = ลงนามสัญญา/ยืนยันแล้ว
 *   activated  = activate (post งานวิ่ง · receive logo · กระจาย media)
 *   done       = จบงาน + รายงาน Post-Event ส่งแล้ว
 *
 * ⚠️ Placeholder — ต้องเติม + sync จาก Sponsor Update sheet ทีหลัง
 */

window.RACEUP_SPONSORS = [
  // ตัวอย่าง — เติมจริงจาก Sheet
  { event:'CSMH26', tier:'Title',   brand:'Prudentia',                  contact:'',                       amount:0, contractStatus:'signed',    logoUrl:'', brandColor:'#5B21B6', notes:'Prudentia Scenic 1/2 Marathon Chanthaburi 2026' },
  { event:'CSMH26', tier:'Medical', brand:'โรงพยาบาลกรุงเทพ จันทบุรี',  contact:'ER 039-319888',          amount:0, contractStatus:'signed',    logoUrl:'', brandColor:'', notes:'Massage tent ริมหาดคุ้งวิมาน + Medical partner' },
  { event:'CSMH26', tier:'Product', brand:'Prudential — Feet Ice Spa',  contact:'',                       amount:0, contractStatus:'signed',    logoUrl:'', brandColor:'', notes:'21K finisher only · หน้าวนาวารีรีสอร์ท' },
  { event:'WR26',   tier:'Title',   brand:'Allianz Ayudhya',            contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#0033A0', notes:'World Run 2026' },
  { event:'KTJ26',  tier:'Title',   brand:'ก้าวท้าใจ',                  contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#F4A300', notes:'Thailand Championship' },
  { event:'PO26',   tier:'Title',   brand:'Pocari Sweat',               contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#0072CE', notes:'' },
  { event:'AMN26',  tier:'Title',   brand:'Amino Vital',                contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#E60012', notes:'' },
  { event:'SSP26',  tier:'Title',   brand:'Supersports',                contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#39FF14', notes:'10 Mile Run' },
  { event:'PBR26',  tier:'Title',   brand:'Pink Blue Run',              contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#FF69B4', notes:'' },
  { event:'GR26',   tier:'Title',   brand:'Garmin',                     contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#007AC1', notes:'World Series Thailand' },
  { event:'GAT26',  tier:'Title',   brand:'Gatorade',                   contact:'',                       amount:0, contractStatus:'planning', logoUrl:'', brandColor:'#FF6F00', notes:'' },
  // Counterpain Series — ทั้ง 4 งานมี Title Sponsor = Counterpain
  { event:'CTP-BKK', tier:'Title',  brand:'Counterpain',                contact:'',                       amount:0, contractStatus:'signed',    logoUrl:'', brandColor:'#00A6A6', notes:'Series Title (4 งาน)' },
  { event:'CTP-KR',  tier:'Title',  brand:'Counterpain',                contact:'',                       amount:0, contractStatus:'signed',    logoUrl:'', brandColor:'#00A6A6', notes:'Series Title (4 งาน)' },
  { event:'CTP-KAN', tier:'Title',  brand:'Counterpain',                contact:'',                       amount:0, contractStatus:'signed',    logoUrl:'', brandColor:'#00A6A6', notes:'Series Title (4 งาน)' },
  { event:'CTP-KK',  tier:'Title',  brand:'Counterpain',                contact:'',                       amount:0, contractStatus:'signed',    logoUrl:'', brandColor:'#00A6A6', notes:'Series Title (4 งาน)' },
];

/* ============================================================
   HELPERS
   ============================================================ */

window.getSponsorsByEvent = function(eventCode) {
  if (!eventCode) return [];
  const q = String(eventCode).toUpperCase().trim();
  return window.RACEUP_SPONSORS.filter(s => s.event.toUpperCase() === q);
};

window.getTitleSponsor = function(eventCode) {
  const sponsors = window.getSponsorsByEvent(eventCode);
  return sponsors.find(s => s.tier === 'Title') || null;
};

window.getSponsorStats = function() {
  return {
    total:        window.RACEUP_SPONSORS.length,
    signed:       window.RACEUP_SPONSORS.filter(s => ['signed','activated','done'].includes(s.contractStatus)).length,
    planning:     window.RACEUP_SPONSORS.filter(s => s.contractStatus === 'planning').length,
    eventsWithTitle: [...new Set(window.RACEUP_SPONSORS.filter(s => s.tier === 'Title').map(s => s.event))].length,
  };
};
