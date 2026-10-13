# Phase 36.8.3 — Scanner progress and provider order

- Prioritized OKX USDT SWAP for health, universe, and candle requests because the deployment's health result explicitly showed Binance HTTP 451 and OKX reachable.
- Binance remains a fallback; no private endpoints or order execution added.
- Scanner status now displays the active pair/timeframe while candles are being requested.
- Diagnostic evaluation counters update after each checker result and after candle-request failures are recorded.
- Errors identify the pair/timeframe and include the upstream error message.

## Validation
- `node --check app.js`
- `node --check api/market.js`
- Phase 36.8.3 regression test and prior test suite.
- Browser/live API deployment verification was not performed in this environment.
