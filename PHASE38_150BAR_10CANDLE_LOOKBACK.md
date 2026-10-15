# Phase 38 — 150-Bar Historical Context + 10-Candle Entry Confirmation

## Changes
- The strategy engine caps each supplied timeframe to the latest 150 bars for historical structure and SNR mapping.
- Strong SNR touch/reaction evaluation now uses the available 150-bar context rather than only the latest 100 bars.
- ICT confirmation uses the latest 10 supplied closed candles for recent liquidity sweep detection and recent M5 FVG/retest evaluation.
- Liquidity sweep detection evaluates each recent candle against structure available before that candle and returns the latest valid sweep in the confirmation window.
- The scanner requests 150 candles for each timeframe and stores at most 150 closed candles in the audit cache.
- The settings UI now explicitly presents the 150-bar per-timeframe limit.
- Added `tests/history-150-confirm-10.test.js` to verify the 150/10 contract.

## Data integrity
- The app's candle normalization filters out candles whose timeframe has not closed yet before the engine receives them.
- The engine does not create missing historical candles. If the available history is insufficient, existing `NO_DATA` gating remains active.
- The 10-candle window is a confirmation window, not a restriction on where historical SNR zones may originate.

## Validation
- All JavaScript files checked with `node --check` where applicable.
- All `tests/*.test.js` files passed, including the new 150-bar/10-candle regression test.
- Live market-provider behavior, browser end-to-end, and production deployment have not been verified in this environment.
