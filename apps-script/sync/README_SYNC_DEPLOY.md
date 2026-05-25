# Phase B Sync — Deployment Guide

## Executive Summary

Deploy 3 Apps Scripts ที่ทำงานเป็น **one-way sync pipeline**: Working Sheet + Post Event Sheet + Records Sheets → Hub Link Sheet (Single Source of Truth)

**เวลา deploy:** ~30 นาที (10 นาที/script)
**Prerequisites:** Edit access ทุก sheet ที่เกี่ยวข้อง + Apps Script execute permission

---

## 📋 Sheets ที่เกี่ยวข้อง

| Sheet | ID | Role |
|-------|-----|------|
| **Working Sheet** | `13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI` | Source — ทีม manual edit |
| **Post Event Sheet** | `1S660jE9zT_gN4fqNqrtPDRVUkEbQqCJzkSfUkUsqE-E` | Source — form submissions |
| **Records (SSP10)** | `1xFdxW8WtbOZnawDkU6AsmTCeK1dEP_bfw48qR6fbmWo` | Source — race results |
| **Records (Scenic)** | `1fGgFEkCaWVp8yPAEhwrjlAHCqOEb8rs1W7iE30d3THM` | Source — scenic results |
| **Records (Checkracer)** | `1x6iAav9rgP9zwKwtbJg3LGMgszc15V-D` | Source — checkracer events |
| **Hub Link Sheet** | `1Um6I4VG9dokB5UlSb1ncLWdomeTd79WamewJ9OjPd8Q` | **Destination = SoT** |

---

## STEP 1 — Prepare Hub Link Sheet permissions (5 นาที)

1. เปิด Hub Link Sheet (`1Um6I4VG...`)
2. กด **Share** ที่มุมขวาบน
3. เพิ่ม account `alongkorn@raceup.co.th` (หรือ account ที่จะ deploy Apps Script) เป็น **Editor**
4. Save · ปิด dialog

> ⚠️ ถ้าจะ deploy ผ่าน service account แยก — share ให้ service account email ด้วย

---

## STEP 2 — Deploy WorkingToHubLink.gs (10 นาที)

### 2.1 Open Apps Script project
1. เปิด **Working Sheet** (`13t_phz...`)
2. Top menu → **Extensions** → **Apps Script**
3. ถ้ามี project อยู่แล้ว → ใช้ project นั้น  ถ้ายังไม่มี → จะสร้างใหม่อัตโนมัติ
4. เปลี่ยนชื่อ project เป็น `RaceUp Working→HubLink Sync`

### 2.2 Paste code
1. ลบไฟล์ default `Code.gs` (หรือเก็บไว้ถ้ามี code อื่น)
2. กดปุ่ม `+` ข้าง Files → **Script** → ตั้งชื่อ `WorkingToHubLink`
3. Copy ทั้งหมดของ `apps-script/sync/WorkingToHubLink.gs` วาง
4. กด **Save** (Ctrl+S)

### 2.3 Authorize
1. กดปุ่ม **Run** ครั้งแรก เลือก function `verifyAccess`
2. Pop-up จะขออนุญาต — กด **Review permissions**
3. เลือก account `alongkorn@raceup.co.th`
4. **Advanced** → **Go to RaceUp Working→HubLink Sync (unsafe)**
5. กด **Allow**
6. ดู Execution log — ต้องเห็น:
   ```
   ✅ Source: 2026 Raceup Working Sheet
   ✅ Dest:   Raceup_Hub_Link_Management (...)
   ```

### 2.4 First manual sync (test)
1. Run function `syncAllToHubLink`
2. รอประมาณ 30 วินาที (sync 7 tabs)
3. เปิด Hub Link Sheet — ต้องเห็น tabs ใหม่: `Live_QuickFact`, `Live_ProjectAssign`, `Live_Contact`, etc.
4. เปิด tab `Sync Log` — ดู rows OK ทั้งหมด

