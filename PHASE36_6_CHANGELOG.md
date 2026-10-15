# Phase 36.6 — Trade History Recovery

## Changes
- Restored a visible Trade History section with active and completed simulated setups.
- Added pair search, status/outcome filters, reset-filter control, and CSV export.
- Preserved the existing browser storage key `ict-snr-phase36.3-simulated-trades-v1` so existing local history is not intentionally reset by this update.
- Stored last observed price/check time on active simulated trades.
- Displayed entry time, pair, timeframe, ICT method, direction, entry, SL, TP, latest/exit price, status, outcome, RR, net R, and close reason.
- Added a deduplication guard across both active and completed records.
- Improved storage write failure feedback.
- Preserved existing scan, timeframe, similarity, API fallback, and read-only behavior.

## Important limitations
- History uses browser-local `localStorage`; it is not synchronized across browsers/devices and can be cleared by the browser/user.
- Existing history is only available if it still exists in the same browser profile under the previous storage key.
- Outcome tracking observes prices during scan cycles, not exchange order executions. TP/SL touches between checks can be missed; this is not a broker/exchange trade ledger.
- The current implementation remains simulated signal tracking and does not execute orders.
