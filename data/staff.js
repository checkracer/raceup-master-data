/**
 * Race Up Work — Staff Master 2026
 * ============================================================
 * ที่มา:  Hub Apps Script getStaffDirectory (verified 2026-05-22)
 *         Sheet:  2026 Raceup Working Sheet (13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI)
 *         Tab:    Employees
 *
 * โครงสร้าง:
 *   empCode:    รหัสพนักงาน U01-U22
 *   nickname:   ชื่อเล่น (ใช้ใน chat, ภายในทีม)
 *   nameTh:     ชื่อจริง ภาษาไทย
 *   nameEn:     ชื่อจริง ภาษาอังกฤษ (จากชื่อเล่นในระบบ — ถ้ามี)
 *   role:       ตำแหน่งงาน
 *   email:      อีเมล Race Up (หรือ external ถ้าเป็น @gmail.com)
 *   phone:      เบอร์โทรศัพท์ — ⚠️ ส่วนใหญ่ยังว่าง รอเติมใน Sheet
 *   department: แผนก
 *   level:      C level / Lead / Senior / Execute
 *   status:     Active | Inactive
 *   aliases:    ชื่อเล่น/ชื่ออื่นที่ใช้ในระบบ (สำหรับ matching)
 *
 * ⚠️  ไฟล์นี้เป็น snapshot — อัพเดทเมื่อ:
 *   1. มีพนักงานใหม่/ออก → แก้ Hub Sheet แล้ว sync
 *   2. เติม phone เพิ่ม → แก้ Hub Sheet แล้ว sync
 *   3. เปลี่ยน role → แก้ Hub Sheet แล้ว sync
 *
 * วิธี Sync: ดู SYNC_DESIGN.md
 */

