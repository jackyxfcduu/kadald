# Phase 36.4 — Manual Scan, M5 Minimum, Historical Discovery

## Implemented
- Removed the startup `scan()` invocation and auto-refresh behavior. The scanner starts only after the user clicks Start Scan and confirms.
- Added Stop Scan with AbortController cancellation and a single-active-scan guard.
- Settings are persisted separately from scan execution; changing/saving/resetting settings does not launch a scan.
- Enforced a minimum timeframe of M5 in UI scan choices and the market API route; intervals below M5 are rejected.
- Added configurable minimum similarity (never below 85), historical candle limit, pair count, and bounded worker concurrency.
- Changed candidate discovery to evaluate each eligible historical endpoint using a bounded local context, while refusing to open old historical candidates.
- Added live scan diagnostics counters and historical endpoint evaluation totals.
- Added static acceptance tests for manual start, no auto scan, M5 minimum, cancellation, diagnostics, threshold floor, and retained win-rate UI.

## Known limitations
- The 18 detectors are still a mixture of provisional candidate rules and `SPECIFICATION_REQUIRED` methods. This phase does not establish detector accuracy or profitability.
- Full positive/negative OHLC fixtures for each ICT method are not yet implemented.
- Browser automation, live Binance/OKX connectivity, and Vercel deployment were not tested in this environment.
- Similarity is an evidence score, not win probability. Historical candidates are visible as NO_TRADE if stale; they are not chased as fresh entries.
