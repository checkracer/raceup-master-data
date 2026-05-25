# Phase D — Migration Status Report

## Executive Summary

Phase D (Migrate Apps to master CDN) is **code-complete on the developer side**. All 6 target apps have been refactored to pull events + staff from `master.raceup.co.th` with embedded fallback. Only 2 user actions remain: deploy the Phase C Apps Script + push the latest commits to GitHub.

---

## Completed Refactors (this stage)

### Wave 2 — Form Sites ✅
| File | Pattern Applied |
|---|---|
| `form.raceup.co.th/index.html` | events + staff CDN |
| `form-ops.raceup.co.th/index.html` | events + staff CDN |
| `form-ops.raceup.co.th/form-ops-raceup/index.html` | events + staff CDN (duplicate of above) |

### Wave 3 — Raceup Hub Pages ✅
| File | Pattern Applied |
|---|---|
| `raceup-hub/sponsor-update.html` | events CDN |
| `raceup-hub/project-assign.html` | events + project-assign CDN |
| `raceup-hub/project-assign-dashboard.html` | events + project-assign + staff CDN |
| `raceup-hub/post-event.html` | events CDN |

### Wave 4 — Event Subdomain Sites ✅ (no refactor needed)
- `supersports-10mile-2026` — single-event public site, no embedded list
- `korat-marathon-2026` — single-event public site, no embedded list
- `scenicmarathon-website` — single-event public site, no embedded list
- `raceup-hub/assets/js/race-data.js` — historical 47-event database for ranking/stats (different purpose, must NOT be replaced with current 22-event 2026 list)

### Wave 5 — API Wrappers ✅
- `number/js/api.js` — already migrated to `window.RACEUP_EVENTS`, no work needed
- `checkracer/js/api.js` — legacy version on OneDrive (superseded by `number/` on E:\, deployed as no.raceup.co.th). Skipped refactor since not in production.

---

## Refactor Pattern (used in all files)

**HTML head:**
```html
<script src="https://master.raceup.co.th/data/events.js"></script>
<script src="https://master.raceup.co.th/data/staff.js"></script>
```

**JS init (IIFE with fallback):**
```javascript
const TEAM_MEMBERS_FALLBACK = [/* embedded snapshot */];
const TEAM_MEMBERS = (function() {
  if (window.RACEUP_STAFF && window.RACEUP_STAFF.length > 0) {
    return window.RACEUP_STAFF.filter(s => s.email).map(s => ({
      dept: s.department || 'Other',
      name: s.nickname + (s.level === 'C level' ? ' (' + s.role + ')' : ''),
      email: s.email
    }));
  }
  return TEAM_MEMBERS_FALLBACK;
})();
```

Same pattern for `EVENT_LIST` → `window.RACEUP_EVENTS` (with fallback).

---

## Remaining User Actions

| # | Action | Why | Owner |
|---|---|---|---|
| 1 | **Deploy Phase C Code.gs** to master Apps Script | Master read-from-Hub-Link goes live | Korn |
| 2 | **`git push`** raceup-master-data → main | events.js (27 events) + Phase C Code.gs | Korn |
| 3 | **`git push`** raceup-hub → main | sponsor-update + project-assign + post-event refactors | Korn |
| 4 | **`git push`** ops.raceup.co.th → main (new repo) | Initial CF Pages deploy | Korn |
| 5 | **Deploy Phase B sync scripts** in Working Sheet | Auto-sync Working → Hub Link | Korn |
| 6 | **Test smoke**: open form.raceup.co.th, check console — should log `[form] TEAM_MEMBERS from master CDN: 23 staff` | Verify master CDN reachable | Korn |

---

## Architecture After Phase D

```
Working Sheet (manual edit by team)
    │
    │ (Phase B sync — onEdit + daily cron)
    ↓
Raceup Hub Link Sheet (single source of truth on Sheets)
    │
    │ (Phase C — master Apps Script reads Live_* tabs)
    ↓
master.raceup.co.th
    ├── /data/events.js     ← Static CDN (Cloudflare Pages)
    ├── /data/staff.js
    ├── /data/project-assign.js
    ├── /data/sponsors.js
    ├── /data/suppliers.js
    └── /exec               ← Apps Script JSON API (live)
    │
    ↓ (Phase D — apps fetch from master, with fallback)
    │
Apps:
  • no.raceup.co.th       (number/)
  • ops.raceup.co.th
  • hub.raceup.co.th      (raceup-hub/)
  • form.raceup.co.th
  • form-ops.raceup.co.th
```

---

## Risk Notes

- **All refactors are non-breaking** — embedded fallback keeps each app working even if master CDN is unreachable
- **Console log pattern** added for verification: every refactored file logs whether it loaded from master CDN or fell back
- **No files deleted** — followed user constraint ("ห้ามลบไฟล์โดยไม่ได้รับอนุญาตเด็ดขาด")
- **Legacy checkracer/ untouched** — `number/` is the active deployment

---

## What's Next (Phase E — Sunset, optional, low priority)

1. Add banner in Working Sheet — "Edit here, syncs to apps via master CDN"
2. Migrate Master Numbers Sheet data → Hub Link or master
3. Remove `MASTER_NUMBERS_URL` hardcode from form.raceup.co.th
4. Document final architecture in `raceup-context` skill
5. Monitoring: alert if any app still fetches deprecated sheets

_Phase E is cleanup work and can be deferred until Phase D is verified in production._
