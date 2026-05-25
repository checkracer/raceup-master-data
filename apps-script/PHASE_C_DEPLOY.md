# Phase C Deploy — master Code.gs → Hub Link Sheet

## Executive Summary

Update master Apps Script Code.gs ให้:
- **Source switched:** Working Sheet (`13t_phz`) → **Hub Link Sheet (`1Um6I4VG`)**
- **Smart tab fallback:** Live_* (synced) → direct tabs → embedded fallback
- **Zero downtime:** ทำงานได้ไม่ว่า WorkingToHubLink sync จะ deploy แล้วหรือยัง
- **Backward compatible:** endpoints เดิมทำงานปกติ + เพิ่ม `?action=health`

**เวลา deploy:** ~10 นาที + 2-3 นาที test

---

## 🎯 What Changed

### Before (Phase A/B)
```javascript
const HUB_SHEET_ID = '13t_phzkL3...'; // Working Sheet
SpreadsheetApp.openById(HUB_SHEET_ID).getSheetByName('Project Assign');
```

### After (Phase C)
```javascript
const HUB_LINK_SHEET_ID = '1Um6I4VG9...'; // Hub Link Sheet (SoT)
const WORKING_SHEET_ID  = '13t_phzkL3...'; // Fallback
const TAB_FALLBACKS = {
  projects: ['Live_ProjectAssign', 'Project Assign', 'Project Assignment'],
  // ... etc
};
// Smart: tries Hub Link Live_* first, then direct tabs, then Working Sheet
openTabWithFallback_('projects') → { sheet, source: 'hub-link' | 'working' }
```

---

## STEP 1 — Pre-deploy verification (2 นาที)

### 1.1 ตรวจ Hub Link Sheet ได้รับ share

ผู้ใช้ Apps Script (Korn) ต้องมี **Editor** access ของ Hub Link Sheet:
```
https://docs.google.com/spreadsheets/d/1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q/edit
```

1. เปิด link ข้างบน
2. Share → ตรวจว่า `alongkorn@raceup.co.th` มี Editor (หรือ Anyone within Race Up Work — Editor)
3. ถ้าไม่มี → add

### 1.2 (Optional) ตรวจ tabs ใน Hub Link

ลอง list tabs ของ Hub Link Sheet — เพื่อรู้ว่า tab ไหนมีอยู่:
- ถ้ามี `Live_*` tabs (จาก WorkingToHubLink sync) → ใช้ตัวนั้น
- ถ้ายังไม่มี → Apps Script จะ fallback ไป Working Sheet โดยอัตโนมัติ

---

## STEP 2 — Deploy new Code.gs (5 นาที)

### 2.1 Backup เดิม
1. เปิด Apps Script project ของ master.raceup.co.th
2. ดู Code.gs ปัจจุบัน → กดปุ่ม `⋮` ข้างไฟล์ → **Make a copy** → ตั้งชื่อ `Code_phase_b_backup.gs`

### 2.2 Replace content
1. เปิด `Code.gs` ใน editor
2. **Select all** (Ctrl+A) → **Delete**
3. Copy ทั้งหมดจาก `E:\Claude Projects\Web Site Creation\raceup-master-data\apps-script\Code.gs` วาง
4. **Save** (Ctrl+S)

### 2.3 Test ใน editor ก่อน deploy
1. เลือก function `testHealth` จาก dropdown
2. กด **Run**
3. ดู Execution log — ควรเห็น:
   ```json
   {
     "ok": true,
     "version": "phase-c-1.0",
     "sources": {
       "hubLink": { "ok": true, "name": "Raceup_Hub_Link_Management", "tabs": [...] },
       "working": { "ok": true, "name": "2026 Raceup Working Sheet", "tabs": [...] }
     },
     "endpoints": {
       "events":   { "ok": true, "count": 22, "source": "hub-link:Master Event List" },
       "staff":    { "ok": true, "count": 22, "source": "hub-link:Employee Registry" },
       "projects": { "ok": true, "count": 37, "source": "working:Project Assign" },
       "sponsors": { "ok": true, "count": 108, "source": "working:Sponsor Update" }
     }
   }
   ```
4. ⚠️ ถ้า `hubLink.ok: false` → กลับไป Step 1.1 (share permissions)
5. ถ้า endpoint ใด `ok: false` → ดู error · อาจต้องแก้ TAB_FALLBACKS

### 2.4 Deploy version ใหม่
1. **Deploy** → **Manage deployments** → กดดินสอ (Edit)
2. **Version** dropdown → **New version**
3. Description: `Phase C — switch to Hub Link Sheet`
4. **Deploy**
5. ⚠️ Web App URL **ไม่เปลี่ยน** — `master.raceup.co.th/data/*` ทำงานต่อไป

---

