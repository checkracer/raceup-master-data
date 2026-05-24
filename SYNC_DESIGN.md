# Raceup Master Data — Sync Design (Hybrid Sheet ↔ GitHub)

## Executive Summary

**ปัญหา:** Google Sheet เป็นที่ที่ทีมแก้ข้อมูลสะดวกที่สุด แต่ static .js files บน CDN (master.raceup.co.th) เป็นที่ที่เร็วและกระจายไปทุก subdomain ได้

**ทางออก:** Hybrid — Sheet เป็น source of truth สำหรับ tactical updates, GitHub repo เป็น source of truth สำหรับ structure + history. มี 2 sync mechanisms:
1. **Push** — Sheet `onEdit` trigger → Apps Script → commit GitHub ผ่าน REST API
2. **Pull** — GitHub Action cron daily → fetch จาก Sheet via Apps Script API → commit changes

**แนะนำ:** ใช้ทั้ง 2 ตามประเภทไฟล์ (ดูตารางด้านล่าง)

---

## File-by-File Sync Strategy

| File | แก้บ่อยแค่ไหน | Recommended Sync | เหตุผล |
|------|---------------|------------------|--------|
| `events.js` | นาน ๆ ครั้ง (มีงานใหม่/แก้วันที่) | **Push (manual)** + commit ตรง ๆ | ครั้งเดียวต่อรอบ พิจารณาก่อนทำ |
| `staff.js` | บ่อย (เพิ่มเบอร์ · เปลี่ยน role) | **Pull daily** | ไม่ urgent · เปลี่ยน auto ได้ |
| `project-assign.js` | บ่อยมาก (assign คนใหม่ทุกสัปดาห์) | **Push (onEdit)** | เปลี่ยนแล้วต้องเห็นใน ops/hub ทันที |
| `sponsors.js` | บ่อย (status เปลี่ยน) | **Pull daily** | ไม่ urgent · OK ถ้า delay 1 วัน |
| `suppliers.js` | นาน ๆ ครั้ง | **Push (manual)** | rarely changes |
| `categories.js` | นาน ๆ ครั้ง | **Push (manual)** | structure file |

---

## Architecture A — Push (Apps Script → GitHub API)

```
Google Sheet (Project Assign tab)
     │
     │  onEdit() trigger fires
     ▼
Apps Script function syncToGitHub()
     │
     │  1. Build JS file content from sheet rows
     │  2. GET current SHA via GitHub Content API
     │  3. PUT new content (commit + push)
     ▼
GitHub repo  checkracer/raceup-master-data
     │
     │  Cloudflare Pages webhook
     ▼
master.raceup.co.th  (CDN cache 5min)
     │
     │  Static fetch
     ▼
ops.raceup.co.th, hub.raceup.co.th, no.raceup.co.th, ...
```

### Apps Script Implementation Skeleton

```javascript
// scripts/sync-project-assign.gs (deploy เป็น Apps Script attached กับ Hub Sheet)

const GITHUB_REPO  = 'checkracer/raceup-master-data';
const GITHUB_PATH  = 'data/project-assign.js';
const GITHUB_TOKEN = 'ghp_xxx...'; // PAT — เก็บใน PropertiesService
const HUB_SHEET_ID = '13t_phzkL3sbFV0vOSm_3nTqfkUjxhTxez0JqBWFykfI';

function onProjectAssignEdit(e) {
  // ตรวจว่า edit อยู่ใน sheet "Project Assign"
  if (e && e.range && e.range.getSheet().getName() === 'Project Assign') {
    Utilities.sleep(2000); // debounce 2s
    syncProjectAssignToGitHub();
  }
}

function syncProjectAssignToGitHub() {
  // 1. Read Sheet → build JS content
  const projects = getProjectsFromSheet();
  const js = buildProjectAssignJs(projects);

  // 2. Get current SHA (required for PUT)
  const headers = { Authorization: 'token ' + GITHUB_TOKEN, Accept: 'application/vnd.github.v3+json' };
  const getUrl  = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
  const getResp = UrlFetchApp.fetch(getUrl, { headers, muteHttpExceptions: true });
  const sha = JSON.parse(getResp.getContentText()).sha;

  // 3. Commit new content
  const putBody = {
    message: 'sync: project-assign from Hub Sheet (' + new Date().toISOString() + ')',
    content: Utilities.base64Encode(js, Utilities.Charset.UTF_8),
    sha: sha,
    branch: 'main',
  };
  UrlFetchApp.fetch(getUrl, {
    method: 'put', headers, contentType: 'application/json',
    payload: JSON.stringify(putBody),
  });
}

function buildProjectAssignJs(projects) {
  return [
    '/* Auto-synced from Hub Sheet @ ' + new Date().toISOString() + ' */',
    'window.RACEUP_PROJECT_ASSIGN = ' + JSON.stringify(projects, null, 2) + ';',
    // ... helper functions ...
  ].join('\n');
}
```

### Pros / Cons

✅ **Real-time** — change ใน Sheet → master CDN updated within ~60s (commit + CF Pages deploy)
✅ **No CRON dependency** — trigger เป็น event-driven
❌ **GitHub PAT exposure risk** — token อยู่ใน Apps Script (ต้อง rotate)
❌ **Quota limits** — Apps Script + GitHub API rate limits
❌ **Setup complexity** — ต้อง config PAT + trigger + handle errors

---

## Architecture B — Pull (GitHub Action cron)

```
GitHub Action  (cron: 0 6 * * *)
     │
     │  daily 06:00 ICT
     ▼
fetch master.raceup.co.th Apps Script API
     │  ?action=staff, ?action=projects, ?action=sponsors
     ▼
Action runs Node script
     │  diff existing .js files
     ▼
git commit (only if changed) → push to main
     │
     ▼
Cloudflare Pages auto-deploy
```

