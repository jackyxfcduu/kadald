# Phase 36.3.3 — Scan, Similarity & RR Fix

## Root causes addressed
- Similarity was calculated from regex matches against detector prose, causing artificial score plateaus.
- The detector only used a sweep on the latest candle, missing a sweep followed by displacement on a subsequent candle.
- Take-profit was always set to `entry ± 1.5 × risk`, regardless of opposing market structure.
- The pattern selector existed but was not applied to the scan list.
- UI could label a rejected plan as FORMING even when the decision was NO_TRADE.

## Updated behavior
- Evidence score weights: candidate 25, sweep in recent 4 closed bars 25, displacement 20, structural break 15, FVG 10, correct premium/discount location 5. Minimum entry score: 85/100. This is a rule-evidence score, not win probability.
- Fresh candidates are searched across recent closed candles; candidates older than three candles are not opened.
- Entry uses the latest observed market quote. SL uses the last 30 candles' structural extreme plus/minus 0.1 ATR. TP uses the nearest opposing confirmed swing.
- RR is computed as absolute reward divided by absolute risk. If no structural target exists or RR < 1.50, no entry is emitted.
- The pattern filter is honored and the table explicitly reports NO_TRADE when a candidate fails the entry gates.

## Local verification
- `node --check app.js` — PASS
- `node tests/smoke.test.js` — PASS (adapter fixtures; not a live API test)
- `node tests/phase36_3.test.js` — PASS (static acceptance checks)
- `node tests/phase36.test.js` — PASS (216 matrix fixture checks)
- `node tests/phase36_2_fixtures.test.js` — PASS (5 OHLC validation fixtures)

## Not verified
Live Binance/OKX connectivity, Vercel deployment, detector precision/recall against labelled historical setups, and profitability remain unverified.
