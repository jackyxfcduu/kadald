# Phase 36.8.2 — Start Scan no-op fix

## Root cause
The Phase 36.8.1 page did not include the `lastError` element, but `scan()` accessed `$('lastError').textContent` immediately after the user clicked Start Scan and confirmed. That threw before the first `/api/market?action=universe` request. The error handler also accessed the same missing element, which could hide the original failure. The continuous-scan setup also referenced `autoBtn` and `autoRefreshState` elements that were absent from the page.

## Fixes
- Added the missing Last Error and Provider Connection status rows to Market Overview.
- Added the missing Resume/Pause continuous scan control and its status to the header.
- Guarded diagnostic element updates so a missing optional status element cannot stop the scanner or hide the original error.
- Kept manual Start Scan, explicit confirmation, all 18 checker scheduling, M5 minimum, public market data only, and no order execution.

## Validation
- `node --check app.js`: PASS
- `node --check checker-core.js`: PASS
- All Phase 36.2–36.8 and smoke tests: PASS
- Static scan: all IDs referenced as required startup controls now exist; only dynamically created Settings controls remain absent from static HTML as intended.
- Browser automation, live API calls, and Vercel deployment were not run in this environment.
