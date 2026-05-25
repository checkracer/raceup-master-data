# Race Up Data Architecture Migration Plan

## Executive Summary

**ปัจจุบัน:** ข้อมูลกระจายอยู่ใน **3 Google Sheets** ที่ apps ต่าง ๆ ดึงตรง ๆ — ทำให้เกิด conflict, duplicate, และ data drift

**เป้าหมาย:** **Hub Link Sheet = Single Source of Truth (SoT)** · **raceup-master-data = Distribution Layer (CDN)** · **All apps → fetch จาก master**

**ลำดับการทำ:** 5 phases · ใช้เวลา **4-8 สัปดาห์** · ทำเป็น app-by-app ไม่ต้อง big-bang

---

## ภาพปัจจุบัน (Current State)

```
┌─ Hub Link Sheet (1Um6I4VG...)        ── 8 sections (events, employees, project links, historical data, ...)
├─ Working Sheet (13t_phz...)          ── 14 tabs (manual updates: project assign, sponsors, supplier booking, followups)
└─ Master Numbers Sheet (157hY6e0...)  ── racepack data (number)

ที่ apps ดึงใช้:
  ops.raceup.co.th    → Working Sheet (Project Assign, Contact) + Hub Apps Script
  hub.raceup.co.th    → Working Sheet (ทุก tab) ผ่าน own Apps Script
  no.raceup.co.th     → raceup-master-data CDN  ✅ already migrated
  form.raceup.co.th   → Master Numbers Sheet (1S660...)
  raceup-event-sites  → Per-event sheets (KRM Records, KSMH Gallery, ...)
  Skills (sponsor, supplier, cashflow, ranking) → ผสมหลาย sheets

ปัญหาที่เห็น:
  ❌ Sponsor data ซ้ำ — Working Sheet "Sponsor Update" tab vs "Event Sponsor" tab
  ❌ Project Assign vs Project Assign Backup (มี 2 version ใน Working Sheet)
  ❌ Employee data ใน Hub Link "Employee Registry" vs Working Sheet "Contact"
  ❌ Event list ผิดพลาด — ops events.js เคยมี 8 งานผิด 3 จุดก่อน sync
```

---

## เป้าหมาย Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Team Members (manual editing)                                  │
│                                                                 │
│  ✏️ Edit Working Sheet → tab Project Assign / Sponsor Update    │
│       (sheet ที่ใช้ง่ายสำหรับทีม manual update รายสัปดาห์)        │
└────────────────┬────────────────────────────────────────────────┘
                 │  Apps Script onEdit trigger (Phase B)
                 │  Push delta → Hub Link Sheet (writeable copy)
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  Hub Link Sheet (1Um6I4VG...)   = SINGLE SOURCE OF TRUTH        │
│                                                                 │
│  • Master Event List                                            │
│  • Employee Registry                                            │
│  • Project Links (deliverables)                                 │
│  • Project Assignment (synced from Working Sheet)               │
│  • Sponsors (synced from Working Sheet)                         │
│  • Suppliers (synced from supplier database sheet)              │
│  • Historical Event Data (SUMMARY EVENT)                        │
└────────────────┬────────────────────────────────────────────────┘
                 │  master Apps Script (Web App)
                 │  Refresh every fetch (or cache 5min)
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  raceup-master-data    = DISTRIBUTION LAYER                     │
│  master.raceup.co.th   (Cloudflare Pages CDN)                   │
│                                                                 │
│  Static .js files:                                              │
│    /data/events.js          window.RACEUP_EVENTS                │
│    /data/staff.js           window.RACEUP_STAFF                 │
│    /data/project-assign.js  window.RACEUP_PROJECT_ASSIGN        │
│    /data/sponsors.js        window.RACEUP_SPONSORS              │
│    /data/suppliers.js       window.RACEUP_SUPPLIERS             │
│    /data/categories.js      Race Pack categories                │
│                                                                 │
│  Apps Script endpoints (dynamic):                               │
│    ?action=events / staff / projects / sponsors / suppliers     │
│    ?action=event&code=XX                                        │
│    ?action=project&code=XX                                      │
└────────────────┬────────────────────────────────────────────────┘
                 │  fetch via <script src> หรือ fetch API
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  All Apps                                                       │
│                                                                 │
│  ops.raceup.co.th · hub.raceup.co.th · no.raceup.co.th         │
│  form.raceup.co.th · checkrace · league.run · marketing        │
│  scenic event sites · KRM/KSMH/KCT websites                    │
│  Skills (sponsor-update, supplier-database, cashflow, ranking) │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5-Phase Migration Plan

### 📍 Phase A — Inventory & Audit (3-5 วัน) — **เริ่มที่นี่ก่อน**

**เป้าหมาย:** รู้ทุก data flow ที่มีในระบบ ก่อนจะแก้

