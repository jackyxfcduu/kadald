# Phase 35 Dashboard & Pattern Overlap Audit

## Changes
- Added dashboard summary cards for unique pattern candidates, suppressed overlapping candidates, no-match checks, and data errors.
- Changed the detector's default result from `WATCH` to `NO_MATCH`. A pattern is no longer represented as a candidate merely because no branch matched.
- Added a deterministic primary-candidate selection per `symbol + timeframe + latest closed candle timestamp`.
- When two candidate detectors disagree on direction for the same symbol/timeframe/candle, the visible result is downgraded to `WATCH` with direction `NONE` and an explicit conflict reason.
- When multiple detectors agree on direction for the same candle, only one primary candidate is displayed; overlapping detector names/count are disclosed in the card/row reason.
- This ranking is a display de-duplication mechanism, not a confidence/profit probability. It does not establish that the selected model is correct.

## Validation
- `node --check app.js`: PASS
- `node --check api/market.js`: PASS
- Existing mock smoke tests for Binance normalization, OKX fallback, controls, registry names, and no order execution: PASS
- Live network and Vercel deployment: NOT TESTED
- Historical pattern validity: NOT TESTED

## Known limitation
Several pattern detectors are still heuristic/provisional because the supplied cheat sheet is a visual reference, not a complete machine-readable rulebook. Pattern-specific validation and historical replay are required before describing any detector as fully implemented or treating candidates as actionable signals.
