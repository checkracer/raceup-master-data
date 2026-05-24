/**
 * Race Up Work — Race Pack Categories Master 2026
 * ใช้ร่วมกันใน no.raceup.co.th และ subdomain อื่น ๆ ที่ต้องการข้อมูล Race Pack
 *
 * Lot Timeline:
 *  Lot 1 — หลังเปิดรับสมัคร 1 เดือน (REG_OPEN + 30 วัน)
 *  Lot 2 — ก่อนวันแข่ง 2 เดือน (RACE_DAY − 60 วัน)
 *  Lot 3 — รอบเก็บตก ก่อนวันงาน 45 วัน (RACE_DAY − 45 วัน)
 */
window.RACEPACK_CATEGORIES = [
  {
    id: 'medal',
    name: 'เหรียญ Finisher',
    icon: '🏅',
    lots: 3,
    buffer: true,                // หัก Buffer No Show
    formula: 'registered * (1 - buffer%) * (1 + extra_buffer%)',
    default_buffer_no_show: 5,   // %
    suppliers: ['Sophie / Shenzhen Dingguan']
  },
  {
    id: 'shirt',
    name: 'เสื้อนักวิ่ง',
    icon: '👕',
    lots: 3,
    buffer: false,               // ตามจำนวนนักวิ่งจริง
    formula: 'registered',
    size_ratio: { XS: 0.05, S: 0.15, M: 0.25, L: 0.25, XL: 0.18, '2XL': 0.08, '3XL': 0.04 },
    suppliers: []
  },
  {
    id: 'trophy',
    name: 'โล่รางวัล',
    icon: '🏆',
    lots: 1,
    buffer: false,
    formula: 'awards_count (Overall + Age Group × distances)',
    suppliers: []
  },
  {
    id: 'bag',
    name: 'ถุงผ้า',
    icon: '🛍️',
    lots: 1,
    buffer: true,
    formula: 'registered * (1 - buffer%)',
    default_buffer_no_show: 5,
    suppliers: []
  },
  {
    id: 'top100',
    name: 'รางวัล Top 100',
    icon: '🥇',
    lots: 1,
    buffer: false,
    fixed_qty: 200,              // 100 ชาย + 100 หญิง
    formula: 'distances_with_top100 × 200 (100M + 100F)',
    suppliers: []
  }
];

window.RACEPACK_STATUS_FLOW = [
  { id: 'planning',   label: 'วางแผน',         color: '#8E939B' },
  { id: 'quoted',     label: 'ขอใบเสนอราคา',   color: '#185FA5' },
  { id: 'po-sent',    label: 'ส่ง PO',          color: '#EF9F27' },
  { id: 'production', label: 'กำลังผลิต',      color: '#EE4439' },
  { id: 'qc',         label: 'QC',              color: '#534AB7' },
  { id: 'shipping',   label: 'ขนส่ง',          color: '#185FA5' },
  { id: 'arrived',    label: 'รับของแล้ว',     color: '#1D9E75' },
  { id: 'completed',  label: 'เสร็จสิ้น',      color: '#1D9E75' }
];

/** helper: คำนวณวันที่ Lot 2 + Lot 3 จาก raceDay (YYYY-MM-DD) */
window.calcLotDates = function(raceDay) {
  if (!raceDay) return null;
  const race = new Date(raceDay);
  const lot2 = new Date(race); lot2.setDate(lot2.getDate() - 60);
  const lot3 = new Date(race); lot3.setDate(lot3.getDate() - 45);
  const fmt = d => d.toISOString().slice(0, 10);
  return {
    lot1: 'หลังเปิดรับสมัคร 1 เดือน (REG_OPEN + 30)',
    lot2: fmt(lot2),
    lot3: fmt(lot3),
    raceDay: fmt(race)
  };
};
