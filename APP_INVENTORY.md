# App Inventory & Data Dependencies — Phase A

## Executive Summary

ค้น **22 projects · 8 unique Google Sheets · 40+ files** ที่อ่าน/เขียน sheet ตรงๆ

**Findings:**
- 🔴 **Hub Link Sheet (1Um6I4VG...)** ใช้แค่ใน **raceup-hub Code.gs + hub-saas** (เป็น SoT แต่ apps ส่วนใหญ่ไม่รู้จัก)
- 🟠 **Working Sheet (13t_phz...)** ใช้หนักมาก — 7 apps + hub.raceup.co.th + ops.raceup.co.th
- 🟡 **Master Numbers Sheet (157hY6e0...)** ใช้ใน number + master-data + raceup-web
- 🟡 **Post Event Sheet (1S660jE9...)** ใช้ใน form.raceup.co.th + form-ops + raceup-hub
- 🟢 **Records Sheets** (SSP/Scenic/Checkracer) แยกต่อ event → ไม่ critical สำหรับ master

**Action:** ต้องสร้าง **clear migration path** สำหรับ apps ที่ใช้ Working Sheet → Hub Link → master

---

## 📊 Sheet Catalog (8 sheets)

| Sheet ID | Name (guess) | Status ใน Architecture |
|----------|--------------|------------------------|
| `1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q` | **Raceup Hub Link Management** | 🎯 **Target SoT** — ส่วนใหญ่ app ยังไม่ใช้ |
| `13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI` | **2026 Raceup Working Sheet** | 🟠 Manual hub — most apps fetch here |
| `1S660jE9zT_gN4fqNqrtPDRVUkEbQqCJzkSfUkUsqE-E` | **Master Numbers (Post Event)** | 🟡 form sites |
| `157hY6e059YxC8m73h6aTufExRiupZgaSsd7lVl9kuQM` | **Number / Race Pack Master** | 🟡 number + master Code.gs (ผิดที่!) |
| `1xFdxW8Wt7OZnawDkU6AsmTCeK1dEP_bfw48qR6fbmWo` | **SSP10 Records / Korat Records** | 🟢 event-specific records |
| `1XcCY629PBeTrT28_g3IhIua2pXnH9896jy5jeUeVHAo` | **Event History** | 🟢 raceup-web legacy |
| `1x6iAav9rgP9zwKwtbJg3LGMgszc15V-D` | **Checkracer Events** | 🟢 platform-specific |
| `1fGgFEkCaWVp8yPAEhwrjlAHCqOEb8rs1W7iE30d3THM` | **Scenic Records** | 🟢 scenic site |

---

## 🗂 App-by-App Dependencies

### Group 1: Master-data Ecosystem (own this layer)

| App | Folder | Sheets Used | Fetch Method | Notes |
|-----|--------|-------------|--------------|-------|
| **raceup-master-data** | `raceup-hub/raceup-master-data` | `157hY6e0` (Master Numbers) | Apps Script openById | ⚠️ should point to `1Um6I4VG` instead |
| **hub-saas/tools/raceup-exporter** | `hub-saas/tools` | `1Um6I4VG` (Hub Link) | Apps Script openById | ✅ already on SoT |

### Group 2: ops.raceup.co.th ecosystem

| App | Folder | Sheets Used | Fetch Method | Migration Risk |
|-----|--------|-------------|--------------|----------------|
| **ops.raceup.co.th** | `ops.raceup.co.th` | `13t_phz` (via HubPatch_OpsContacts.gs) | Hub Apps Script | 🟢 Low — code ready |
| **ops Code.gs** | `ops.raceup.co.th/apps-script/Code.gs` | dynamic sheetId per event | openById | 🟢 Low — per-event sheets |

### Group 3: raceup-hub (intranet)

