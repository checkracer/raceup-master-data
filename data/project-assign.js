/**
 * Race Up Work — Project Assignment Master 2026
 * ============================================================
 * ที่มา:  2026 Raceup Working Sheet (13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI)
 *         Tab: "Project Assign"
 *
 * โครงสร้าง (mirror ของ Sheet schema):
 *   project:    Event code (KYM26, CSMH26, ...)
 *   point:      จำนวน "Point" (ใช้คำนวณ workload)
 *   eventDate:  วันงาน YYYY-MM-DD
 *   lead:       Race Director (nickname)
 *   co1:        Co-RD / Event Director (nickname)
 *   co2:        Co-Race Director (nickname)
 *   route:      On Course / Route Lead (nickname)
 *   ae:         Account Executive (nickname)
 *   pr:         PR Lead (nickname)
 *   graphic:    Graphic Designer (nickname)
 *   teamEvent:  Off-Course team (comma-separated nicknames)
 *   teamRace:   On-Course team (comma-separated nicknames)
 *
 * Mapping → Ops Contact Role:
 *   lead    → Race Director (urgent)
 *   co1     → Co-RD / Event Director (urgent)
 *   co2     → Co-Race Director (primary)
 *   route   → On Course / Route Lead (primary)
 *   ae      → Account Executive (secondary)
 *   pr      → PR Lead (secondary)
 *   graphic → Graphic Designer (secondary)
 *
 * ⚠️  ไฟล์นี้เป็น snapshot — ตอนนี้ส่วนใหญ่ยังว่าง
 *     ต้องเติมใน Hub Sheet (Project Assign tab) แล้ว sync
 */

window.RACEUP_PROJECT_ASSIGN = [
  // Pre-fill structure — user เติม nickname จริงตามที่ assign จริง
  { project:'KYM26',   point:8, eventDate:'2026-01-11', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'PO26',    point:6, eventDate:'2026-01-17', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'AMN26',   point:4, eventDate:'2026-02-08', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'PSMH26',  point:5, eventDate:'2026-02-15', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'SSP26',   point:8, eventDate:'2026-05-17', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'PBR26',   point:3, eventDate:'2026-05-24', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'CSMH26',  point:6, eventDate:'2026-06-07', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'KTJ26',   point:8, eventDate:'2026-06-21', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'LR26',    point:3, eventDate:'2026-06-28', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'RSMH26',  point:5, eventDate:'2026-08-02', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'CTP-BKK', point:2, eventDate:'2026-08-23', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'CTP-KR',  point:2, eventDate:'2026-09-06', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'KSMH26',  point:5, eventDate:'2026-09-13', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'CTP-KAN', point:2, eventDate:'2026-09-20', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'KCT26',   point:6, eventDate:'2026-09-27', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'CTP-KK',  point:2, eventDate:'2026-10-04', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'CMSH26',  point:5, eventDate:'2026-11-01', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'KRM26',   point:10,eventDate:'2026-11-08', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'WR26',    point:5, eventDate:'2026-11-22', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'GR26',    point:6, eventDate:'2026-12-06', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'NSMH26',  point:5, eventDate:'2026-12-13', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
  { project:'GAT26',   point:5, eventDate:'2026-12-27', lead:'', co1:'', co2:'', route:'', ae:'', pr:'', graphic:'', teamEvent:'', teamRace:'' },
];

/* ============================================================
   HELPERS
   ============================================================ */

/** หา project assign สำหรับ event code (case-insensitive) */
window.getProjectByEvent = function(code) {
  if (!code) return null;
  const q = String(code).toUpperCase().trim();
  return window.RACEUP_PROJECT_ASSIGN.find(p => p.project.toUpperCase() === q) || null;
};

/** หา projects ที่ staff คนนึงเป็น lead (ใช้คำนวณ workload) */
window.getProjectsByLead = function(nickname) {
  if (!nickname) return [];
  const q = String(nickname).toLowerCase().trim();
  return window.RACEUP_PROJECT_ASSIGN.filter(p => p.lead.toLowerCase() === q);
};

/** สถิติรวม */
window.getProjectAssignStats = function() {
  const arr = window.RACEUP_PROJECT_ASSIGN;
  return {
    total:           arr.length,
    assignedLead:    arr.filter(p => p.lead).length,
    assignedCO1:     arr.filter(p => p.co1).length,
    assignedRoute:   arr.filter(p => p.route).length,
    fullyAssigned:   arr.filter(p => p.lead && p.co1 && p.route && p.ae).length,
    totalPoints:     arr.reduce((s, p) => s + (p.point || 0), 0),
  };
};
