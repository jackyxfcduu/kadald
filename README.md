# ICT + SNR Multi-Timeframe Scanner — Daily-First

Browser-first USDT linear perpetual screener. The active strategy is one unified ICT + SNR engine. **Daily (D1) is the primary lookup**, followed by H4, H1, M15, and M5. The market adapter uses **Bybit V5 public endpoints only**; no API keys, account credentials, private endpoints, or live order execution.

## Strategy lookup order

1. **D1:** primary bias, major SNR, confirmed swing structure, dealing range, and premium/discount context.
2. **H4:** structure and higher-timeframe confirmation.
3. **H1:** liquidity context and SNR refinement.
4. **M15:** setup context and confirmation.
5. **M5:** sweep/structure/displacement/FVG entry confirmation and simulated SL/TP plan.

Each pair must have at least 30 closed candles available on all five timeframes. Missing data is shown as an error; the scanner does not silently downgrade to a smaller timeframe. The scanner emits one unified strategy result per pair, not 18 independent pattern results.

## Public API routes

- `GET /api/market?action=health` — checks Bybit V5 public market-data reachability.
- `GET /api/market?action=universe` — retrieves eligible USDT linear perpetual instruments and ranks them by 24-hour turnover.
- `GET /api/market?action=candles&symbol=BTCUSDT&interval=15&limit=150` — returns normalized OHLCV candles. Supported intervals include `5`, `15`, `30`, `60`, `120`, `240`, `360`, `720`, and `D`.

The adapter uses `/v5/market/instruments-info?category=linear`, `/v5/market/tickers?category=linear`, and `/v5/market/kline?category=linear`. Bybit response timestamps are normalized to milliseconds and candles are sorted chronologically. The browser removes the still-open candle before analysis.

## Entry policy

The engine combines D1-prioritized SNR zones with ICT liquidity sweep/reclaim, displacement, market-structure shift-like break, and FVG confirmation. Entry candidates must pass the setup gates, quality threshold (minimum 85 by default), structural stop-loss validation, an opposing Daily swing target, and minimum RR 1.50. A score is a rule-based confluence score, **not a calibrated win probability**. Invalid or incomplete setups remain WAIT/NO SETUP.

The strategy audit simulates forward M5 outcomes from cached multi-timeframe data. It does not include exchange fees or slippage and is not proof of future profitability. All output is analysis/simulation only; no order endpoint exists in the project.

## Deploy and verify

1. Extract the ZIP and upload the contents of `kadald-main/` to the root of the existing repository (do not upload the ZIP itself or nest the project folder).
2. Deploy the project on Vercel.
3. Open `/api/market?action=health`; expect `ok: true` and provider `Bybit V5 Public Market Data`.
4. Open `/api/market?action=universe`; confirm a non-empty `data.symbols` array.
5. Test `/api/market?action=candles&symbol=BTCUSDT&interval=D&limit=60` and confirm `ok: true` with candle data.
6. Open the dashboard, start a scan, and verify Diagnostics shows D1 → H4 → H1 → M15 → M5.

## Tests

Run the local test suite by executing each file in `tests/` with Node.js. The tests use fixtures and mocked API responses. Passing local tests does not prove that Bybit is reachable from the deployed Vercel environment; perform the deployment checks above.

## Files changed in the Daily-First refactor

- `ict-snr-engine.js` — unified ICT + SNR engine with D1-prioritized SNR lookup.
- `app.js` — single engine scan per pair, MTF data collection, checker ledger, and ICT + SNR historical simulation.
- `api/market.js` — Bybit V5 public-only market-data adapter.
- `index.html` — Daily-first strategy UI and updated labels.
- `tests/` — ICT/SNR engine, scanner, and mocked Bybit API acceptance tests.
- `DAILY_FIRST_ICT_SNR_CHANGELOG.md` — change summary.
