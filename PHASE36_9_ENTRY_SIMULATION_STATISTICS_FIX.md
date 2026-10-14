# Phase 36.9 — Entry, Simulation & Statistical Reliability Fix

## Implemented

- Added explicit `actualEntry`, `plannedEntry`, `signalEntry`, `riskDistance`, `plannedRR`, `actualRR`, stable `tradeId`, `signalId`, and strategy version metadata to newly opened simulated trades.
- Corrected execution timeframe fallback to M5 when the scanner provides a composite timeframe label. Expiry duration now uses a recognized execution timeframe instead of accidentally falling back to an unrelated interval.
- Added directional SL/TP validation, minimum similarity score validation, minimum RR validation, and price-drift rejection before opening a simulated trade.
- Reworked simulated exit accounting to calculate R from the recorded entry, exit, and stop loss rather than assigning the planned RR or fixed -1R unconditionally.
- Expiry is evaluated before TP/SL when the first fresh quote arrives after the expiry deadline, because the current quote cannot prove a target was touched before expiry. A fresh quote is required to close an expired trade; otherwise the trade remains tracked and is flagged `expiryPendingData`.
- Added exit source and result-validity metadata for new closed trades.
- Added deduplication when reading trade history, prioritizing completed records over duplicate active records.
- Updated Win Rate Dashboard sample text to distinguish resolved W/L trades from all closed trades, and expose expiry/ambiguous counts in the W/L card's supporting text.
- Improved strategy audit R aggregation: Net R can include valid expired mark-to-market outcomes, while expectancy and win rate remain based on resolved WIN/LOSS outcomes. Ambiguous results do not contribute fabricated R values.
- Updated stale provider tests to match the repository's actual OKX-primary / Gate.io-fallback adapter.

## Validation

- `node --check app.js` — PASS
- `node --check strategy-audit.js` — PASS
- `node --check api/market.js` — PASS
- All files in `tests/*.test.js` — PASS
- Smoke and provider fallback tests use mocked HTTP responses.

## Limitations / not claimed

- No live market/API test or browser end-to-end test was performed.
- The repository does not include a package manifest/build script, so a production build command could not be run.
- The browser-local tracker evaluates observed scan prices, not complete tick history. It therefore cannot reconstruct unobserved intrabar order or prove TP/SL was reached between scans.
- Existing historical records are preserved; their missing actual-entry/exit metadata is not fabricated or retroactively reconstructed.
- The changes improve accounting integrity and entry gates but do not establish that strategy profitability or win rate has improved. Out-of-sample backtesting remains necessary.
