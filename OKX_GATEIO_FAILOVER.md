# OKX / Gate.io market-data failover

Replaced Bybit-only adapter with OKX public USDT perpetual market data as primary and Gate.io USDT futures as automatic fallback for universe and candle requests. No API keys, private endpoints, or order execution are used. Verify `/api/market?action=health`, `/api/market?action=universe`, and Daily candles after deploying. Availability is deployment-region dependent; local mocked tests do not guarantee live reachability.
