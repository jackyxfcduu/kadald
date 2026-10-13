# Bybit HTTP 403 / non-JSON failover fix

- Added fallback across official public API hosts: `api.bybit.com`, `api.bytick.com`, and `api.bybit.id`.
- All health, universe, and candle requests use the same failover-aware request helper.
- Non-JSON responses now include a short sanitized upstream body excerpt for diagnosis.
- Universe lookup follows the Bybit `nextPageCursor` for linear instruments instead of assuming a single page.
- Added a regression test simulating HTTP 403 HTML from the primary host and a successful response from `api.bytick.com`.
- All local Node.js test scripts passed. Live Vercel/provider reachability was not verified from this environment.
