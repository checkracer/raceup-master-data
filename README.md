# Raceup Master Data

> **Single Source of Truth** สำหรับข้อมูล master ของ Race Up Work — แชร์ใช้ใน hub, no, ops, racepack subdomains
>
> **Domain:** `master.raceup.co.th` (Cloudflare Pages, public + CORS `*`)
> **Repo:** `RACEUPWORK/raceup-master-data` (proposed, Public)
> **Local:** `C:\Claude Projects\Web Site Creation\raceup-master-data\`

## Executive Summary

แทนที่จะให้แต่ละ subdomain hardcode รายชื่อ 22 events → แก้ครั้งเดียวที่นี่ ทุก subdomain sync ตามทันที

| วิธี | ความเหมาะสม |
|---|---|
| **Static JS via CDN** | เร็วสุด — fetch ไฟล์ `.js` ตรงๆ ไม่ต้อง CORS preflight |
| **Apps Script Web App** | Dynamic — รองรับ filter/query, ดึง real-time |

## โครงสร้างไฟล์

```
raceup-master-data/
├── index.html              ← landing page อธิบาย API
├── data/
│   ├── events.js           ← 22 events (window.RACEUP_EVENTS + helpers)
│   └── categories.js       ← Race Pack categories + status flow
├── apps-script/
│   ├── Code.gs             ← Web App (events/categories/event/js endpoints)
│   └── appsscript.json     ← manifest (ANYONE access)
├── _headers                ← CORS Access-Control-Allow-Origin: *
├── _redirects              ← clean URL aliases
└── README.md
```

## วิธีที่ 1 — Static JS via CDN (แนะนำ)

```html
<script src="https://master.raceup.co.th/data/events.js"></script>
<script src="https://master.raceup.co.th/data/categories.js"></script>
<script>
  const event = window.getEventByCode('KSMH26');
  const next  = window.getNextEvent();
  const goal  = window.getTotalTarget();
</script>
```

### Helper functions
- `getEventByCode(code)` — หา event ตาม code
- `getNextEvent()` — งานถัดไปที่ใกล้สุด
- `getEventsBySeries(series)` — รายการตาม series
- `getTotalTarget()` — ผลรวม target ทั้งหมด

## วิธีที่ 2 — Apps Script Web App

| Action | URL | คำตอบ |
|---|---|---|
| events | `?action=events` | `{ok, events:[22], count, updated_at}` |
| event | `?action=event&code=KSMH26` | `{ok, event:{...}}` |
| categories | `?action=categories` | `{ok, categories:[5], status_flow:[8]}` |
| **js** | `?action=js` | **JavaScript file** (pre-built window.RACEUP_EVENTS) |
| ping | `?action=ping` | `{ok, time}` |

## Deploy Cloudflare Pages

```bash
cd "C:\Claude Projects\Web Site Creation\raceup-master-data"
git init && git add . && git commit -m "Initial master data"
git remote add origin https://github.com/RACEUPWORK/raceup-master-data.git
git push -u origin main
```

1. Cloudflare Pages → Connect to Git → Deploy (Framework: None)
2. Custom domain: `master.raceup.co.th`
3. ⚠️ **อย่าเปิด Cloudflare Access** — public access (เพื่อให้ CDN fetch ได้)

## ใช้ใน `no.raceup.co.th` แล้ว

ใน `number/js/config.js`:
```js
MASTER_DATA_URL: 'https://master.raceup.co.th'
```

`number/js/master-loader.js` จะดึง events.js + categories.js จาก master + fallback ไป local copy ถ้า master ไม่ available

## Roadmap

- เพิ่ม `team.js` — รายชื่อ 22 พนักงาน + email mapping
- เพิ่ม `suppliers.js` — supplier database
- API `/diff` — changelog ระหว่าง version
- Webhook Line Notify เมื่อแก้ events.js

---

*v1.0.0 · 2026-05-23 · Race Up Work Co., Ltd.*