### 2.5 Setup triggers
1. Run function `setupTriggers`
2. ตรวจ Triggers panel (icon นาฬิกาด้านซ้าย) — ต้องเห็น:
   - `onWorkingSheetEdit` (on edit, source spreadsheet)
   - `dailyFullSync` (time-driven, 06:00)

### 2.6 Verify auto-sync
1. กลับไป Working Sheet
2. แก้ cell ใน tab `Project Assign` (เช่นเพิ่ม project ใหม่)
3. รอ 5-10 วินาที
4. ดู Hub Link Sheet → tab `Live_ProjectAssign` ต้องอัพเดทตาม
5. ดู `Sync Log` — ต้องเห็น row ใหม่ status `OK-onEdit`

---

## STEP 3 — Deploy PostEventToHubLink.gs (5 นาที)

### 3.1 Open Apps Script
1. เปิด **Post Event Sheet** (`1S660jE9...`)
2. Extensions → Apps Script
3. ตั้งชื่อ project `RaceUp PostEvent→HubLink Sync`

### 3.2 Paste + Save
1. สร้างไฟล์ `PostEventToHubLink`
2. Copy จาก `apps-script/sync/PostEventToHubLink.gs` วาง
3. **สำคัญ:** แก้ `POST_EVENT_SYNC_MAP` ให้ตรงกับ tab names จริงใน Sheet (ดู Apps Script editor → run `verifyPostEventAccess` ก่อน เพื่อเห็น tabs ทั้งหมด)
4. Save

### 3.3 Authorize + Test
1. Run `verifyPostEventAccess` (authorize ครั้งแรก)
2. Run `syncPostEventToHubLink` (manual test)
3. ดู Hub Link → tab `Live_PostEvent_Submissions`

### 3.4 Setup trigger
1. Run `setupPostEventTriggers`
2. ตรวจ: daily 06:30 ICT trigger ติดตั้งสำเร็จ

---

## STEP 4 — Deploy RecordsToHubLink.gs (10 นาที)

### 4.1 สำคัญ — Verify Sheet IDs ก่อน
Records sheet IDs ในไฟล์อาจไม่สมบูรณ์ — ตรวจก่อน:

```bash
# จาก URL ของ Records sheet — copy ID ส่วนที่อยู่ระหว่าง /d/ และ /edit
# เช่น https://docs.google.com/spreadsheets/d/1xFdxW8Wt7OZnawDkU6AsmTCeK1dEP_bfw48qR6fbmWo/edit
#                                           ────────────────────────────────────────────────
```

แก้ `RECORDS_SOURCES` ใน `RecordsToHubLink.gs` ให้ตรงกับ ID จริง

### 4.2 Apps Script project (standalone)
1. ไปที่ https://script.google.com/home
2. **New project** → ตั้งชื่อ `RaceUp Records→HubLink Sync`
3. ลบ Code.gs default
4. สร้างไฟล์ `RecordsToHubLink` → paste

### 4.3 Authorize + Test
1. Run `verifyRecordsAccess` — ต้องเห็น ✅ ทั้ง 3 sources + dest
2. ถ้า ❌ source ไหน → ไป share Sheet นั้นให้ Apps Script account
3. Run `syncRecordsToHubLink` (manual test — อาจใช้เวลา 1-2 นาที ถ้า tabs เยอะ)

### 4.4 Setup trigger
1. Run `setupRecordsTriggers`
2. Weekly Monday 07:00 ICT installed

---

## 🧪 STEP 5 — End-to-end test (5 นาที)

หลัง deploy ทั้ง 3 scripts:

### Test 1: Working Sheet → Hub Link (onEdit)
1. แก้ใน Working Sheet → tab `Contact` (เปลี่ยนเบอร์ของใครคนหนึ่ง)
2. รอ 5-10 วินาที
3. ดู Hub Link → tab `Live_Contact` → ต้องเปลี่ยนตาม
4. ดู `Sync Log` → row ใหม่ `OK-onEdit`