**Tasks:**
1. สร้าง **APP_INVENTORY.md** — list ทุก app + อ่าน/เขียน sheet ไหน + tab ไหน
2. Identify **conflicts** — data field ไหนอยู่หลายที่
3. Identify **owners** — ใครรับผิดชอบ update แต่ละ data type
4. รวบรวม **all Apps Script URLs** ที่ active

**Output:** APP_INVENTORY.md + DATA_CONFLICTS.md

**ความเสี่ยง:** ⚪ Low — แค่ document ไม่แตะ code

---

### 🌉 Phase B — Bridge: Working Sheet → Hub Link Sheet (1-2 สัปดาห์)

**เป้าหมาย:** Hub Link Sheet กลายเป็น authoritative อัตโนมัติ

**Tasks:**
1. ใน Working Sheet → Apps Script Editor
2. เขียน `syncToHubLink()` — read Working Sheet tab → write Hub Link Sheet corresponding tab
3. เพิ่ม onEdit trigger เฉพาะ tab ที่ critical (Project Assign, Sponsor Update, Contact)
4. Hub Link Sheet สร้าง tabs ใหม่ที่ตรงกับ Working Sheet structure (ถ้ายังไม่มี)
5. Test: edit Working Sheet → ตรวจว่า Hub Link Sheet update ใน 60 วินาที
6. Add changelog tab "Sync Log" — เก็บ audit trail ทุก sync

**Output:** Working Sheet ส่ง data ไป Hub Link Sheet อัตโนมัติ · team ไม่ต้องเปลี่ยน behavior

**ความเสี่ยง:** 🟡 Medium — ต้องระวัง infinite loop (Hub Link → Working Sheet → Hub Link)
- **กัน:** Sync ทาง **Working → Hub Link เท่านั้น** (one-way)
- ห้ามแก้ Hub Link Sheet manually หลัง sync เริ่มทำงาน

---

### 📡 Phase C — master-data reads ONLY Hub Link (1 สัปดาห์)

**เป้าหมาย:** master-data Apps Script ใช้ Hub Link Sheet เป็น source เดียว

**Tasks:**
1. Update master `Code.gs` → `HUB_LINK_SHEET_ID = '1Um6I4VG...'`
2. Refactor `getEvents`, `getStaff`, `getProjects`, `getSponsors` ให้ open Hub Link Sheet
3. Test endpoints ผ่าน curl ทุกตัว — match expected schema
4. Deploy new version (URL เดิม)
5. Update master `.js` static files ให้ rebuild ทุกวันจาก API (Phase E sync)

**Output:** master.raceup.co.th endpoints ทำงานเหมือนเดิม แต่ data source อยู่ที่ Hub Link

**ความเสี่ยง:** ⚪ Low — backward compatible · ถ้า fail → revert Code.gs version

---

### 🚀 Phase D — Migrate Apps to master (2-4 สัปดาห์)

**เป้าหมาย:** ทุก app fetch จาก master.raceup.co.th แทน raw sheets

**App migration order (low risk → high risk):**

| Priority | App | สถานะ | Risk | Action |
|----------|-----|-------|------|--------|
| 1 | **no.raceup.co.th** | ✅ Already migrated | - | Verify ทำงานปกติ |
| 2 | **ops.raceup.co.th** | 🟡 Code ready, ยังไม่ deploy | Low | Push commit · CF Pages deploy |
| 3 | **Skills** (sponsor-update, supplier-database) | ⏳ Need refactor | Low | Update SKILL.md → fetch master CSV URLs |
| 4 | **Event sites** (KRM/KSMH/KCT websites) | ⏳ Hardcoded events | Medium | `<script src="https://master.raceup.co.th/data/events.js">` |
| 5 | **form.raceup.co.th** | ⏳ Uses Master Numbers Sheet | Medium | Replace MASTER_NUMBERS_URL → master API |
| 6 | **hub.raceup.co.th** | 🔴 Heavy Apps Script | High | Refactor Apps Script · ค่อยทำตัวสุดท้าย |

**App migration template (per app):**
1. เพิ่ม `<script src="https://master.raceup.co.th/data/events.js"></script>` ใน HTML
2. ลบ hardcoded events array
3. Test locally: `npx serve .` → ตรวจว่าโหลด `window.RACEUP_EVENTS`
4. Add fallback: ถ้า master ตาย → ใช้ local copy
5. Push commit · auto-deploy

**ความเสี่ยง:** 🟡 Medium per app · 🔴 High สำหรับ hub.raceup.co.th
- ระมัดระวัง: เปลี่ยน app ทีละตัว ห้าม batch
- ทุก app เก็บ **local fallback** สำหรับ offline scenarios

---

### 🌅 Phase E — Sunset Old Sources (ongoing)

**เป้าหมาย:** Working Sheet กลายเป็น **input UI เท่านั้น** · Master Numbers Sheet เลิกใช้