### Implementation — `.github/workflows/sync-master.yml`

```yaml
name: Sync Master Data
on:
  schedule:
    - cron: '0 23 * * *'   # 06:00 ICT = 23:00 UTC previous day
  workflow_dispatch:        # manual trigger button

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run sync script
        run: node scripts/sync-from-master-api.js
        env:
          APPS_SCRIPT_URL: ${{ secrets.MASTER_APPS_SCRIPT_URL }}
      - name: Commit if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/*.js
          git diff --cached --quiet || git commit -m "sync: master data $(date +%Y-%m-%d)"
          git push
```

### `scripts/sync-from-master-api.js` skeleton

```javascript
const fs = require('fs');
const API = process.env.APPS_SCRIPT_URL;

async function syncFile(action, varName, outPath) {
  const resp = await fetch(`${API}?action=${action}`);
  const data = await resp.json();
  if (!data.ok) return console.error(`${action} failed:`, data.error);

  const arrKey = Object.keys(data).find(k => Array.isArray(data[k]));
  const arr = data[arrKey];
  const content = [
    `/* Auto-synced from master API @ ${new Date().toISOString()} */`,
    `window.${varName} = ${JSON.stringify(arr, null, 2)};`,
  ].join('\n');

  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`✓ ${outPath} (${arr.length} items)`);
}

(async () => {
  await syncFile('staff',    'RACEUP_STAFF',          'data/staff.js');
  await syncFile('projects', 'RACEUP_PROJECT_ASSIGN', 'data/project-assign.js');
  await syncFile('sponsors', 'RACEUP_SPONSORS',       'data/sponsors.js');
})();
```

### Pros / Cons

✅ **Simple + safe** — ไม่ต้อง expose GitHub PAT ใน Sheet/Apps Script
✅ **Audit trail** — ทุก sync เป็น git commit (มี diff ดูย้อนหลังได้)
✅ **Free** — GitHub Action runs 2000 minutes/mo free สำหรับ private repo
❌ **Daily delay** — change ใน Sheet ต้องรอถึงเช้าวันถัดไป
❌ **Sheet → master read latency** — Apps Script call หนึ่งครั้ง = ~2-5 วินาที

---

## Architecture C — Hybrid (แนะนำ)

ใช้ทั้ง Push และ Pull ตามประเภทไฟล์:

```
ประเภท HIGH urgency (project-assign):
  Sheet edit → onEdit Apps Script → GitHub API → CDN (60s)

ประเภท LOW urgency (staff, sponsors, suppliers):
  GitHub Action cron 6am → Apps Script API → commit → CDN

ประเภท STRUCTURE (events, categories):
  Manual commit เท่านั้น (Engineer review ก่อน push)
```

### Setup checklist

- [ ] สร้าง GitHub Personal Access Token (repo scope) → save ใน Apps Script PropertiesService
- [ ] Deploy `sync-project-assign.gs` ที่ Hub Apps Script + เพิ่ม onEdit trigger
- [ ] สร้าง `.github/workflows/sync-master.yml` + `scripts/sync-from-master-api.js` ในเรพ master-data
- [ ] เพิ่ม secret `MASTER_APPS_SCRIPT_URL` ใน GitHub repo settings
- [ ] Test: edit Sheet → ดู GitHub commit ภายใน 2 นาที (Push)
- [ ] Test: manual trigger workflow → ดู commit (Pull)

---

## Security Notes

1. **GitHub PAT (Personal Access Token):**
   - สร้างที่ https://github.com/settings/tokens/new
   - Scope: `repo` (full control of private repos) — minimum needed
   - Set expiration: 90 days · rotate quarterly
   - เก็บใน Apps Script `PropertiesService.getScriptProperties().setProperty('GITHUB_PAT', 'ghp_...')` — ห้าม hardcode ใน Code.gs

2. **Apps Script PropertiesService:**
   - encrypted at rest ใน Google
   - readable เฉพาะคน owner ของ Apps Script project
   - ห้าม leak ผ่าน Logger.log

3. **Master.raceup.co.th — public CDN:**
   - ปัจจุบัน CORS `*` (anyone fetch ได้)
   - ⚠️ ห้ามใส่ phone/email private ใน static .js ที่ public
   - Phone ของพนักงานควรอยู่ใน Apps Script API (auth required) ไม่ใช่ static .js

---

## Migration Plan — ทำตามลำดับ

| Phase | งาน | เวลา | Dependency |
|-------|-----|------|-----------|
| 1 | Push events.js update (CSMH26) ตอนนี้ — manual | ✅ Done | - |
| 2 | Setup GitHub repo `raceup-master-data` + push ทุกไฟล์ใหม่ | 30 นาที | manual |
| 3 | Deploy master/Code.gs ใหม่ (มี staff/projects/sponsors endpoints) | 15 นาที | Phase 2 |
| 4 | Test endpoints — `?action=staff`, `?action=projects` | 15 นาที | Phase 3 |
| 5 | Build GitHub Action `sync-master.yml` (Pull mechanism) | 1 ชม | Phase 4 |
| 6 | Build Push mechanism สำหรับ project-assign (Apps Script trigger) | 2 ชม | Phase 4 |
| 7 | Refactor ops to use master-loader.js | 2 ชม | Phase 4 |
| 8 | Refactor hub.raceup.co.th to use master.raceup.co.th | 4 ชม | Phase 7 |

**Total ~10 ชม** ทั้ง architecture
