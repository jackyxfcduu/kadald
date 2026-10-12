# Phase 36.8.1 — Scanner startup diagnostics fix

## User-facing issue addressed
The browser app calls `/api/market`, which only exists when the project is run with its serverless API route (for example, a complete Vercel deployment or `vercel dev`). Opening `index.html` directly with `file://`, or publishing only the static HTML/CSS/JS, cannot provide this endpoint.

## Changes
- Added an explicit, actionable error for `file://` launches.
- Improved API fetch errors to distinguish unreachable endpoint, non-JSON response, missing response data, and provider failures.
- Exposed provider attempt details (Binance/OKX) in the scan status and Last Error area.
- Added deployment/local-run guidance to README.
- Preserved read-only operation, M5 minimum, all-18-method checks, and 60-second continuous scan behavior.

## Validation
- `node --check app.js`: PASS
- `node --check checker-core.js`: PASS
- Phase 36 through 36.8 test suite and smoke tests: PASS
- Browser automation, live market API, and Vercel deployment: NOT RUN. These require the actual browser/deployment environment.