**Tasks:**
1. ใน Working Sheet → เพิ่ม banner "⚠️ Edit ที่นี่ — ข้อมูลจะ sync ไป Hub Link ภายใน 60s — apps ทั้งหมดอ่านจาก master.raceup.co.th"
2. Migrate `Master Numbers Sheet (1S660...)` data → Hub Link Sheet หรือ master
3. Update form.raceup.co.th + ลบ MASTER_NUMBERS_URL hardcode
4. Document final architecture ใน raceup-context skill
5. Setup monitoring: alert ถ้า apps ยัง fetch จาก deprecated sheets

**ความเสี่ยง:** ⚪ Low · เป็น cleanup งาน

---

## 📋 คำแนะนำเร่งด่วน (Quick Wins ที่ทำได้ตอนนี้)

ทำได้ภายในวันนี้-สัปดาห์นี้ — ไม่ต้องรอ Phase ใหญ่:

### ✅ ทำเสร็จแล้ว (master-data ปัจจุบัน)
- `events.js` — 22 events พร้อม CSMH26 update ล่าสุด
- `staff.js` — 22 staff + เบอร์โทรจริงจาก Working Sheet Contact tab ✅
- `project-assign.js` — 37 rows จริงจาก Working Sheet ✅
- `sponsors.js` — 80+ sponsor entries จริง 13 events ✅
- `suppliers.js` — placeholder 10 categories
- Apps Script Code.gs — มี endpoints: events, staff, projects, sponsors, suppliers
- SYNC_DESIGN.md — hybrid sync mechanism

### 🔴 ทำต่อ — ลำดับ priority

| # | งาน | เวลา | คนทำ |
|---|---|---|---|
| 1 | Commit + push master-data ทั้งหมดที่อัพเดทไป GitHub | 5 นาที | Korn |
| 2 | Deploy master Code.gs ใหม่ (มี new endpoints) | 10 นาที | Korn |
| 3 | Test curl ทุก endpoint จริง | 10 นาที | Korn |
| 4 | Update master Code.gs → ชี้ Hub Link Sheet ID `1Um6I4VG...` | 5 นาที | Korn |
| 5 | Share Hub Link Sheet ให้ Apps Script service account อ่านได้ | 2 นาที | Korn |
| 6 | สร้าง APP_INVENTORY.md (Phase A) | 1-2 ชม | Korn |
| 7 | Build Working → Hub Link sync (Phase B) | 1 วัน | Korn |
| 8 | Migrate apps 1-3 (Phase D priority 1-3) | 1 สัปดาห์ | Korn |
| 9 | Migrate apps 4-6 | 2-3 สัปดาห์ | Korn |

---

## ⚠️ ข้อควรระวัง

1. **อย่า big-bang** — เปลี่ยนทุก app พร้อมกัน = recipe for disaster
2. **ทุก app ต้องมี fallback** — local copy ของ events.js ใน case master ตาย
3. **Working Sheet → Hub Link เป็น one-way** — ห้ามแก้ Hub Link ตรงๆ
4. **Schema versioning** — ใส่ `version` field ใน master files (`window.RACEUP_EVENTS_VERSION = '2026.05.24'`)
5. **GitHub PAT security** — สำหรับ auto-sync ต้องเก็บใน PropertiesService อย่าง secure
6. **API rate limits** — Apps Script Web App = 20k requests/day quota · ถ้า ops + hub + 22 event sites บวกกัน อาจชน → ใช้ CDN cache เป็นหลัก
7. **Cloudflare cache TTL** — `_headers` ตั้ง 5min (300s) สำหรับ /data/*.js — เพียงพอสำหรับ daily updates

---

## 🎯 Success Criteria

หลัง migration ครบทุก phase:

- [ ] ข้อมูล 1 ชิ้น แก้ที่เดียว (Working Sheet) → กระจายทุก app อัตโนมัติภายใน 5-10 นาที
- [ ] ทุก app เข้าถึง master data ผ่าน CDN ภายใน 200ms (cache hit)
- [ ] Hub Link Sheet มี data ตรงกับ Working Sheet (no drift)
- [ ] ไม่มี app ใดยัง fetch จาก Working Sheet โดยตรง
- [ ] CSMH26 / KRM26 / NSMH26 etc. — ชื่อจังหวัด/event ตรงทุก app
- [ ] Staff phone numbers ใช้งานได้ใน ops Contact Center
- [ ] Project Assignment ใน ops ดึงจริงจาก master ไม่ใช่ hardcode

---

## 📚 References

- `SYNC_DESIGN.md` — Push (Apps Script→GitHub API) vs Pull (GitHub Action cron) details
- `README.md` — Master data structure overview
- `apps-script/Code.gs` — Master API implementation
- Working Sheet: https://docs.google.com/spreadsheets/d/13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI
- Hub Link Sheet: https://docs.google.com/spreadsheets/d/1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q
