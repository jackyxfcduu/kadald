# Phase 36.2.1 Change Log

## Added
- `checker-core.js`: deterministic OHLC validation via `validateOHLC()` and fixture builder `buildFixture()`.
- `tests/ohlc-fixtures.js`: five deterministic market-data integrity fixtures (valid candles, invalid range, duplicate timestamp, reversed timestamps, insufficient data).
- `tests/phase36_2_fixtures.test.js`: runnable assertions for the OHLC fixtures.

## Documentation
- README and QA notes now explicitly distinguish OHLC data-integrity tests from per-pattern accuracy tests.

## Verification performed locally
- `node --check app.js`: PASS
- `node --check checker-core.js`: PASS
- `node tests/smoke.test.js`: PASS
- `node tests/phase36.test.js`: PASS
- `node tests/phase36_2_fixtures.test.js`: PASS (5 fixtures)
- Live Binance/OKX endpoint checks: NOT TESTED
- Vercel deployment: NOT TESTED
- Per-detector positive/negative ICT fixture accuracy: NOT TESTED; detector specs are incomplete for some patterns.
