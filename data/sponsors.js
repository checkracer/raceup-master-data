/**
 * Race Up Work — Sponsors Master 2026
 * ============================================================
 * ที่มา:  2026 Raceup Working Sheet (13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI)
 *         Tab: "Sponsor Update"
 *
 * Sync date: 2026-05-24 (manual sync จาก sheet snapshot)
 *
 * โครงสร้าง:
 *   event:          Event code
 *   no:             ลำดับใน package
 *   client:         ชื่อแบรนด์
 *   package:        Title | Main | Co | Mini Co | Partner | Presenting | Promoter | MOU/Co Promoter | Energy Gel
 *   category:       ประเภทสินค้า/บริการ
 *   status:         Confirmed | Pending | TBC | Cancel
 *   pic:            ผู้รับผิดชอบ
 *   budget:         งบประมาณ THB (0 = in-kind/barter)
 *   remark:         เพิ่มเติม
 *
 * ⚠️ Working Sheet มีคอลัมน์ Contact + Deliverables + Last_updated ด้วย — เก็บไว้รอ sync
 */

window.RACEUP_SPONSORS = [
  // ====== PSMH26 — Scenic Half Pranburi ======
  { event:'PSMH26', no:1,  client:'PO Care',      package:'Main',    category:'ครีมกันแดด',       status:'Confirmed', pic:'US',       budget:0, remark:'' },
  { event:'PSMH26', no:2,  client:'Supersports',  package:'Co',      category:'Sport Mall',       status:'Confirmed', pic:'kate',     budget:0, remark:'' },
  { event:'PSMH26', no:3,  client:'Aquafina',     package:'Co',      category:'น้ำดื่ม',          status:'Confirmed', pic:'rin',      budget:0, remark:'' },
  { event:'PSMH26', no:4,  client:'Gatorade',     package:'Co',      category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'rin',  budget:0, remark:'' },
  { event:'PSMH26', no:5,  client:'Profreeze',    package:'Partner', category:'สเปรย์เย็น',       status:'Confirmed', pic:'ploy',     budget:0, remark:'' },
  { event:'PSMH26', no:6,  client:'Drydye',       package:'Partner', category:'เสื้อกีฬา',         status:'Confirmed', pic:'film',     budget:0, remark:'' },
  { event:'PSMH26', no:7,  client:'Amino Vital',  package:'Co',      category:'เจลพลังงาน',       status:'Confirmed', pic:'ploy',     budget:0, remark:'' },
  { event:'PSMH26', no:8,  client:'Berocca',      package:'Co',      category:'วิตามิน',           status:'Confirmed', pic:'kate ppz', budget:0, remark:'' },
  { event:'PSMH26', no:9,  client:'Prudential',   package:'Co',      category:'ประกันชีวิต',       status:'Confirmed', pic:'ploy',     budget:0, remark:'' },

  // ====== CSMH26 — Scenic Half Chanthaburi ======
  { event:'CSMH26', no:1,  client:'Prudential',   package:'Main',    category:'ประกันชีวิต',       status:'Confirmed', pic:'Ploy', budget:1000000, remark:'Title sponsor งาน' },
  { event:'CSMH26', no:2,  client:'Aquafina',     package:'Co',      category:'น้ำดื่ม',          status:'Confirmed', pic:'Rin',  budget:0,       remark:'' },
  { event:'CSMH26', no:3,  client:'Gatorade',     package:'Co',      category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'Rin',  budget:250000,  remark:'' },
  { event:'CSMH26', no:4,  client:'Profreeze',    package:'Partner', category:'สเปรย์เย็น',       status:'Confirmed', pic:'Ploy', budget:0,       remark:'' },
  { event:'CSMH26', no:5,  client:'Drydye',       package:'Partner', category:'เสื้อกีฬา',         status:'Confirmed', pic:'Film', budget:0,       remark:'' },
  { event:'CSMH26', no:6,  client:'Amino Vital',  package:'Co',      category:'เจลพลังงาน',       status:'Confirmed', pic:'Ploy', budget:0,       remark:'' },
  { event:'CSMH26', no:7,  client:'Supersports',  package:'Co',      category:'Sport Mall',       status:'Confirmed', pic:'Kate', budget:100000,  remark:'' },

  // ====== RSMH26 — Scenic Half Rayong ======
  { event:'RSMH26', no:1,  client:'Prudential',   package:'Co',      category:'ประกันชีวิต',       status:'Confirmed', pic:'ploy', budget:0,       remark:'' },
  { event:'RSMH26', no:2,  client:'Aquafina',     package:'Co',      category:'น้ำดื่ม',          status:'Pending',   pic:'rin',  budget:0,       remark:'' },
  { event:'RSMH26', no:3,  client:'Gatorade',     package:'Co',      category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'rin',  budget:250000,  remark:'' },
  { event:'RSMH26', no:4,  client:'Profreeze',    package:'Partner', category:'สเปรย์เย็น',       status:'TBC',       pic:'ploy', budget:0,       remark:'' },
  { event:'RSMH26', no:5,  client:'Drydye',       package:'Partner', category:'เสื้อกีฬา',         status:'Confirmed', pic:'film', budget:0,       remark:'' },
  { event:'RSMH26', no:6,  client:'Amino Vital',  package:'Co',      category:'เจลพลังงาน',       status:'Confirmed', pic:'ploy', budget:100000,  remark:'' },
  { event:'RSMH26', no:7,  client:'Supersports',  package:'Co',      category:'Sport Mall',       status:'',          pic:'kate', budget:0,       remark:'Sponsor แค่ Pacer' },

  // ====== KSMH26 — Scenic Half Krabi ======
  { event:'KSMH26', no:1,  client:'Prudential',   package:'Co',      category:'ประกันชีวิต',       status:'Confirmed', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'KSMH26', no:2,  client:'Aquafina',     package:'Co',      category:'น้ำดื่ม',          status:'Confirmed', pic:'rin',           budget:0, remark:'' },
  { event:'KSMH26', no:3,  client:'Gatorade',     package:'Co',      category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'koi.raceup',    budget:0, remark:'' },
  { event:'KSMH26', no:4,  client:'Profreeze',    package:'Co',      category:'ยานวด',             status:'TBC',       pic:'',              budget:0, remark:'' },
  { event:'KSMH26', no:5,  client:'Drydye',       package:'Partner', category:'เสื้อกีฬา',         status:'Confirmed', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'KSMH26', no:6,  client:'Amino Vital',  package:'Co',      category:'เจลพลังงาน',       status:'Confirmed', pic:'ploy.raceup',   budget:0, remark:'' },
  { event:'KSMH26', no:7,  client:'SuperSports',  package:'Co',      category:'Sport Mall',       status:'Confirmed', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'KSMH26', no:8,  client:'SAT',          package:'Main',    category:'กกท',               status:'Confirmed', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'KSMH26', no:9,  client:'AirAsia',      package:'Co',      category:'สายการบิน',         status:'Pending',   pic:'best raceup',   budget:0, remark:'' },

  // ====== CMSH26 — Scenic Half Chiang Mai ======
  { event:'CMSH26', no:1,  client:'Counterpain',  package:'Title',   category:'ครีมนวด',           status:'Confirmed', pic:'PBE',           budget:0,      remark:'Title sponsor' },
  { event:'CMSH26', no:2,  client:'Prudential',   package:'Co',      category:'ประกันชีวิต',       status:'Confirmed', pic:'k.kate raceup', budget:0,      remark:'' },
  { event:'CMSH26', no:3,  client:'Aquafina',     package:'Co',      category:'น้ำดื่ม',          status:'Confirmed', pic:'rin',           budget:0,      remark:'' },
  { event:'CMSH26', no:4,  client:'Gatorade',     package:'Co',      category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'koi.raceup',    budget:250000, remark:'' },
  { event:'CMSH26', no:5,  client:'Chery',        package:'Co',      category:'รถไฟฟ้า',           status:'Pending',   pic:'Nay.PEB',       budget:0,      remark:'' },
  { event:'CMSH26', no:6,  client:'Drydye',       package:'Partner', category:'เสื้อกีฬา',         status:'Confirmed', pic:'k.kate raceup', budget:0,      remark:'' },
  { event:'CMSH26', no:7,  client:'Amino Vital',  package:'Partner', category:'เจลพลังงาน',       status:'Confirmed', pic:'ploy.raceup',   budget:0,      remark:'' },
  { event:'CMSH26', no:8,  client:'SuperSport',   package:'Co',      category:'Sport Mall',       status:'Confirmed', pic:'k.kate raceup', budget:0,      remark:'' },
  { event:'CMSH26', no:9,  client:'PO Care',      package:'Co',      category:'ครีมกันแดด',       status:'TBC',       pic:'US',            budget:0,      remark:'' },
  { event:'CMSH26', no:10, client:'AirAsia',      package:'Co',      category:'สายการบิน',         status:'Pending',   pic:'best raceup',   budget:0,      remark:'' },

  // ====== NSM26 — Scenic Half Nakhon Phanom ======
  { event:'NSM26', no:1,  client:'Prudential',    package:'Co',      category:'ประกันชีวิต',       status:'Confirmed', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'NSM26', no:2,  client:'Supersports',   package:'Co',      category:'Sport Mall',       status:'TBC',       pic:'k.kate raceup', budget:0, remark:'' },
  { event:'NSM26', no:3,  client:'Aquafina',      package:'Co',      category:'น้ำดื่ม',          status:'Confirmed', pic:'rin',           budget:0, remark:'' },
  { event:'NSM26', no:4,  client:'Gatorade',      package:'Co',      category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'NSM26', no:5,  client:'Profreeze',     package:'Partner', category:'สเปรย์เย็น',       status:'TBC',       pic:'k.ploy raceup', budget:0, remark:'' },
  { event:'NSM26', no:6,  client:'Drydye',        package:'Partner', category:'เสื้อกีฬา',         status:'Confirmed', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'NSM26', no:7,  client:'Amino Vital',   package:'Co',      category:'เจลพลังงาน',       status:'TBC',       pic:'',              budget:0, remark:'' },
  { event:'NSM26', no:8,  client:'AirAsia',       package:'Co',      category:'สายการบิน',         status:'Pending',   pic:'best raceup',   budget:0, remark:'' },

  // ====== KRM26 — Korat Marathon ======
  { event:'KRM26', no:1,  client:'รู้ใจ',          package:'Presenting', category:'ประกันชีวิต',    status:'TBC',       pic:'K.Kate PBE',    budget:0, remark:'' },
  { event:'KRM26', no:2,  client:'The Mall',     package:'Main',    category:'ห้างสรรพสินค้า',     status:'Confirmed', pic:'K.Best Raceup', budget:0, remark:'' },
  { event:'KRM26', no:3,  client:'PO CARE',      package:'Co',      category:'ครีมกันแดด',       status:'TBC',       pic:'K.Kate PBE',    budget:0, remark:'' },
  { event:'KRM26', no:4,  client:'Gatorade',     package:'Co',      category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'K.Ploy Raceup', budget:0, remark:'' },
  { event:'KRM26', no:5,  client:'Aquafina',     package:'Co',      category:'น้ำดื่ม',          status:'Confirmed', pic:'rin Raceup',    budget:0, remark:'' },
  { event:'KRM26', no:6,  client:'Amino Vital',  package:'Co',      category:'เจลพลังงาน',       status:'Confirmed', pic:'K.Ploy Raceup', budget:0, remark:'' },
  { event:'KRM26', no:7,  client:'Pro Freeze',   package:'Partner', category:'สเปร์ยคลายกล้ามเนื้อ', status:'Confirmed', pic:'K.Ploy Raceup', budget:0, remark:'' },
  { event:'KRM26', no:8,  client:'Samsung Insurance', package:'Main', category:'ประกันชีวิต',    status:'Cancel',    pic:'Nay.PEB',       budget:0, remark:'' },
  { event:'KRM26', no:9,  client:'การท่องเที่ยวแห่งประเทศไทย', package:'Main', category:'หน่วยงานรัฐ', status:'Pending', pic:'k.kate raceup', budget:0, remark:'' },
  { event:'KRM26', no:10, client:'การกีฬาแห่งประเทศไทย',     package:'Main', category:'หน่วยงานรัฐ', status:'Pending', pic:'k.kate raceup', budget:0, remark:'' },

  // ====== KYM27 — Khao Yai Marathon 2027 ======
  { event:'KYM27', no:1,  client:'B-Quik',        package:'Title', category:'ศูนย์ซ่อมรถยนต์', status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:2,  client:'Michelin',      package:'Main',  category:'ยางรถยนต์',       status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:3,  client:'Yuasa',         package:'Main',  category:'แบตเตอรี่',       status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:4,  client:'Bendix',        package:'Co',    category:'ผ้าเบรก',         status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:5,  client:'Good Year',     package:'Co',    category:'ยางรถยนต์',       status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:6,  client:'Yokohama',      package:'Mini Co', category:'ยางรถยนต์',     status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:7,  client:'Jmart',         package:'Co',    category:'ประกันชีวิต',     status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:8,  client:'Singha',        package:'Co',    category:'น้ำดื่ม',         status:'Pending', pic:'Nay.PEB', budget:0, remark:'' },
  { event:'KYM27', no:9,  client:'Gatorade',      package:'Co',    category:'เครื่องดื่มเกลือแร่', status:'Pending', pic:'rin raceup', budget:0, remark:'' },
  { event:'KYM27', no:10, client:'Tigerbalm/Counterpain', package:'Co', category:'ยานวด',     status:'Pending', pic:'',        budget:0, remark:'' },
  { event:'KYM27', no:11, client:'Drydye',        package:'Partner', category:'เสื้อกีฬา',     status:'Pending', pic:'',        budget:0, remark:'' },
  { event:'KYM27', no:12, client:'Amino Vital',   package:'Energy Gel', category:'เจลพลังงาน', status:'Pending', pic:'ploy raceup', budget:0, remark:'' },

  // ====== KCT26 — Koh Chang Trail ======
  { event:'KCT26', no:1,  client:'Trat',          package:'Title', category:'จังหวัด',         status:'Confirmed', pic:'k.koi raceup',   budget:0, remark:'' },
  { event:'KCT26', no:2,  client:'SAT',           package:'Main',  category:'กกท',             status:'Confirmed', pic:'k.kate raceup',  budget:0, remark:'' },
  { event:'KCT26', no:3,  client:'Pocari Sweat',  package:'Co',    category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'K.Best Raceup', budget:0, remark:'' },
  { event:'KCT26', no:5,  client:'Drydye',        package:'Partner', category:'เสื้อกีฬา',     status:'Confirmed', pic:'kate raceup',   budget:0, remark:'' },
  { event:'KCT26', no:6,  client:'Amino Vital',   package:'Co',    category:'เจลพลังงาน',     status:'Confirmed', pic:'ploy raceup',   budget:0, remark:'' },
  { event:'KCT26', no:7,  client:'PO Care',       package:'Co',    category:'ครีมกันแดด',     status:'Confirmed', pic:'ploy raceup',   budget:0, remark:'' },

  // ====== KTJ26 — ก้าวท้าใจ ======
  { event:'KTJ26', no:1,  client:'LG',           package:'Presenting',     category:'เครื่องใช้ไฟฟ้า', status:'Confirmed', pic:'best raceup', budget:0, remark:'' },
  { event:'KTJ26', no:2,  client:'ปตท.',          package:'Main',           category:'น้ำมัน',           status:'Pending',   pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:3,  client:'กระทรวงสาธารณสุข', package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',  status:'Confirmed', pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:4,  client:'กรมอนามัย',    package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',     status:'Confirmed', pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:5,  client:'สสส.',          package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',     status:'Confirmed', pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:6,  client:'ททท.',          package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',     status:'Pending',   pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:7,  client:'สมาคมกีฬากรีฑาฯ',package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',     status:'Confirmed', pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:8,  client:'ศิริราชพยาบาล', package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',     status:'Pending',   pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:9,  client:'กทม.',          package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',     status:'Pending',   pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:10, client:'สพฉ.',          package:'MOU/Co Promoter', category:'หน่วยงานรัฐ',     status:'Pending',   pic:'กรมอนามัย',   budget:0, remark:'' },
  { event:'KTJ26', no:11, client:'Gatorade',     package:'Co',              category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'rin raceup', budget:0, remark:'' },
  { event:'KTJ26', no:12, client:'Aquafina',     package:'Co',              category:'น้ำดื่ม',           status:'Confirmed', pic:'rin raceup', budget:0, remark:'' },
  { event:'KTJ26', no:13, client:'Axa Insurance',package:'Co',              category:'ประกันชีวิต',       status:'Cancel',    pic:'ploy raceup',budget:0, remark:'' },
  { event:'KTJ26', no:14, client:'ISUZU',        package:'Co',              category:'รถยนต์',           status:'Cancel',    pic:'kate raceup',budget:0, remark:'' },
  { event:'KTJ26', no:15, client:'Pro Freeze',   package:'Co',              category:'สเปรย์คลายกล้ามเนื้อ', status:'Confirmed', pic:'ploy raceup', budget:0, remark:'ผลิตภัณฑ์' },
  { event:'KTJ26', no:16, client:'เมืองไทย',     package:'Co',              category:'ประกันชีวิต',       status:'TBC',       pic:'กรมอนามัย',  budget:0, remark:'' },

  // ====== SSP26 — Supersports 10 Mile ======
  { event:'SSP26', no:1,  client:'Supersports',  package:'Title',  category:'',           status:'Confirmed', pic:'Kate', budget:0, remark:'' },
  { event:'SSP26', no:2,  client:'Under Armour', package:'Main',   category:'แบรนด์กีฬา', status:'Confirmed', pic:'Rin',  budget:0, remark:'' },
  { event:'SSP26', no:3,  client:'Gatorade',     package:'Co',     category:'เครื่องดื่มเกลือแร่', status:'Confirmed', pic:'Rin',  budget:0, remark:'' },
  { event:'SSP26', no:4,  client:'Aquafina',     package:'Co',     category:'น้ำดื่ม',    status:'Confirmed', pic:'Rin',  budget:0, remark:'' },
  { event:'SSP26', no:5,  client:'Checkrace',    package:'Co',     category:'ระบบรูป',   status:'Confirmed', pic:'Film', budget:0, remark:'' },
  { event:'SSP26', no:6,  client:'Prudential',   package:'Co',     category:'ประกันชีวิต', status:'Confirmed', pic:'Ploy', budget:0, remark:'' },
  { event:'SSP26', no:7,  client:'Med Park',     package:'Co',     category:'โรงพยาบาล', status:'Confirmed', pic:'Ploy', budget:0, remark:'' },

  // ====== GR26 — Garmin Run ======
  { event:'GR26', no:1,  client:'Garmin Run',           package:'Promoter', category:'Promoter',     status:'Confirmed', pic:'rin raceup', budget:0, remark:'' },
  { event:'GR26', no:2,  client:'เมืองไทย',              package:'Title',    category:'ประกันชีวิต',   status:'Confirmed', pic:'Garmin',     budget:0, remark:'' },
  { event:'GR26', no:3,  client:'Amino Vital',          package:'Co',       category:'เจลพลังงาน',    status:'Confirmed', pic:'Garmin',     budget:0, remark:'' },
  { event:'GR26', no:4,  client:'Shokz',                package:'Co',       category:'หูฟัง',         status:'Confirmed', pic:'Garmin',     budget:0, remark:'' },
  { event:'GR26', no:5,  client:'Starlux Airlines',     package:'Co',       category:'สายการบิน',     status:'Confirmed', pic:'Garmin',     budget:0, remark:'' },
  { event:'GR26', no:6,  client:'Centara Ayutthaya Hotel', package:'Co',    category:'โรงแรม',        status:'Pending',   pic:'best raceup',budget:0, remark:'' },

  // PBR26 — Placeholder (ยังไม่มี sponsor)
  { event:'PBR26', no:1, client:'',  package:'Title', category:'', status:'Pending', pic:'', budget:0, remark:'รอหา title sponsor' },
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
  return sponsors.find(s =>
    s.package === 'Title' || s.package === 'Main' || s.package === 'Presenting'
  ) || null;
};

window.getSponsorsByStatus = function(status) {
  if (!status) return window.RACEUP_SPONSORS;
  const q = String(status).toLowerCase().trim();
  return window.RACEUP_SPONSORS.filter(s => s.status.toLowerCase() === q);
};

window.getSponsorsByClient = function(clientName) {
  if (!clientName) return [];
  const q = String(clientName).toLowerCase().trim();
  return window.RACEUP_SPONSORS.filter(s => s.client.toLowerCase().includes(q));
};

window.getSponsorStats = function() {
  const arr = window.RACEUP_SPONSORS;
  const eventsWithSponsors = [...new Set(arr.map(s => s.event))];
  return {
    total:        arr.length,
    confirmed:    arr.filter(s => s.status === 'Confirmed').length,
    pending:      arr.filter(s => s.status === 'Pending').length,
    tbc:          arr.filter(s => s.status === 'TBC').length,
    cancelled:    arr.filter(s => s.status === 'Cancel').length,
    eventsCount:  eventsWithSponsors.length,
    totalBudget:  arr.reduce((s, x) => s + (parseInt(x.budget) || 0), 0),
    titleCount:   arr.filter(s => s.package === 'Title' || s.package === 'Main' || s.package === 'Presenting').length,
  };
};
