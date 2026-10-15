# Phase 36.7 — Strategy Performance Audit

## Implemented
- Added a live closed-trade audit grouped by ICT method, pair, timeframe, and direction; groups are sorted from weakest net R upward.
- Added a user-triggered historical OHLC backtest over candles loaded during the latest scan.
- Backtest uses only candle data available up to each signal candle, enters at the signal candle close, and checks future candles for up to two candles.
- TP and SL touched in the same candle are marked `AMBIGUOUS` and excluded from win-rate denominator.
- Added sample count, wins, losses, ambiguous outcomes, expiries, win rate, expectancy in R, and profit factor.
- Excluded the four methods marked `SPECIFICATION_REQUIRED` from backtest rather than inventing executable definitions.
- Exports trade-level backtest results to CSV.
- Repaired `pattern-engine.js`, which contained a truncated function declaration and was syntactically invalid; its exported detector/score now mirrors the app's detector implementation.
- Added automated tests for statistics, ambiguous OHLC outcomes, grouping, and backtest fixtures.

## Important limitations
- The detector remains provisional for methods labeled PARTIAL; this backtest is a diagnostic, not proof of profitability.
- Entry uses signal-candle close, TP/SL from available structure, and a maximum two-candle holding window.
- Fees, slippage, funding, order fill quality, and exchange execution are not modeled.
- Live trade history records are observed-price simulations, not exchange executions.
- Historical audit uses the candle cache in the current browser session; run a scan first. Refreshing the page clears that in-memory cache.
