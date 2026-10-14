# Phase 36.5 QA Report

| Check | Result | Scope |
|---|---|---|
| `node --check app.js` | PASS | Syntax only |
| `node --check api/market.js` | PASS | Syntax only |
| `node tests/phase36.test.js` | PASS | 216 scan-matrix fixtures |
| `node tests/phase36_2_fixtures.test.js` | PASS | 5 OHLC validation fixtures; not pattern accuracy |
| `node tests/phase36_3.test.js` | PASS | Static acceptance checks |
| `node tests/phase36_4.test.js` | PASS | Updated static acceptance checks |
| `node tests/phase36_5.test.js` | PASS | 10 endpoint window and 60-second loop static checks |
| `node tests/smoke.test.js` | PASS | Mocked adapter checks; live network not tested |

Limitations: browser-level behavior, live Binance/OKX connectivity, deployment, detector accuracy, and profitability were not tested/certified.
