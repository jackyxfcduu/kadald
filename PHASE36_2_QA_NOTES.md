# Phase 36.2 QA notes

- Adds `checker-core.js`: explicit status contract, scan ledger finalization, matrix completeness checks, and legacy detector status mapping.
- Scanner execution now always loops through all 18 registered methods; the Pattern selector no longer reduces detector execution coverage.
- Candle request failures are represented for each method in the pair/timeframe, rather than a single generic pipeline row.
- Runtime logs expected versus actual checker executions and matrix audit issues.
- `SPECIFICATION_REQUIRED` is retained for methods without an adequate operational definition.
- This change does not claim that all detectors are fully validated. Some existing detector rules are provisional; notably SMT/ATM/MXMM/IDM and session/news-dependent patterns require further authoritative specifications and fixtures.
- Public live endpoint and Vercel deployment tests were not performed during this build.

- Added `validateOHLC()` to the scan core with explicit diagnostics for insufficient candles, invalid OHLC ranges, duplicate timestamps, and non-chronological candles.
- Added deterministic OHLC data-integrity fixtures in `tests/ohlc-fixtures.js` and `tests/phase36_2_fixtures.test.js`. These validate the data contract only; they do not claim positive/negative fixture coverage for the 18 ICT detectors.
- Full per-detector positive/near-miss/invalidation fixtures remain NOT TESTED until each method has an agreed executable specification. This limitation is intentionally explicit rather than inventing expected results.
