# Phase 36.8 — Sidebar Active Positions + 18-Method Checker

## Implemented
- Added a dedicated `Dashboard — Active Positions` sidebar route for OPEN simulated positions, ordered by latest entry.
- Separated the main UI into 10 isolated route views: Dashboard, Market Overview, Signal Scanner, Win Rate, Trade History, Win Rate by Method, Strategy Audit, Method & Rules, Settings, and Diagnostics.
- Added hash-based routing, active menu state, browser Back/Forward handling, and route-specific rendering refreshes.
- Changed the scanner to always schedule the full `PATTERNS` registry for every selected pair/timeframe, regardless of the legacy saved `patternPick` setting.
- Changed the pattern selector to a single required option: `All 18 methods (required)`.
- Explicitly prevent methods marked `SPECIFICATION_REQUIRED` from producing fabricated entry rows.
- Added persistent checker ledger in `localStorage` (`ict-snr-phase36.8-checker-ledger-v1`), retaining up to 5,000 most recent check records.
- Added checker-ledger table, filters, CSV export, matrix counts, unique-method count, and completeness status.
- Improved matrix verification to identify missing method checks and duplicate pair/timeframe/method checks, not only total-count mismatches.
- Linked simulated positions to their source scan/check identifiers where available.
- Kept market data read-only, Binance primary/OKX fallback, minimum timeframe M5, rolling 10 closed-candle endpoints, continuous scan, and no order execution.

## Known limitations
- This does not prove every method's ICT rules are quantitatively complete. `SPECIFICATION_REQUIRED` methods remain explicitly gated; other detectors may remain provisional.
- Active positions are simulated signal tracking, not exchange orders.
- Browser interaction tests, live exchange API tests, and Vercel deployment were not performed in this environment.
