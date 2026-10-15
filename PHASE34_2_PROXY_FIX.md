# Phase 34.2 — Public API Proxy Recovery

Changes:
- The read-only `/api/market` proxy tries `api.bybit.com` first and `api.bytick.com` as a fallback.
- HTML/non-JSON upstream responses are converted into a structured JSON 502 diagnostic instead of forwarding an HTML body with a JSON content type.
- Browser errors now point to the likely proxy/deployment/upstream causes.
- Only public ticker, instruments-info, and kline endpoints are allowed. No private endpoints or order execution are included.

Verification:
- Static source checks and ZIP integrity can be run locally.
- Live Bybit connectivity and the user's Vercel deployment have not been verified by this package build.
