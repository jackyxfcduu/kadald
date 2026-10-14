# Daily-First ICT + SNR Refactor

- Replaced active 18-pattern scanner pipeline with one ICT + SNR Multi-Timeframe engine.
- Added primary D1 lookup and mandatory H4, H1, M15, M5 context.
- Added D1-prioritized SNR zone lookup, structure/liquidity/displacement/FVG checks, quality gating, structural SL/TP and RR >= 1.50.
- Reworked checker ledger to record one unified engine evaluation per pair.
- Replaced pattern-based historical audit with a multi-timeframe ICT + SNR M5 simulation.
- Kept public market data only; no real order execution.
- Updated acceptance tests. All local Node test files pass; live API/browser deployment was not tested.
