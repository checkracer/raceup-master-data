/**
 * Race Up Work — Staff Master 2026
 * ============================================================
 * ที่มา:  2026 Raceup Working Sheet (13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI)
 *         Tab: "Contact"
 *
 * Sync date: 2026-05-24 (manual sync จาก sheet snapshot)
 *
 * โครงสร้าง:
 *   empCode:    รหัสพนักงาน
 *   nickname:   ชื่อเล่น (ใช้ใน chat, ภายในทีม)
 *   nameTh:     ชื่อจริง ภาษาไทย
 *   nameEn:     ชื่อจริง ภาษาอังกฤษ
 *   role:       ตำแหน่งงาน
 *   email:      อีเมล Race Up
 *   phone:      เบอร์โทรศัพท์ ✅ verified จาก Contact tab
 *   phoneEmergency: เบอร์ฉุกเฉิน (ญาติ)
 *   department: แผนก
 *   level:      C level / Lead / Senior / Execute
 *   status:     Active
 *   aliases:    ชื่อเล่น/ชื่ออื่นที่ใช้ในระบบ
 */

window.RACEUP_STAFF = [
  { empCode:'U01', nickname:'ก๋อย',  nameTh:'อลงกรณ์ เจียมอนุกูลกิจ',  nameEn:'Alongkorn',     role:'CEO',                                  email:'alongkorn@raceup.co.th',     phone:'084-692-9955', phoneEmergency:'090-993-3105', department:'Management',         level:'C level', status:'Active', aliases:['อลงกรณ์','Korn','korn'] },
  { empCode:'U02', nickname:'เกด',   nameTh:'วิสุตา เจียมอนุกูลกิจ',    nameEn:'Wisuta',        role:'MD',                                   email:'wisuta@raceup.co.th',        phone:'090-993-3105', phoneEmergency:'084-692-9955', department:'Management',         level:'C level', status:'Active', aliases:['วิสุตา','Kate','kate'] },
  { empCode:'U09', nickname:'พลอย ACC', nameTh:'พลอยไพลิน โพธิ์เปี้ยศรี', nameEn:'Ploypailin', role:'Accounting Officer',                   email:'ploypailin@raceup.co.th',    phone:'094-664-4878', phoneEmergency:'',             department:'Accounting',         level:'Execute', status:'Active', aliases:['พลอย-ACC','Ploypailin'] },
  { empCode:'U03', nickname:'ฟีม',   nameTh:'บงกช ปัญญาเลิศสุทธิศรี',  nameEn:'Bongkoch',     role:'Project Manager',                      email:'bongkoch@raceup.co.th',      phone:'096-298-7452', phoneEmergency:'024-763-056',  department:'Checkrace',          level:'Lead',    status:'Active', aliases:['ฟีม-PM','Feem','ฟีล์ม','Bongkoch'] },
  { empCode:'U04', nickname:'นัชชา', nameTh:'ณัฐชา แข็งขัน',           nameEn:'Nacha',        role:'Senior Marketing Communications Officer', email:'nacha@raceup.co.th',      phone:'098-620-5004', phoneEmergency:'',             department:'Media & PR',         level:'Senior',  status:'Active', aliases:['นัชชา-SMCO','Nacha','natcha@raceup.co.th'] },
  { empCode:'U07', nickname:'ข้าว',  nameTh:'สปันงา นิมิตเกษมสุภัค',    nameEn:'Sapannga',     role:'Senior Marketing Communications Officer', email:'sapannga@raceup.co.th',   phone:'091-814-0901', phoneEmergency:'',             department:'Media & PR',         level:'Senior',  status:'Active', aliases:['ข้าว-SMCO','Sapannga'] },
  { empCode:'U16', nickname:'ต้นอ้อ',nameTh:'กัญญาวีร์ สุวรรณมณี',     nameEn:'Kanyawee',     role:'Marketing Communications Officer',      email:'kanyawee@raceup.co.th',     phone:'083-296-9445', phoneEmergency:'095-483-9919', department:'Media & PR',         level:'Execute', status:'Active', aliases:['ต้นอ้อ-MCO','Kanyawee'] },
  { empCode:'U05', nickname:'ไอซ์',  nameTh:'รัตนเทพ สายจันทร์',        nameEn:'Iziing',       role:'Senior Graphic Designer',              email:'iziing666@gmail.com',         phone:'087-498-7800', phoneEmergency:'087-415-4703', department:'Creative & Design',  level:'Senior',  status:'Active', aliases:['ไอซ์','Iziing','ize@raceup.co.th'] },
  { empCode:'U08', nickname:'เนย',   nameTh:'ธนพร คงประเสริฐลาภ',       nameEn:'Tanaporn',     role:'Senior Graphic Designer',              email:'tanaporn@raceup.co.th',      phone:'087-111-5884', phoneEmergency:'',             department:'Creative & Design',  level:'Senior',  status:'Active', aliases:['เนย','Tanaporn'] },
  { empCode:'U17', nickname:'พรีม',  nameTh:'จิรัชญาดา ศรีวิพัฒน์',     nameEn:'Jiratchayada', role:'Graphic Designer',                     email:'jiratchayada.pp@gmail.com',   phone:'081-024-0200', phoneEmergency:'',             department:'Creative & Design',  level:'Execute', status:'Active', aliases:['พรีม','พีม','Jiratchayada','graphic@raceup.co.th'] },
  { empCode:'U10', nickname:'เบส',   nameTh:'กิตติพณ สิทธิรุ่ง',         nameEn:'Kittipon',     role:'Account Manager',                      email:'kittipon@raceup.co.th',      phone:'086-354-8345', phoneEmergency:'',             department:'Project Management', level:'Lead',    status:'Active', aliases:['เบส-AM','Kittipon','Bes'] },
  { empCode:'U12', nickname:'พลอย AE',nameTh:'วรัญญา ดิษฐ์เชยเดช',      nameEn:'Waranya',      role:'Account Executive',                    email:'waranya@raceup.co.th',       phone:'085-338-9155', phoneEmergency:'085-282-6739', department:'Project Management', level:'Execute', status:'Active', aliases:['พลอย','พลอย-AE','Waranya'] },
  { empCode:'U13', nickname:'จา',    nameTh:'ยุทธภพ พร้อมเพรียง',       nameEn:'Yutthapob',    role:'Senior Event Operation Officer',       email:'Yutthapob@raceup.co.th',     phone:'099-250-0007', phoneEmergency:'',             department:'Event Operation',    level:'Senior',  status:'Active', aliases:['จา-SEO','Jah','Yutthapob'] },
  { empCode:'U14', nickname:'ภูมิ',   nameTh:'อภิสิทธิ์',                 nameEn:'Apisit',       role:'Event Coordinator',                    email:'apisit@raceup.co.th',        phone:'092-247-0970', phoneEmergency:'',             department:'Event Operation',    level:'Execute', status:'Active', aliases:['ภูมิ-ECO','Phum','Apisit'] },
  { empCode:'U15', nickname:'ตั้ม',   nameTh:'ดวงทองคำ',                 nameEn:'Duangthongkham', role:'Senior Race Operation Officer',     email:'duangthongkham@gmail.com',   phone:'095-404-2224', phoneEmergency:'061-624-5956', department:'Event Operation',    level:'Senior',  status:'Active', aliases:['ตั้ม-SRO','Duangthongkham'] },
  { empCode:'U18', nickname:'โฟร์',  nameTh:'',                          nameEn:'Eventco',      role:'Event Coordinator',                    email:'eventco@raceup.co.th',       phone:'095-769-8385', phoneEmergency:'',             department:'Event Operation',    level:'Execute', status:'Active', aliases:['โฟร์-ECO','Eventco'] },
  { empCode:'U19', nickname:'เฟิร์ส',nameTh:'',                         nameEn:'Raceco',       role:'Race Coordinator',                     email:'raceco@raceup.co.th',        phone:'063-676-1326', phoneEmergency:'',             department:'Event Operation',    level:'Execute', status:'Active', aliases:['เฟิร์ส-RCO','Raceco'] },
  { empCode:'U20', nickname:'ริน',   nameTh:'ชรินรัตน์',                  nameEn:'Charinrat',    role:'Account Executive',                    email:'charinrat@raceup.co.th',     phone:'097-067-4915', phoneEmergency:'',             department:'Project Management', level:'Execute', status:'Active', aliases:['ริน-AE','Charinrat'] },
  { empCode:'U21', nickname:'วุด',   nameTh:'รัตวุฒิ',                   nameEn:'Rattawut',     role:'Event Coordinator',                    email:'rattawut@raceup.co.th',      phone:'096-713-5941', phoneEmergency:'090-974-7987', department:'Event Operation',    level:'Execute', status:'Active', aliases:['วุฒิ','Wut','Rattawut'] },
  { empCode:'U22', nickname:'เอิร์น',nameTh:'',                          nameEn:'',             role:'Execute',                              email:'',                            phone:'',             phoneEmergency:'',             department:'Operations',         level:'Execute', status:'Active', aliases:['เอิร์น'] },
  { empCode:'U23', nickname:'มาย',   nameTh:'ธนกร',                      nameEn:'Thanakorn',    role:'Marketing Officer',                    email:'checkpr@raceup.co.th',       phone:'095-163-2748', phoneEmergency:'',             department:'Media & PR',         level:'Execute', status:'Active', aliases:['มาย','Thanakorn','Thanakorn@raceup.co.th'] },
  { empCode:'U24', nickname:'ย้ง',   nameTh:'กัมพล',                     nameEn:'Kamphon',      role:'System Operation Officer',             email:'kamphon@raceup.co.th',       phone:'086-839-2665', phoneEmergency:'',             department:'Operations',         level:'Execute', status:'Active', aliases:['ย้ง-SOO','Kamphon'] },
];

/* ============================================================
   HELPERS
   ============================================================ */

window.getStaffByEmail = function(email) {
  if (!email) return null;
  const q = String(email).toLowerCase().trim();
  return window.RACEUP_STAFF.find(s =>
    s.email.toLowerCase() === q ||
    (s.aliases || []).some(a => String(a).toLowerCase() === q)
  ) || null;
};

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

window.getStaffByDepartment = function(dept) {
  if (!dept) return [];
  const q = String(dept).toLowerCase().trim();
  return window.RACEUP_STAFF.filter(s => s.department.toLowerCase() === q);
};

window.getStaffStats = function() {
  const active = window.RACEUP_STAFF.filter(s => s.status === 'Active');
  return {
    total:        window.RACEUP_STAFF.length,
    active:       active.length,
    withPhone:    active.filter(s => s.phone).length,
    withoutPhone: active.filter(s => !s.phone).length,
    withEmail:    active.filter(s => s.email).length,
    departments:  [...new Set(active.map(s => s.department))],
  };
};
