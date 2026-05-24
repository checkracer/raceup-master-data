/**
 * Race Up Work — Suppliers Master 2026
 * ============================================================
 * ที่มา: skill event-supplier-database / Google Sheet supplier database
 *
 * โครงสร้าง:
 *   category:   medal | shirt | bib | timing | medical | transport | hotel | F&B | production | logistics
 *   name:       ชื่อ supplier
 *   country:    TH | CN | International
 *   contact:    คนติดต่อ + เบอร์/email
 *   rating:     1-5 (จาก past events)
 *   lastUsed:   YYYY-MM-DD ล่าสุด
 *   priceRange: ประมาณราคา (THB)
 *   notes:      เพิ่มเติม
 *
 * ⚠️ Placeholder — ค่อย sync จาก event-supplier-database skill หรือ Google Sheet
 */

window.RACEUP_SUPPLIERS = [
  // Medal
  { category:'medal',     name:'Sophie / Shenzhen Dingguan',           country:'CN',            contact:'Sophie',                  rating:5, lastUsed:'2025', priceRange:'฿30-200/เหรียญ', notes:'หลัก · ทุก scenic series' },

  // Timing
  { category:'timing',    name:'RACE RESULT 14 (Ubidium)',              country:'International', contact:'Local rep TH',            rating:5, lastUsed:'2026', priceRange:'฿15-50/นักวิ่ง',  notes:'Active transponder · ใช้ทุก scenic + KRM/KYM' },
  { category:'timing',    name:'Checkrace (passive chip / bib tag)',    country:'TH',            contact:'ภูมิ',                    rating:4, lastUsed:'2026', priceRange:'฿8-20/นักวิ่ง',   notes:'รอง · งานเล็ก/CTP' },

  // Medical
  { category:'medical',   name:'Prime Sport',                            country:'TH',            contact:'',                        rating:5, lastUsed:'2025', priceRange:'฿80k-150k/งาน',  notes:'ใช้หลัก · ทุกงาน OE' },
  { category:'medical',   name:'รพ.กรุงเทพ จันทบุรี',                   country:'TH',            contact:'ER 039-319888',           rating:5, lastUsed:'2025', priceRange:'-',              notes:'CSMH26 partner · Massage' },

  // Production
  { category:'production', name:'TBC — local production team',           country:'TH',            contact:'ตั้ม',                    rating:0, lastUsed:'',     priceRange:'',                notes:'แต่ละงานอาจใช้คนละทีม' },

  // Transport
  { category:'transport',  name:'TBC — bus rental',                      country:'TH',            contact:'',                        rating:0, lastUsed:'',     priceRange:'฿8k-15k/คัน',     notes:'Shuttle service สำหรับงาน scenic' },

  // F&B
  { category:'F&B',        name:'TBC',                                   country:'TH',            contact:'',                        rating:0, lastUsed:'',     priceRange:'',                notes:'อาหาร after party + race pack' },

  // Hotel
  { category:'hotel',      name:'TBC — local per event',                 country:'TH',            contact:'',                        rating:0, lastUsed:'',     priceRange:'฿800-2500/คืน',   notes:'staff accommodation + VIP' },

  // Logistics
  { category:'logistics',  name:'TBC — รถ 6 ล้อ + 10 ล้อ',              country:'TH',            contact:'',                        rating:0, lastUsed:'',     priceRange:'฿5k-15k/คัน/วัน',  notes:'ขนอุปกรณ์ + race pack' },
];

/* ============================================================
   HELPERS
   ============================================================ */

window.getSuppliersByCategory = function(cat) {
  if (!cat) return window.RACEUP_SUPPLIERS;
  const q = String(cat).toLowerCase().trim();
  return window.RACEUP_SUPPLIERS.filter(s => s.category.toLowerCase() === q);
};

window.getTopSuppliers = function(limit) {
  return [...window.RACEUP_SUPPLIERS]
    .filter(s => s.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit || 5);
};

window.getSupplierStats = function() {
  const cats = [...new Set(window.RACEUP_SUPPLIERS.map(s => s.category))];
  return {
    total:      window.RACEUP_SUPPLIERS.length,
    categories: cats.length,
    rated:      window.RACEUP_SUPPLIERS.filter(s => s.rating > 0).length,
    byCategory: cats.map(c => ({ category: c, count: window.RACEUP_SUPPLIERS.filter(s => s.category === c).length })),
  };
};
