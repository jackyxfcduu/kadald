# Phase 36.3.1 — Win Rate Sidebar & Simulated Tracking

## Added
- Sidebar navigation to Win Rate Dashboard and Win Rate by Method.
- Overall metrics: completed-trade win rate, wins/losses, active simulated setups, net R.
- Per-ICT-method performance table and mobile cards.
- Browser-local persistence for active and completed simulated setups.
- Observed-price simulation: target/stop closure and time-expiry handling; expired setups excluded from win-rate denominator.
- Reset history action with confirmation.
- Static acceptance checks for UI and tracking functions.

## Local verification
- `node --check app.js` — PASS
- `node --check api/market.js` — PASS
- `node tests/phase36.test.js` — PASS (216 matrix fixture checks)
- `node tests/phase36_2_fixtures.test.js` — PASS (5 OHLC integrity fixtures)
- `node tests/phase36_3.test.js` — PASS (early-entry + win-rate UI/static acceptance)
- `node tests/smoke.test.js` — PASS (18 methods, provider normalization, read-only safety)
- Live API connectivity — NOT TESTED in this local test run
- Vercel deployment — NOT TESTED
- Real-market detector accuracy / historical backtest — NOT TESTED

## Important limitations
- Win rate starts as `—` until at least one simulated setup completes at TP or SL.
- Price evaluation occurs on scan refreshes; price moves between scans can be missed. This is not tick-level execution simulation.
- History is stored only in the current browser profile and can be reset or lost if browser storage is cleared.
- The similarity score is not a win probability.
