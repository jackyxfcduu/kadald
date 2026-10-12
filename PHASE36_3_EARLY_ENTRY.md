# Phase 36.3 — Aggressive Early-Entry Trade Assistant

## Behavior change
- Directional detector results in `FORMING` or `WATCH` can produce `EARLY_ENTRY` when a BUY/SELL candidate exists; the engine does not wait for a 100% complete pattern.
- A candidate plan uses the latest closed candle close as the proposed entry, the most extreme low/high from the last 12 closed candles plus/minus 0.15 ATR as structural stop, and a 1.5R target.
- A plan is withheld if ATR/risk is invalid or stop distance exceeds 4 ATR.
- `similarityScore` is an evidence-based heuristic score out of 100, explicitly not a win probability.
- Conflicting directional candidates for the same symbol/timeframe/candle are suppressed to `WATCH` / `NO TRADE`.
- No exchange orders are submitted. Binance USDⓈ-M Futures public data remains primary; OKX public USDT SWAP remains fallback.

## Important limitations
- This is an aggressive candidate assistant, not a claim that every listed ICT method is fully implemented. SMT, ATM, MXMM, and IDM remain `SPECIFICATION_REQUIRED` as their operational definitions are not sufficiently established in this source.
- Session windows are still provisional UTC assumptions in the existing detector.
- Entry, stop and target are computed estimates from closed-candle data; a live price can move before the user acts. Re-evaluate before acting and do not chase a missed entry.
- Similarity score is not calibrated against historical outcomes. No profitability claim is made.

## QA
Run:
- `node --check app.js`
- `node tests/smoke.test.js`
- `node tests/phase36.test.js`
- `node tests/phase36_2_fixtures.test.js`
- `node tests/phase36_3.test.js`

These local tests do not establish live exchange availability, detector accuracy, or a successful Vercel deployment.