window.RACEUP_STAFF = [
  { empCode:'U01', nickname:'ก๋อย',  nameTh:'อลงกรณ์ เจียมอนุกูลกิจ',  nameEn:'Alongkorn',     role:'CEO',                                 email:'alongkorn@raceup.co.th',     phone:'', department:'Management',         level:'C level',  status:'Active', aliases:['อลงกรณ์','korn','Korn'] },
  { empCode:'U02', nickname:'เกด',   nameTh:'วิสุตา เจียมอนุกูลกิจ',    nameEn:'Wisuta',        role:'MD',                                  email:'wisuta@raceup.co.th',        phone:'', department:'Management',         level:'C level',  status:'Active', aliases:['วิสุตา'] },
  { empCode:'U09', nickname:'พลอย', nameTh:'พลอยไพลิน  โพธิ์เปี้ยศรี', nameEn:'Ploypailin',    role:'Accounting Officer',                  email:'ploypailin@raceup.co.th',    phone:'', department:'Accounting',         level:'Execute', status:'Active', aliases:['พลอย ACC','Ploy ACC'] },
  { empCode:'U03', nickname:'ฟีม',   nameTh:'บงกช ปัญญาเลิศสุทธิศรี',   nameEn:'Bongkoch',     role:'Project Manager',                     email:'bongkoch@raceup.co.th',      phone:'', department:'Checkrace',          level:'Lead',    status:'Active', aliases:['ฟีม - PM','Feem'] },
  { empCode:'U04', nickname:'นัชชา', nameTh:'ณัฐชา แข็งขัน',            nameEn:'Natcha',       role:'Senior Marketing Communications Officer', email:'natcha@raceup.co.th',     phone:'', department:'Media & PR',         level:'Senior',  status:'Active', aliases:['นัชชา - SMCO','Nacha'] },
  { empCode:'U07', nickname:'ข้าว',  nameTh:'สปันงา นิมิตเกษมสุภัค',    nameEn:'Sapannga',     role:'Senior Marketing Communications Officer', email:'sapannga@raceup.co.th',   phone:'', department:'Media & PR',         level:'Senior',  status:'Active', aliases:['ข้าว - SMCO'] },
  { empCode:'U16', nickname:'ต้นอ้อ',nameTh:'กัญญาวีร์ สุวรรณมณี',     nameEn:'Kanyawee',     role:'Marketing Communications Officer',     email:'kanyawee@raceup.co.th',     phone:'', department:'Media & PR',         level:'Execute', status:'Active', aliases:['ต้นอ้อ - MCO'] },
  { empCode:'U05', nickname:'ไอซ์',  nameTh:'รัตนเทพ สายจันทร์',         nameEn:'Iziing',       role:'Senior Graphic Designer',             email:'ize@raceup.co.th',           phone:'', department:'Creative & Design',  level:'Senior',  status:'Active', aliases:['ไอซ์ -SGD','iziing666@gmail.com'] },
  { empCode:'U08', nickname:'เนย',   nameTh:'ธนพร คงประเสริฐลาภ',       nameEn:'Tanaporn',     role:'Senior Graphic Designer',             email:'tanaporn@raceup.co.th',      phone:'', department:'Creative & Design',  level:'Senior',  status:'Active', aliases:['เนย -SGD'] },
  { empCode:'U17', nickname:'พรีม', nameTh:'จิรัชญาดา ศรีวิพัฒน์',     nameEn:'Jiratchayada', role:'Graphic Designer',                    email:'graphic@raceup.co.th',       phone:'', department:'Creative & Design',  level:'Execute', status:'Active', aliases:['พรีม -GD','jiratchayada.pp@gmail.com'] },
  { empCode:'U10', nickname:'เบส',   nameTh:'กิตติพณ สิทธิรุ่ง',         nameEn:'Kittipon',     role:'Account Manager',                     email:'kittipon@raceup.co.th',      phone:'', department:'Project Management', level:'Lead',    status:'Active', aliases:['เบส - AM','Bes'] },
  { empCode:'U12', nickname:'พลอย', nameTh:'วรัญญา ดิษฐ์เชยเดช',       nameEn:'Waranya',      role:'Account Executive',                   email:'waranya@raceup.co.th',       phone:'', department:'Project Management', level:'Execute', status:'Active', aliases:['พลอย -AE'] },
  { empCode:'U13', nickname:'จา',    nameTh:'ยุทธภพ พร้อมเพรียง',       nameEn:'Yutthapob',    role:'Senior Event Operation Officer',      email:'yutthapob@raceup.co.th',     phone:'', department:'Event Operation',    level:'Senior',  status:'Active', aliases:['จา - SEO','Jah'] },
  { empCode:'U14', nickname:'ภูมิ',   nameTh:'อภิสิทธิ์',                 nameEn:'Apisit',       role:'Timing / Race Result',                email:'apisit@raceup.co.th',        phone:'', department:'Event Operation',    level:'Senior',  status:'Active', aliases:['ภูมิ - Timing','Phum'] },
  { empCode:'U15', nickname:'ตั้ม',   nameTh:'ดวงทองคำ',                  nameEn:'Duangthongkham', role:'On Course Manager / Production',  email:'duangthongkham@gmail.com',    phone:'', department:'Event Operation',    level:'Senior',  status:'Active', aliases:['ตั้ม - On Course'] },
  { empCode:'U18', nickname:'โฟร์',  nameTh:'',                          nameEn:'Eventco',      role:'Event Coordinator',                   email:'eventco@raceup.co.th',       phone:'', department:'Event Operation',    level:'Execute', status:'Active', aliases:['โฟร์'] },
  { empCode:'U19', nickname:'เฟิร์ส',nameTh:'',                         nameEn:'Raceco',       role:'Race Coordinator',                    email:'raceco@raceup.co.th',        phone:'', department:'Event Operation',    level:'Execute', status:'Active', aliases:['เฟิร์ส'] },
  { empCode:'U20', nickname:'ริน',   nameTh:'ชรินรัตน์',                  nameEn:'Charinrat',    role:'Operations Officer',                  email:'charinrat@raceup.co.th',     phone:'', department:'Operations',         level:'Execute', status:'Active', aliases:['ริน'] },
  { empCode:'U21', nickname:'วุฒิ',  nameTh:'รัตวุฒิ',                    nameEn:'Rattawut',     role:'Operations Officer',                  email:'rattawut@raceup.co.th',      phone:'', department:'Operations',         level:'Execute', status:'Active', aliases:['วุด','Wut'] },
  { empCode:'U06', nickname:'พีม',   nameTh:'',                          nameEn:'Peem',         role:'Hydration / Course Service',          email:'',                           phone:'', department:'Event Operation',    level:'Execute', status:'Active', aliases:['พีม'] },
  { empCode:'U11', nickname:'ย้ง',   nameTh:'',                          nameEn:'',             role:'Operations',                          email:'',                           phone:'', department:'Operations',         level:'Execute', status:'Active', aliases:['ย้ง'] },
  { empCode:'U22', nickname:'มาย',   nameTh:'',                          nameEn:'',             role:'Operations',                          email:'',                           phone:'', department:'Operations',         level:'Execute', status:'Active', aliases:['มาย','เอิร์น'] },
];

/* ============================================================
   HELPERS
   ============================================================ */

/** หา staff ด้วย email (case-insensitive) */
window.getStaffByEmail = function(email) {
  if (!email) return null;
  const q = String(email).toLowerCase().trim();
  return window.RACEUP_STAFF.find(s => s.email.toLowerCase() === q) || null;
};

/** หา staff ด้วย nickname หรือ alias */
window.getStaffByNickname = function(nick) {
  if (!nick) return null;
  const q = String(nick).toLowerCase().trim();
  return window.RACEUP_STAFF.find(s => {
    if (s.nickname.toLowerCase() === q) return true;
    if (s.nameEn.toLowerCase() === q) return true;
    if ((s.aliases || []).some(a => String(a).toLowerCase() === q)) return true;
    return false;
  }) || null;
};

/** หา staff ทุกคนใน department */
window.getStaffByDepartment = function(dept) {
  if (!dept) return [];
  const q = String(dept).toLowerCase().trim();
  return window.RACEUP_STAFF.filter(s => s.department.toLowerCase() === q);
};

/** สถิติรวม */
window.getStaffStats = function() {
  const active = window.RACEUP_STAFF.filter(s => s.status === 'Active');
  return {
    total:        window.RACEUP_STAFF.length,
    active:       active.length,
    withPhone:    active.filter(s => s.phone).length,
    withoutPhone: active.filter(s => !s.phone).length,
    departments:  [...new Set(active.map(s => s.department))],
  };
};
