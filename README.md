# ICT Multi-Pattern Scanner — Phase 35: Binance + OKX Public Data

Browser-first USDT perpetual scanner. Binance USDⓈ-M Futures is the primary market-data provider; OKX USDT SWAP is the fallback. No API key, no account credentials, no order endpoints.

## Data adapters
- `GET /api/market?action=health`: server-side reachability check, tries Binance Futures public ping first, then OKX public instruments.
- `GET /api/market?action=universe`: active USDT-margined perpetual instruments, ranked by 24-hour quote turnover. Binance `/fapi/v1/exchangeInfo` + `/fapi/v1/ticker/24hr`; fallback OKX `/api/v5/public/instruments?instType=SWAP` + `/api/v5/market/tickers?instType=SWAP`.
- `GET /api/market?action=candles&symbol=BTCUSDT&interval=15&limit=150`: normalized closed OHLCV. Binance `/fapi/v1/klines`; fallback OKX `/api/v5/market/candles` using `instId=BTC-USDT-SWAP` and the corresponding `bar`.

## Deploy
1. Upload the contents of this folder to the root of the existing GitHub repository (not the ZIP itself and not a nested folder).
2. Commit and wait for Vercel deployment to finish.
3. Open `/api/market?action=health` on the deployed domain. Expected response: JSON `{\"ok\":true,\"data\":{\"provider\":...}}`. If both providers fail, response is 502 with provider-specific diagnostics.
4. Open `/api/market?action=universe` and confirm `ok: true`, `data.symbols` is non-empty, and `data.provider` identifies the provider actually used.
5. Test one candle request: `/api/market?action=candles&symbol=BTCUSDT&interval=15&limit=60`. Check `ok: true` and a non-empty `data.candles` array.
6. Then test the dashboard.

## Fallback behavior
Each action tries Binance first. On transport, HTTP, parsing, or empty-data failure, it tries OKX and returns the provider actually used plus prior failure diagnostics. A fallback may not list every Binance symbol; if a symbol does not exist on OKX, its candle request returns a visible data error rather than inventing data.

## Limits
- Browser UI scans configured symbols/timeframes with bounded concurrency. “All eligible” can be slow and should be introduced gradually due public API rate limits.
- Binance and OKX may have different contract listings, volume definitions, and candle boundaries. Data is normalized but provider identity is retained. Do not merge OHLCV from two providers into one candle series.
- Pattern detectors remain research candidates. This adapter does not prove pattern correctness or profitability.
- Live provider connectivity from your Vercel deployment must be verified using the `health`, `universe`, and `candles` routes. Local static tests are not a substitute for that.

## Test
Run `node tests/smoke.test.js`. Tests use mocked upstream responses and verify adapter normalization/fallback; they do not prove live Vercel reachability.

## Phase 35 dashboard / overlap audit
See `PHASE35_DASHBOARD_PATTERN_AUDIT.md`. The dashboard now shows unique candidates and overlap suppression counts. Competing detector matches on the same symbol, timeframe, and latest closed candle are consolidated to one primary row; conflicting directions are downgraded to WATCH/WAIT. This is a display integrity rule, not proof of pattern validity. Live network and historical pattern accuracy remain unverified.


## Phase 36.2 exhaustive scan audit

The scanner now runs all 18 registered pattern checkers for every selected pair and timeframe, regardless of the Pattern selector. The selector is retained as a UI control but does not limit detector execution. Each result is recorded in an in-memory execution ledger and the matrix audit is emitted in the browser console.

Run tests: `node tests/smoke.test.js` and `node tests/phase36.test.js`. These are local deterministic tests; they do not prove live provider connectivity or that provisional ICT detectors are fully accurate.


## Phase 36.2.1 OHLC data-integrity fixtures
Run `node tests/phase36_2_fixtures.test.js`. This verifies deterministic OHLC validation only; it does not certify ICT detector accuracy.

## Phase 36.3.1 — Win Rate Sidebar & Simulated Outcome Tracking

- Sidebar now includes **Win Rate** and **Win Rate by Method** navigation.
- Overall dashboard reports win rate, wins/losses, active simulated setups, and net R.
- Per-method table reports completed sample count, wins, losses, win rate, and net R.
- Only completed WIN/LOSS outcomes contribute to win-rate denominator. Expired setups are excluded from win rate and retained as zero-R outcomes in local history.
- Outcome tracking is simulated and browser-local (`localStorage`). A setup becomes active only from an `EARLY_ENTRY` plan with numeric entry, stop-loss, and take-profit levels. The scanner checks observed prices during each scan; it does not have tick-by-tick historical execution data.
- The **Reset history** button clears local active/completed simulation history after confirmation.
- A small sample is not statistically reliable. This is not a backtest and does not establish future profitability.


## Phase 36.3.3 — Scan & Risk Logic Fix

- Minimum entry-evidence score is **85/100**. Scores are derived from explicit evidence (candidate, recent liquidity sweep, displacement, structural break, FVG, and location), never keywords in explanation text. A score is not a probability of profit.
- Detectors evaluate recent closed candles (last four for a fresh candidate) so a liquidity sweep can precede the displacement candle. Candidates older than three candles are not opened as fresh entries.
- The selected pattern filter is now honored. Scan totals distinguish actual pattern evaluations, pairs with usable market data, valid entries, NO TRADE results, and data errors.
- Entry uses the observed market quote; stop-loss uses recent structural extremes with an ATR buffer; take-profit must be an opposing swing level. RR is calculated from those actual levels and entries below **1.50R** are rejected. No fixed RR/TP is fabricated when no structural target exists.
- No order execution. API live connectivity, deployment, and strategy profitability are not claimed as verified.


## Phase 36.4 — Manual scan & M5+
- No scan starts on page load or when settings are changed/saved. Use **Start Scan**, confirm the prompt, and use **Stop** to cancel.
- Settings are browser-local and survive reloads; reload does not resume a scan.
- Timeframes below M5 are excluded from the UI and rejected by the market API endpoint.
- Historical candidate discovery evaluates eligible candle endpoints; stale historical candidates are displayed as `NO_TRADE`, not opened late.
- Scan Diagnostics reports actual method evaluations, candidates, valid entries, errors, selected timeframes, and endpoint evaluations.
- See `PHASE36_4_CHANGELOG.md` and `PHASE36_4_QA_REPORT.md`.
- Local test command: `for f in tests/*.test.js; do node "$f"; done`.


## Phase 36.5 — rolling 10-candle scan + continuous refresh
- Each pair/timeframe/method evaluates the latest 10 eligible closed-candle endpoints (with historical context for detection).
- Start Scan starts a continuous read-only scan; after each completed scan, the next cycle starts after 60 seconds.
- Pause continuous scan pauses scheduled refresh; Stop cancels the current scan and disables continuous refresh.
- No API key or order execution is used.


## Phase 36.8 — Sidebar Active Positions + Independent 18-Method Checks

- New sidebar route `Dashboard — Active Positions` shows only OPEN simulated positions.
- Main navigation uses isolated page views with hash routing.
- Scanner always checks the full 18-method registry for every selected pair/timeframe; legacy saved single-method filters no longer reduce scanner coverage.
- Checker outcomes are retained in browser-local storage (`ict-snr-phase36.8-checker-ledger-v1`) and can be exported as CSV from Method & Rules.
- Diagnostics distinguish matrix completeness from rule completeness. Methods marked `SPECIFICATION_REQUIRED` are recorded but do not fabricate entries.
- Run all tests with `for f in tests/*.test.js; do node "$f"; done`.
- Browser automation, live exchange connectivity, and Vercel production deployment are not verified by the local test suite.
