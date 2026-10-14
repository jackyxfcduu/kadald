# Phase 36.5 — Rolling 10-Candle Scan and Continuous Updates

- Scanner now evaluates the latest 10 eligible closed-candle endpoints for every selected pair, timeframe, and method. Each endpoint still uses historical context for pattern detection.
- Starting a scan enables continuous read-only scanning. Once a full scan finishes, the next cycle begins after 60 seconds.
- Added pause/resume for the continuous schedule. Stop cancels the active request and disables future cycles.
- Settings remain separate from starting a scan; M5 remains the minimum timeframe.
- No API key and no order execution.

## Verification
- JavaScript syntax checks passed.
- Existing matrix/OHLC/static acceptance/smoke tests passed.
- Phase 36.5 static acceptance passed.
- No live exchange request, browser automation, or Vercel deployment was performed. Pattern accuracy/profitability is not certified by these tests.
