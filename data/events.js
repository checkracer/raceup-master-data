/**
 * Race Up Work — Events Master Data 2026
 * ใช้สำหรับ Race Operation Hub
 *
 * ที่มา: skills/raceup-context/references/events_2026.md (verified 2026-05-18)
 * รวม 22 งาน — Target รวม 91,500 นักวิ่ง
 *
 * โครงสร้าง:
 *  code:        Event code (KRM26, CSMH26, ...)
 *  name:        ชื่องานเต็ม
 *  shortName:   ชื่อย่อแสดงบน UI
 *  expoDate:    วันงาน Expo (YYYY-MM-DD) — null ถ้าไม่มี Expo
 *  date:        วัน Race Day (YYYY-MM-DD)
 *  province:    จังหวัดจริง (ไม่ใช่ชื่ออำเภอ — ใช้สำหรับเอกสาร)
 *  venueShort:  พื้นที่จัดงานสั้น ๆ
 *  venue:       ชื่อสถานที่ start/finish
 *  distances:   ระยะที่เปิด
 *  startLat / startLng: จุดปล่อยตัว (ใช้สำหรับ Map zoom — ถ้ายังไม่ confirm ใช้ centroid จังหวัด)
 *  zoom:        Map zoom level (12-14 ปกติ)
 *  color:       สีหลักของงาน (Brand color)
 *  category:    'OE' (Own Event) | 'EO' (Event Organizer)
 *  series:      'Scenic Series' | 'Counterpain Series' | 'Standalone OE' | 'EO Brand'
 *  target:      จำนวนนักวิ่งเป้าหมาย
 *  chatKey:     คีย์ห้องแชท Google Chat (ใช้ map กับ getAllUserData().myChats)
 *  sheetId:     Google Sheet ID เก็บข้อมูล Race Ops (เติมทีหลัง)
 *  raceResultId:Race Result event ID (สำหรับ Live timing API)
 *  mapEmbedUrl: URL iframe ของ Google My Maps / Google Earth / Google Maps Share
 *               (ดู docs/MAP_EMBED_GUIDE.md เพื่อสร้าง URL)
 *               ปล่อยว่าง = หน้า map จะแสดง overlay บอกให้สร้าง
 */
