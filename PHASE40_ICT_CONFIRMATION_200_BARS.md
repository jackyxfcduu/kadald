# Phase 40 — 200-Bar ICT Confirmation

## Changes
- Replaced the former 10-candle ICT confirmation window with 200 closed bars.
- The 150/300/500 Settings choice continues to control historical context used for D1/H4/H1 SNR mapping.
- M15 and M5 fetches now request enough candles to provide 200 closed bars, including an extra raw bar when needed to account for the still-forming candle.
- The engine uses the latest 200 M15/M5 bars for liquidity sweep and ICT confirmation checks; SNR context remains capped by the selected history setting.
- If fewer than 200 closed bars are available on M15 or M5, the engine does not open a position and returns an explicit waiting/insufficient-confirmation reason.
- Historical Strategy Audit uses the 200-bar M15/M5 window when the available pre-signal data supports it; earlier points with insufficient history are not treated as valid entry signals.
- Scanner messaging and Settings text now distinguish selected historical context bars from the fixed 200-bar ICT confirmation window.

## Validation
- Syntax checks: `app.js`, `ict-snr-engine.js`, and `api/market.js`.
- Regression tests cover the 150/300/500 context setting, 200-bar confirmation, sweep search window, and insufficient confirmation history.
- Live market behavior, browser end-to-end, and Vercel deployment require external verification.
