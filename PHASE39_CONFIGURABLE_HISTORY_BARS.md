# Phase 39 — Configurable Historical Bars

## Changes
- Settings now offers 150, 300, and 500 historical bars per timeframe.
- The selected setting is normalized and persisted with existing scanner settings.
- Scanner candle requests use the selected limit and analysis contexts are sliced to that cap.
- The selected history limit is passed into the ICT + SNR engine; SNR zone touch/reaction analysis uses the configured history window.
- ICT confirmation now uses up to the latest 200 closed candles on M15 and M5. The selected 150/300/500 setting controls historical context; M15/M5 requests are raised to at least 200 closed candles when needed.
- Requests above 300 bars prefer Gate.io, which supports up to 500 bars; OKX remains the fallback provider. The engine analyzes up to the selected cap based on data actually returned.
- Scanner rows include a history count summary so the selected cap and effective available history can be audited.
- Strategy Audit uses the same selected history limit as the last scan.

## Validation
- All repository `tests/*.test.js` scripts pass.
- `node --check app.js`, `node --check ict-snr-engine.js`, and `node --check api/market.js` pass.
- Market endpoint test mocks a 500-bar Gate.io response and verifies the adapter returns 500 bars.
- Live provider behavior, browser UI interaction, and Vercel deployment were not tested in this environment.

## Behavior
- 150 = analyze at most 150 closed bars per timeframe.
- 300 = analyze at most 300 closed bars per timeframe.
- 500 = analyze at most 500 closed bars per timeframe.
- If the provider has fewer closed bars available, the engine uses the available bars (subject to its minimum-data checks); the ICT confirmation window is 200 closed candles on M15 and M5.