| App | Folder | Sheets Used | Fetch Method | Migration Risk |
|-----|--------|-------------|--------------|----------------|
| **raceup-hub Code.gs** | `raceup-hub/apps-script/Code.gs` | `1Um6I4VG` (Hub Link) | openById | ✅ on SoT (good!) |
| **post-event.html** | `raceup-hub/post-event.html` | `1S660jE9` (Master Numbers Post Event) | gviz CSV | 🟡 Medium |
| **sponsor-update.html** | `raceup-hub/sponsor-update.html` | `13t_phz` (Working — Sponsor Update tab) | gviz CSV | 🟡 Medium |
| **project-assign.html** | `raceup-hub/project-assign.html` | `13t_phz` (Working — Project Assign tab) | gviz CSV | 🟡 Medium |
| **project-assign-dashboard.html** | `raceup-hub/project-assign-dashboard.html` | `13t_phz` (Working — Project Assign tab) | gviz CSV | 🟡 Medium |
| **index.html** | `raceup-hub/index.html` | `1x6iAav9` (Checkracer) | gviz CSV | 🟢 Low — landing |
| **warehouse Apps Script** | `raceup-hub/apps-script/warehouse/*` | `1Um6I4VG` (Hub Link via PA_SHEET_ID, SPONSOR_SHEET_ID, STAFF_DIR_SHEET_ID) | openById | ✅ on SoT |
| **PostEvent_Code.gs** | `raceup-hub/apps-script/PostEvent_Code.gs` | `1S660jE9` + `1Um6I4VG` | openById | 🟡 dual-sheet |
| **SocialContent_Code.gs** | `raceup-hub/apps-script/SocialContent_Code.gs` | SHEET_ID variable | openById | unknown sheet |

### Group 4: Forms (post-event submission)

| App | Folder | Sheets Used | Fetch Method | Migration Risk |
|-----|--------|-------------|--------------|----------------|
| **form.raceup.co.th** | `form.raceup.co.th/index.html` | `1S660jE9` (Master Numbers Post Event) | hardcoded URL | 🟡 Medium |
| **form-ops.raceup.co.th** | `form-ops.raceup.co.th/index.html` | `1S660jE9` (Master Numbers Post Event) | hardcoded URL | 🟡 Medium |
| **form-ops/form-ops-raceup** | `form-ops.raceup.co.th/form-ops-raceup/index.html` | `1S660jE9` | hardcoded URL | duplicate |

### Group 5: Number / Race Pack (no.raceup.co.th)

| App | Folder | Sheets Used | Fetch Method | Migration Risk |
|-----|--------|-------------|--------------|----------------|
| **number** | `number/` | `157hY6e0` (race pack data) | Apps Script + master CDN | 🟢 Already partial |
| **number Apps Script** | `number/apps-script/Code.gs` | `157hY6e0` (SHEET_ID) + WAREHOUSE_SHEET_ID | openById | 🟢 owned |
| **raceup-web/number** (legacy?) | `raceup-web/number/` | `157hY6e0` (duplicate of `number/`) | same | ⚠️ duplicate — sunset? |

### Group 6: Checkracer (registration platform)

| App | Folder | Sheets Used | Fetch Method | Migration Risk |
|-----|--------|-------------|--------------|----------------|
| **checkracer** | `checkracer/` (OneDrive) | `1x6iAav9` (events) | gviz CSV | 🟢 Low — platform-specific |
| **checkracer Apps Script** | `checkracer/apps-script` | platform sheets | own scripts | 🟢 |

### Group 7: Event Sites (individual)

| App | Folder | Sheets Used | Fetch Method | Migration Risk |
|-----|--------|-------------|--------------|----------------|
| **korat-marathon-2026** | `korat-marathon-2026/` | `1xFdxW8W` (SSP10 Records) for loyal-fans/records | gviz CSV | 🟢 Low — records only |
| **supersports-10mile-2026** | `supersports-10mile-2026/` | `1xFdxW8W` (records) | gviz CSV | 🟢 Low |
| **scenicmarathon-website** | `scenicmarathon-website/` | `1fGgFEkCa` (Scenic records) + `1xFdxW8W` (members) | gviz CSV | 🟡 Medium — multi-sheet |
| **league.run** | `league.run/` | (no direct sheets found) | — | 🟢 |
| **thaiathon-website** | `thaiathon-website/` | (no direct sheets found) | — | 🟢 |

### Group 8: Marketing / Misc

