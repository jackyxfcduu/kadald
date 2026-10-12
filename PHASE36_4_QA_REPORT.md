# Phase 36.4 QA Report

## Tests executed locally
- `node --check app.js` — PASS
- `node --check api/market.js` — PASS
- `node tests/phase36.test.js` — PASS (216 scan-matrix fixtures)
- `node tests/phase36_2_fixtures.test.js` — PASS (5 OHLC integrity fixtures; not detector accuracy tests)
- `node tests/phase36_3.test.js` — PASS (static checks for entry/risk and win-rate code)
- `node tests/phase36_4.test.js` — PASS (static checks for manual scan, no auto-start, settings, M5 minimum, historical endpoint scan, cancellation, diagnostics, threshold floor, win-rate UI)
- `node tests/smoke.test.js` — PASS (mocked Binance/OKX adapter behavior and API rejection of M1)

## Not tested
- Real browser clickability/performance automation.
- Live public API connectivity from a deployed Vercel function.
- Vercel deployment/build.
- Pattern accuracy on labeled real-market historical datasets.
- Complete positive/negative fixture coverage for all 18 methods.

## Interpretation
Passing static and mocked tests does not establish that every ICT method is correctly implemented or profitable. The UI now requires explicit manual scan start and the API rejects timeframes below M5, but detector validation remains an ongoing requirement.
