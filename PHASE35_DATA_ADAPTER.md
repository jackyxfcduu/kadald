# Phase 35 — Binance primary / OKX fallback

## Audit findings
The previous Phase 34.2 source still called Bybit-only `/v5/market/*` routes from `app.js` and its `/api/market` function. The fallback hosts were both Bybit domains, so it did not meet the requested Binance + OKX design. UI copy and README also still named Bybit.

## Changes
- Replaced Bybit-specific query-path proxy with normalized `health`, `universe`, and `candles` actions.
- Binance USDⓈ-M Futures is primary: exchangeInfo, 24h ticker, klines.
- OKX USDT SWAP is fallback: public instruments, tickers, candles.
- Normalized symbol/price/change/turnover and OHLCV shapes for the browser.
- Fallback errors include provider diagnostics; no credentials, private APIs, or order endpoints.
- Dashboard scan now consumes normalized endpoints and reports actual provider.

## Verification status
- Source syntax and mocked adapter tests can be run locally.
- This build environment cannot reach external endpoints (`fetch` to Binance fails at the network layer), so live upstream connectivity has NOT been verified here. After deployment, open `/api/market?action=health`, then `universe`, then one `candles` request. Only mark live connectivity PASS after those responses succeed on the user's deployed Vercel domain.