| App | Folder | Sheets Used | Fetch Method | Migration Risk |
|-----|--------|-------------|--------------|----------------|
| **raceup-web** | `raceup-web/` | `1XcCY629` (Event History) + duplicate number | gviz CSV | 🟡 Possibly legacy |
| **raceup.co.th-deploy** | `raceup.co.th-deploy/` | TBD | — | 🟢 |
| **newsletters-2026** | `newsletters-2026/` | TBD | — | 🟢 |
| **scenicmarathon-blog** | `scenicmarathon-blog/` | TBD | — | 🟢 |
| **marathon-website-builder** | `marathon-website-builder/` | template — generic | — | 🟢 Tool |
| **checkmedal / checkmedal-website** | `checkmedal/` | TBD | — | 🟢 Platform |
| **raceup-hub-ot** | `raceup-hub-ot/` | (OT-specific Sheet) | — | 🟢 Stand-alone module |
| **raceup-hub-leave-update-2026-05** | `raceup-hub-leave-update-2026-05/` | (HR Leave Sheet) | — | 🟢 Stand-alone module |
| **raceup-hub-project-assignment** | `raceup-hub-project-assignment/` | `13t_phz` (Project Assign tab) | gviz CSV | 🟡 Medium |
| **wnd-vite** | `wnd-vite/` | TBD | — | 🟢 |
| **scenic-farm** | `scenic-farm/` | non-race | — | ⚪ N/A |

---

## ⚠️ Data Conflicts (same field in multiple sheets)

| Field | Sheets ที่มีข้อมูล | ความเสี่ยง drift | Recommended SoT |
|-------|---------------------|-------------------|-----------------|
| **22 Events list** | Hub Link "Master Event List" / Working Sheet "Quick Fact" / master-data events.js / number events.json | 🔴 HIGH — เห็นแล้วผิด 3 จุด | **Hub Link** |
| **Staff (22 คน)** | Hub Link "Employee Registry" / Working Sheet "Contact" | 🔴 HIGH — schema ต่าง · phone อยู่ใน Contact tab เท่านั้น | **Working Sheet → Hub Link** (sync) |
| **Project Assignment** | Working Sheet "Project Assign" / Working Sheet "Project Assign Backup" / raceup-hub project-assign.html / master project-assign.js | 🟡 Medium — 1 source แต่ 2 versions ใน sheet เดียวกัน | **Working Sheet "Project Assign"** |
| **Sponsors** | Working Sheet "Sponsor Update" / Working Sheet "Event Sponsor" / Sponsor Dashboard | 🟡 Medium — 2 tabs ใน Working Sheet ซ้ำกัน | **Working Sheet "Sponsor Update"** (newer) |
| **Supplier bookings** | Working Sheet "จอง Supplier" / event-supplier-database skill | 🟢 Low — แยกตามประเภท | **Working Sheet** |
| **Race Pack Number** | Master Numbers `157hY6e0` / Working Sheet | 🟢 Low — เฉพาะ number app | Keep separate (specialized) |
| **Post Event submissions** | Master Numbers `1S660jE9` | 🟢 Low — write-only from forms | Keep separate (form output) |
| **Race results / Records** | SSP10 `1xFdxW8W` / Scenic `1fGgFEkCa` / Checkracer `1x6iAav9` | 🟢 Low — แยกแต่ละ platform | Keep separate (platform output) |

---

## 🎯 Migration Priority Matrix

```
              LOW migration risk        HIGH migration risk
              ─────────────────────────────────────────────
HIGH value    │ no.raceup ✅            │ hub.raceup 🔴    │
              │ ops.raceup 🟡           │                  │
              │ raceup-hub Code.gs ✅   │                  │
              ─────────────────────────────────────────────
LOW  value    │ Event sites 🟢          │ Scattered legacy │
              │ Forms (3) 🟡            │ raceup-web ?     │
              │ Skills 🟢               │                  │
              ─────────────────────────────────────────────
```

**Recommended order (Phase D wave 1-4):**

**Wave 1 — Quick wins (1 week)**
1. ✅ Verify no.raceup.co.th still works on master CDN
2. 🟡 Deploy ops.raceup.co.th (code ready)
3. 🟢 Update master-data Code.gs → switch from Number Sheet `157hY6e0` → Hub Link `1Um6I4VG`

**Wave 2 — Forms consolidation (1 week)**
4. 🟡 Refactor `form.raceup.co.th` + `form-ops.raceup.co.th` + duplicate → single shared codebase reading from master event list
5. ⚠️ Decide fate of duplicate `raceup-web/number/`

**Wave 3 — raceup-hub apps (2 weeks)**
6. 🟡 sponsor-update.html → fetch master `/data/sponsors.js`
7. 🟡 project-assign.html + dashboard → fetch master `/data/project-assign.js`
8. 🟡 post-event.html → consolidate Post Event Sheet (`1S660jE9`) data into master `/data/post-events.js`

**Wave 4 — Event sites (1 week)**
9. 🟢 korat-marathon-2026 records → still use SSP10 sheet (platform-specific) — just inject events from master
10. 🟢 scenicmarathon-website → same approach
11. 🟢 supersports-10mile-2026 → same