### Test 2: All-tabs daily sync
1. ใน Working Sheet Apps Script → run `syncAllToHubLink` manual
2. ทุก 7 tabs ต้อง sync สำเร็จ
3. Hub Link ต้องมี Live_ tabs ครบ 7 อัน

### Test 3: Audit log
1. เปิด Hub Link → tab `Sync Log`
2. ต้องเห็น entries เรียงตามเวลา
3. column Status = OK / OK-onEdit / OK-manual
4. ไม่มี ERROR (ถ้ามี — check column Details)

---

## 🛠 Troubleshooting

### ❌ "We're sorry, you don't have access to this spreadsheet"
→ Hub Link Sheet ไม่ได้ share ให้ Apps Script account
→ กลับไป Step 1 + share Hub Link ให้ account ที่ deploy Apps Script

### ❌ "Exception: You can only call openById from inside Google Apps Script"
→ คุณกำลังรัน Apps Script จาก context ผิด (เช่น standalone editor ของอีก account)
→ ใช้ account เดิมที่มีสิทธิ์ทั้ง 2 Sheets

### ❌ Sync ทำงานครั้งแรกแต่ไม่ทำงานถัดไป
→ ตรวจ Triggers panel — มี trigger จริงไหม
→ ตรวจ Execution log — มี error?
→ ตรวจ quota — Apps Script จำกัด 6 min/execution + 90 min/day

### ❌ onEdit trigger ไม่ทำงาน
→ onEdit installable trigger ต้องสร้างผ่าน `setupTriggers()` ไม่ใช่ simple trigger
→ ถ้า simple `function onEdit(e)` จะไม่มี permission เปิด external sheet
→ ใช้ `function onWorkingSheetEdit(e)` + installable trigger เท่านั้น (script นี้ทำให้)

### ❌ Email alert ไม่ส่ง
→ ตรวจ MailApp quota (100/day for consumer, 1500/day for Workspace)
→ ตรวจ ALERT_EMAIL ใน Code.gs ถูกต้องไหม

### ⚠️ Live_ tabs ใน Hub Link โดน user แก้ manually
→ ไม่ส่งผล — sync ครั้งถัดไปจะ overwrite
→ Note ใน cell A1 บอก "DO NOT EDIT MANUALLY"
→ Phase 2: เพิ่ม sheet protection ใน syncOneTab_() (script มีอยู่แต่อาจ fail ถ้า no perms)

---

## 📊 Monitoring (ทำสัปดาห์ละครั้ง)

1. เปิด Hub Link → tab `Sync Log`
2. Filter status = `ERROR*`
3. ถ้ามี — ดู Details column → fix
4. ดูล่าสุด 7 วัน — ควรเห็น sync เป็นปกติทุกวัน 06:00 + 06:30 + onEdit triggers
5. ถ้า log ไม่ขึ้น 24 ชม. → check Apps Script execution log

---

## 🎯 หลัง Phase B เสร็จ ทำอะไรต่อ

| Phase | งาน |
|---|---|
| **C** | Update master Code.gs → read Hub Link Live_ tabs (เปลี่ยน source ID + tab names) |
| **D** | Migrate apps wave 1-4 → fetch จาก master CDN |
| **E** | Sunset Master Numbers Sheet (1S660...) · ลบ duplicate folders · update docs |

---

## 🔒 Security Checklist

- [ ] Apps Script account = `alongkorn@raceup.co.th` (หรือ service account ที่ rotate ทุก 90 วัน)
- [ ] ไม่มี hardcoded API key ใน Code.gs (Apps Script ดูแล auth เอง)
- [ ] Hub Link Sheet share level = Editor (เฉพาะ service account) + Viewer (ทีม)
- [ ] Live_ tabs protected ที่ Hub Link Sheet — เฉพาะ script เขียนได้
- [ ] Sync Log keep แค่ last 1000 rows (auto-prune)
- [ ] Email alert ส่งถึง `ALERT_EMAIL` ถ้า sync fail 3 ครั้งติด