window.RACEUP_EVENTS = [
  {
    code: 'KYM26',
    name: 'Khao Yai Marathon 2026',
    shortName: 'KYM26',
    expoDate: '2026-01-10',
    date: '2026-01-11',
    province: 'นครราชสีมา',
    venueShort: 'เขาใหญ่',
    venue: 'อุทยานแห่งชาติเขาใหญ่',
    distances: ['42K', '21K', '10K', '5K', '2K'],
    startLat: 14.4419, startLng: 101.3733, zoom: 13,
    color: '#2E8B57',
    category: 'OE', series: 'Standalone OE',
    target: 7500,
    chatKey: 'KYM26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'PO26',
    name: 'Pocari Sweat Run 2026',
    shortName: 'PO26',
    expoDate: '2026-01-16',
    date: '2026-01-17',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10K', '5K', '3K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#0072CE',
    category: 'EO', series: 'EO Brand',
    target: 6000,
    chatKey: 'PO26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'AMN26',
    name: 'Amino Vital Run 2026',
    shortName: 'AMN26',
    expoDate: '2026-02-07',
    date: '2026-02-08',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10K', '5K', '3K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#E60012',
    category: 'EO', series: 'EO Brand',
    target: 4000,
    chatKey: 'AMN26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'PSMH26',
    name: 'Scenic Half Marathon Pranburi 2026',
    shortName: 'PSMH26',
    expoDate: '2026-02-14',
    date: '2026-02-15',
    province: 'ประจวบคีรีขันธ์',
    venueShort: 'ปราณบุรี',
    venue: 'ปราณบุรี',
    distances: ['21K', '10K', '5K', '3K'],
    startLat: 12.3878, startLng: 99.9075, zoom: 13,
    color: '#1D7BC4',
    category: 'OE', series: 'Scenic Series',
    target: 3500,
    chatKey: 'PSMH26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'SSP26',
    name: 'Supersports 10 Mile Run 2026',
    shortName: 'SSP26',
    expoDate: '2026-05-16',
    date: '2026-05-17',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10Mile', '10K', '5K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#39FF14',
    category: 'EO', series: 'EO Brand',
    target: 7500,
    chatKey: 'SSP26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'PBR26',
    name: 'Pink Blue Run 2026',
    shortName: 'PBR26',
    expoDate: null,
    date: '2026-05-24',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10K', '5K', '3K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#FF69B4',
    category: 'EO', series: 'EO Brand',
    target: 3000,
    chatKey: 'PBR26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'CSMH26',
    name: 'Prudentia Scenic 1/2 Marathon Chanthaburi 2026',
    shortName: 'CSMH26',
    expoDate: '2026-06-06',
    date: '2026-06-07',
    province: 'จันทบุรี',
    venueShort: 'หาดคุ้งวิมาน',
    venue: 'สี่แยกคุ้งวิมาน ต.สนามไชย อ.นายายอาม จ.จันทบุรี',
    distances: ['21K', '10K', '5K', '3K'],
    // Start/Finish: สี่แยกคุ้งวิมาน (verified จาก runner guide CSMH26 v2)
    startLat: 12.5775, startLng: 101.9355, zoom: 14,
    color: '#7444F5',  // CSMH brand purple
    category: 'OE', series: 'Scenic Series',
    target: 4500,
    chatKey: 'CSMH26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'KTJ26',
    name: 'ก้าวท้าใจ 10K Thailand Championship 2026',
    shortName: 'KTJ26',
    expoDate: '2026-06-20',
    date: '2026-06-21',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10K', '5K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#F4A300',
    category: 'EO', series: 'EO Brand',
    target: 8000,
    chatKey: 'KTJ26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'LR26',
    name: 'League Run 2026',
    shortName: 'LR26',
    expoDate: null,
    date: '2026-06-28',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['Team 10K', 'Team 5K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#FFC107',
    category: 'OE', series: 'Standalone OE',
    target: 1000,
    chatKey: 'League',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'RSMH26',
    name: 'Scenic Half Marathon Rayong 2026',
    shortName: 'RSMH26',
    expoDate: '2026-08-01',
    date: '2026-08-02',
    province: 'ระยอง',
    venueShort: 'ระยอง',
    venue: 'ระยอง',
    distances: ['21K', '10K'],
    startLat: 12.6802, startLng: 101.2566, zoom: 13,
    color: '#5B8DEF',
    category: 'OE', series: 'Scenic Series',
    target: 4500,
    chatKey: 'RSMH26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'CTP-BKK',
    name: 'Counterpain Run 2026 Bangkok',
    shortName: 'CTP-BKK',
    expoDate: '2026-08-22',
    date: '2026-08-23',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10K', '5K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#00A6A6',
    category: 'OE', series: 'Counterpain Series',
    target: 1000,
    chatKey: 'CTP-BKK',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'CTP-KR',
    name: 'Counterpain Run 2026 Korat',
    shortName: 'CTP-KR',
    expoDate: null,
    date: '2026-09-06',
    province: 'นครราชสีมา',
    venueShort: 'โคราช',
    venue: 'โคราช',
    distances: ['10K', '5K'],
    startLat: 14.9799, startLng: 102.0978, zoom: 13,
    color: '#00A6A6',
    category: 'EO', series: 'Counterpain Series',
    target: 500,
    chatKey: 'CTP-KR',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'KSMH26',
    name: 'Scenic Half Marathon Krabi 2026',
    shortName: 'KSMH26',
    expoDate: '2026-09-12',
    date: '2026-09-13',
    province: 'กระบี่',
    venueShort: 'กระบี่',
    venue: 'อ่าวนาง กระบี่',
    distances: ['21K', '10K', '5K', '3K'],
    startLat: 8.0863, startLng: 98.9063, zoom: 13,
    color: '#00A8A8',
    category: 'OE', series: 'Scenic Series',
    target: 4000,
    chatKey: 'KSMH26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'CTP-KAN',
    name: 'Counterpain Run 2026 Kanchanaburi',
    shortName: 'CTP-KAN',
    expoDate: null,
    date: '2026-09-20',
    province: 'กาญจนบุรี',
    venueShort: 'กาญจนบุรี',
    venue: 'กาญจนบุรี',
    distances: ['10K', '5K'],
    startLat: 14.0227, startLng: 99.5328, zoom: 13,
    color: '#00A6A6',
    category: 'EO', series: 'Counterpain Series',
    target: 500,
    chatKey: 'CTP-KAN',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'KCT26',
    name: 'Koh Chang Trail 2026',
    shortName: 'KCT26',
    expoDate: '2026-09-26',
    date: '2026-09-27',
    province: 'ตราด',
    venueShort: 'เกาะช้าง',
    venue: 'เกาะช้าง จ.ตราด',
    distances: ['Trail 55K', '30K', '15K', '8K'],
    startLat: 12.0833, startLng: 102.3167, zoom: 12,
    color: '#7B5E3C',
    category: 'OE', series: 'Standalone OE',
    target: 1500,
    chatKey: 'KCT26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'CTP-KK',
    name: 'Counterpain Run 2026 Khon Kaen',
    shortName: 'CTP-KK',
    expoDate: null,
    date: '2026-10-04',
    province: 'ขอนแก่น',
    venueShort: 'ขอนแก่น',
    venue: 'ขอนแก่น',
    distances: ['10K', '5K'],
    startLat: 16.4322, startLng: 102.8236, zoom: 13,
    color: '#00A6A6',
    category: 'EO', series: 'Counterpain Series',
    target: 500,
    chatKey: 'CTP-KK',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'CMSH26',
    name: 'Scenic Half Marathon Chiang Mai 2026',
    shortName: 'CMSH26',
    expoDate: '2026-10-31',
    date: '2026-11-01',
    province: 'เชียงใหม่',
    venueShort: 'เชียงใหม่',
    venue: 'อุทยานหลวงราชพฤกษ์',
    distances: ['21K', '10K', '5K', '3K'],
    startLat: 18.7434, startLng: 98.9356, zoom: 13,
    color: '#FF6B35',
    category: 'OE', series: 'Scenic Series',
    target: 4500,
    chatKey: 'CMSH26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'KRM26',
    name: 'Korat Marathon 2026',
    shortName: 'KRM26',
    expoDate: '2026-11-07',
    date: '2026-11-08',
    province: 'นครราชสีมา',
    venueShort: 'โคราช',
    venue: 'โคราช',
    distances: ['42K', '21K', '10K', '5K'],
    startLat: 14.9799, startLng: 102.0978, zoom: 13,
    color: '#E63946',
    category: 'OE', series: 'Standalone OE',
    target: 10000,
    chatKey: 'KRM26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'WR26',
    name: 'Allianz Ayudhya World Run 2026',
    shortName: 'WR26',
    expoDate: '2026-11-21',
    date: '2026-11-22',
    province: 'นครราชสีมา',
    venueShort: 'โคราช',
    venue: 'โคราช',
    distances: ['10K', '5K'],
    startLat: 14.9799, startLng: 102.0978, zoom: 13,
    color: '#0033A0',
    category: 'EO', series: 'EO Brand',
    target: 5000,
    chatKey: 'WR26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'GR26',
    name: 'Garmin Run Thailand 2026 World Series',
    shortName: 'GR26',
    expoDate: '2026-12-05',
    date: '2026-12-06',
    province: 'พระนครศรีอยุธยา',
    venueShort: 'อยุธยา',
    venue: 'อยุธยา',
    distances: ['21K', '10K', '5K'],
    startLat: 14.3692, startLng: 100.5876, zoom: 13,
    color: '#007AC1',
    category: 'EO', series: 'EO Brand',
    target: 5500,
    chatKey: 'GR26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'NSM26',
    name: 'Scenic Marathon Nakhon Phanom 2026',
    shortName: 'NSM26',
    aliases: ['NSMH26'],  // legacy: was named NSMH26 (Half) before rebrand to NSM (full marathon series)
    expoDate: '2026-12-12',
    date: '2026-12-13',
    province: 'นครพนม',
    venueShort: 'นครพนม',
    venue: 'นครพนม',
    distances: ['42K', '21K', '10K', '5K'],
    startLat: 17.4108, startLng: 104.7787, zoom: 13,
    color: '#8B5A3C',
    category: 'OE', series: 'Scenic Series',
    target: 4000,
    chatKey: 'NSM26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'GAT26',
    name: 'Gatorade Run 2026',
    shortName: 'GAT26',
    expoDate: '2026-12-26',
    date: '2026-12-27',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10K', '5K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#FF6F00',
    category: 'EO', series: 'EO Brand',
    target: 5000,
    chatKey: 'Gatorade26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  // ============================================================
  //  Additional events จาก Working Sheet Quick Fact (เพิ่ม 2026-05-25)
  // ============================================================
  {
    code: 'CTP-CM',
    name: 'Counterpain Run 2026 Chiang Mai',
    shortName: 'CTP-CM',
    expoDate: null,
    date: '2026-10-31',
    province: 'เชียงใหม่',
    venueShort: 'เชียงใหม่',
    venue: 'เชียงใหม่',
    distances: ['10K', '5K'],
    startLat: 18.7883, startLng: 98.9853, zoom: 13,
    color: '#00A6A6',
    category: 'EO', series: 'Counterpain Series',
    target: 500,
    chatKey: 'CTP-CM',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'GATRUNCLUB26',
    name: 'Gatorade Run Club Event 2026',
    shortName: 'GAT-Club',
    expoDate: null,
    date: '2026-06-13',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok (Run Club series 7 ครั้ง)',
    distances: ['3K', '5K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#FF6F00',
    category: 'EO', series: 'EO Brand',
    target: 150,
    chatKey: 'GATRUNCLUB26',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  // ============================================================
  //  2027 events (preview — เริ่มขายบัตร/วางแผนล่วงหน้า)
  // ============================================================
  {
    code: 'KYM27',
    name: 'Khao Yai Marathon 2027',
    shortName: 'KYM27',
    expoDate: '2027-01-09',
    date: '2027-01-10',
    province: 'นครราชสีมา',
    venueShort: 'เขาใหญ่',
    venue: 'อุทยานแห่งชาติเขาใหญ่',
    distances: ['42K', '21K', '10K', '5K', '2K'],
    startLat: 14.4419, startLng: 101.3733, zoom: 13,
    color: '#2E8B57',
    category: 'OE', series: 'Standalone OE',
    target: 9000,
    chatKey: 'KYM27',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'PO27',
    name: 'Pocari Sweat Run 2027',
    shortName: 'PO27',
    expoDate: '2027-01-16',
    date: '2027-01-17',
    province: 'กรุงเทพมหานคร',
    venueShort: 'กรุงเทพ',
    venue: 'TBC — Bangkok',
    distances: ['10K', '5K', '3K'],
    startLat: 13.7563, startLng: 100.5018, zoom: 12,
    color: '#0072CE',
    category: 'EO', series: 'EO Brand',
    target: 6500,
    chatKey: 'PO27',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  },
  {
    code: 'KDMH27',
    name: 'Khun Dan Half Marathon 2027',
    shortName: 'KDMH27',
    expoDate: '2027-01-30',
    date: '2027-01-31',
    province: 'นครนายก',
    venueShort: 'เขื่อนขุนด่านปราการชล',
    venue: 'เขื่อนขุนด่านปราการชล',
    distances: ['21K', '10K', '5K', '3K'],
    startLat: 14.3146, startLng: 101.3322, zoom: 13,
    color: '#1B998B',
    category: 'OE', series: 'Standalone OE',
    target: 4000,
    chatKey: 'KDMH27',
    sheetId: '', raceResultId: '', mapEmbedUrl: ''
  }
];

/* ---------- helpers ---------- */

/** หา event โดย code (case-insensitive) */
window.getEventByCode = function(code) {
  if (!code) return null;
  return window.RACEUP_EVENTS.find(e => e.code.toUpperCase() === code.toUpperCase()) || null;
};

/** ดึง event ที่จะถึงเร็วที่สุดในอนาคต (เทียบกับวันที่วันนี้) */
window.getNextEvent = function() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = window.RACEUP_EVENTS
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] || window.RACEUP_EVENTS[0];
};

/** สรุปจำนวน event ต่อ series */
window.getEventsBySeries = function(series) {
  return window.RACEUP_EVENTS.filter(e => e.series === series);
};

/** รวม target นักวิ่งของทุกงาน */
window.getTotalTarget = function() {
  return window.RACEUP_EVENTS.reduce((sum, e) => sum + (e.target || 0), 0);
};