---

## 📋 Phase A Deliverables (เสร็จแล้ว)

- ✅ `APP_INVENTORY.md` — รายชื่อ apps + sheet dependencies (ไฟล์นี้)
- ✅ Sheet Catalog (8 sheets identified)
- ✅ Data Conflicts table
- ✅ Migration Priority Matrix
- ✅ Recommended order (Wave 1-4)

## 🚀 Phase B Ready to Start

หลังจาก review ไฟล์นี้ พร้อมเริ่ม:
- **B1:** เขียน `syncToHubLink()` ใน Working Sheet Apps Script (ส่ง Project Assign + Sponsor + Contact → Hub Link tab corresponding)
- **B2:** สร้าง Hub Link Sheet tabs ใหม่ที่รับ data จาก Working Sheet
- **B3:** Test bi-weekly เพื่อยืนยันไม่มี data loss
- **B4:** อัพเดท master Code.gs → ชี้ Hub Link หลัง sync ตั้งเสถียร

---

## ✅ Decisions Made (2026-05-24)

### Decision 1: `number/` folder location
**Decision:** ย้ายทั้งหมดไปอยู่ใต้ `raceup-hub/number/`
- ✅ Primary `number/` (top-level, 75 files including .git) → **Copied to `raceup-hub/number/`** (2026-05-24 23:45)
- 🗑 Legacy `raceup-web/number/` (23 files) → **TODO: user manually delete** หลัง verify raceup-hub/number/ ทำงาน
- 🗑 Original `number/` top-level → **TODO: user manually delete** หลัง verify (ห้ามลบโดยไม่ confirm)

### Decision 2: Master Numbers Sheet (`1S660jE9`) — Post Event Form output
**Decision:** Sync ทางเดียวไป master · keep sheet ไว้เป็น input
- Form sites (`form.raceup.co.th`, `form-ops.raceup.co.th`) → ยังเขียน Sheet เดิม (ไม่เปลี่ยน)
- Master Apps Script → เพิ่ม endpoint `?action=postEvents` ดึงจาก Sheet แสดงผลให้ apps อ่าน
- master file ใหม่: `data/post-events.js` (sync จาก Sheet)

### Decision 3: Records sheets (SSP10/Scenic/Checkracer)
**Decision:** Unify เข้า master เป็น `records-<event>.js`
- master จะเพิ่ม:
  - `data/records-ssp25.js` (จาก `1xFdxW8W`)
  - `data/records-scenic25.js` (จาก `1fGgFEkCa`)
  - `data/records-csmh26.js` (placeholder จนกว่าจะมี data)
  - ฯลฯ — per event ที่มี records
- Apps (korat-marathon, scenicmarathon, supersports10mile) → fetch จาก master แทน Sheet ตรง

### Decision 4: SocialContent_Code.gs SHEET_ID
**Decision:** TODO — ต้องไปดู actual deployed Apps Script ว่าใช้ sheet ตัวไหน (Hub Link `1Um6I4VG` เป็น default guess)

### Decision 5: Hub Link Sheet structure
**Decision:** TODO Phase B1 — สร้าง tabs ใหม่:
- `Project Assign Live` (รับจาก Working Sheet `Project Assign`)
- `Sponsor Update Live` (รับจาก Working Sheet `Sponsor Update`)
- `Contact Live` (รับจาก Working Sheet `Contact`)
- `Post Events Live` (รับจาก Master Numbers Post Event `1S660jE9`)
- `Records Live` (รับจาก SSP10 / Scenic / Checkracer records)

---

## 🚀 Updated Phase B Plan (post-decisions)

| Step | งาน | Time |
|------|-----|------|
| **B0** | User delete: `raceup-web/number/` + top-level `number/` (หลัง verify `raceup-hub/number/` ทำงาน) | manual |
| **B1** | Sync Working Sheet → Hub Link Live tabs (3 tabs: Project Assign, Sponsor, Contact) | 1 วัน |
| **B2** | Sync Master Numbers Post Event → Hub Link tab "Post Events Live" | 0.5 วัน |
| **B3** | Sync Records sheets (3) → Hub Link tab "Records Live" + per-event split | 0.5 วัน |
| **B4** | Test ทั้ง 5 sync flows · ดู audit log · monitor drift | 0.5 วัน |

หลัง Phase B complete → Phase C (master Code.gs ใช้ Hub Link ตัวเดียว)