## STEP 3 — Post-deploy verification (3 นาที)

### 3.1 Test endpoints ผ่าน curl

```bash
# (แทน <APP_URL> ด้วย Web App URL ของ master)
APP=https://script.google.com/macros/s/AKfycby6v4bQ.../exec

# Health
curl "$APP?action=health" | python3 -m json.tool | head -30

# Each endpoint
curl "$APP?action=events" | head -c 200
curl "$APP?action=staff" | head -c 200
curl "$APP?action=projects" | head -c 200
curl "$APP?action=sponsors&event=CSMH26" | python3 -m json.tool | head -30
```

### 3.2 Test CDN static files (ไม่ได้กระทบ)
```bash
# Static .js ใน CF Pages ยังทำงานปกติ
curl https://master.raceup.co.th/data/staff.js | head -c 200
curl https://master.raceup.co.th/data/events.js | head -c 200
```

> ⚠️ **Note:** static `.js` files (CDN) อ่านจาก GitHub repo · ไม่ได้ผ่าน Apps Script
> Phase C เปลี่ยนแค่ Apps Script endpoints — static files sync ผ่าน Phase B (WorkingToHubLink + commit + push)

---

## STEP 4 — Update apps to use new sources (optional, ทำได้ภายหลัง)

หลัง Phase C — apps สามารถใช้:

### Option A: Static `.js` (เร็วสุด — แนะนำ)
```html
<script src="https://master.raceup.co.th/data/staff.js"></script>
<script>
  const s = window.getStaffByEmail('alongkorn@raceup.co.th');
</script>
```

### Option B: Apps Script API (dynamic — เหมาะกับ admin tools)
```javascript
const resp = await fetch('https://master.raceup.co.th-apps-script/exec?action=staff');
const { staff } = await resp.json();
```

### Option C: ใช้ผ่าน master Apps Script proxy ใน master.raceup.co.th (ถ้าตั้ง redirect)

---

## 🛡 Rollback Plan

ถ้า Phase C มีปัญหา:

### Quick rollback (5 นาที)
1. Apps Script editor → เลือก `Code_phase_b_backup.gs` → **Make a copy** → rename เป็น `Code.gs`
2. ลบ Code.gs ใหม่
3. Save
4. **Deploy** → New version

### หรือ revert via Apps Script history
1. **Deploy → Manage deployments**
2. กดดินสอ → Version → เลือก **previous version**
3. **Deploy**

---

## 📊 What apps benefit

| App | Before | After Phase C |
|-----|--------|---------------|
| ops.raceup.co.th | fetch master CDN + Hub Apps Script | + ดึง staff/projects จาก master endpoints (option) |
| hub.raceup.co.th | fetch Working Sheet ตรง | จะใช้ master เป็น proxy ตอน Phase D |
| no.raceup.co.th | fetch master CDN | ไม่กระทบ — CDN ทำงานเหมือนเดิม |
| form.raceup.co.th | fetch Master Numbers Sheet | จะ migrate ตอน Phase D |

---

## 🎯 Phase C Success Criteria

- [ ] `?action=health` returns `ok: true` + 4 endpoints all `ok: true`
- [ ] `?action=events` returns 22 events (source: hub-link หรือ working)
- [ ] `?action=staff` returns 22 staff with phone
- [ ] `?action=projects` returns 37 projects
- [ ] `?action=sponsors&event=CSMH26` returns 7 Prudentia + Aquafina + ...
- [ ] static .js files (`/data/*.js`) ยังทำงานปกติ
- [ ] ไม่มี app เก่าที่ใช้ master ขัดข้อง

---

## ⚠️ Known Limitations

1. **Hub Link Sheet tabs ปัจจุบัน** — ผมไม่รู้แน่ชัดว่า Hub Link มี tab "Master Event List" + "Employee Registry" จริงหรือเปล่า (อิงตาม `raceup-context/references/hub_reference.md`)
   - ถ้าไม่ใช่ → Code.gs จะ fallback ไป Working Sheet `Quick Fact` + `Contact` โดยอัตโนมัติ — ไม่พัง
   - Run `?action=health` ดูที่ `source` ของแต่ละ endpoint จะรู้ว่ามาจาก hub-link หรือ working

2. **Sponsor Update tab format** — schema เก่าซับซ้อน (per-event section headers) · parser อาจ miss บางแถว
   - Run `?action=sponsors` ดูจำนวน count · ถ้าน้อยกว่า 80 → schema เปลี่ยน · ต้อง update parser

3. **Live_* tabs** — ยังไม่มีจน WorkingToHubLink sync deploy
   - แต่ TAB_FALLBACKS ทำงานทันทีเมื่อ Live_* ปรากฏ — ไม่ต้องแก้ Code.gs ใหม่
