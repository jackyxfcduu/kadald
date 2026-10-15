# Phase 37 — Strong SNR + ICT Entry Timing

## Scope
- Entry decisions are now location-first: the engine scores D1/H4/H1 support and resistance zones before considering an ICT-triggered position.
- SNR zones are ranges with explicit strength, reaction, freshness, touch, invalidation, and multi-timeframe confluence metadata.
- A trade candidate must be near a directionally appropriate strong zone and pass the existing ICT, similarity, structural SL/TP, and RR gates.
- The engine exposes `locationState`, `strongSNR`, `reasonCodes`, and an explicit entry policy for auditability.
- Scanner rows now surface the location state and Strong SNR score/availability.
- The legacy `status` and `entryModel` contracts remain compatible with existing UI and tests; waiting states are represented by `WAIT` with a more specific `locationState`.

## Behavior
- Price far from a valid Strong SNR zone stays `WAITING_FOR_ZONE`; the engine does not chase it.
- Price near a strong zone without a valid ICT trigger stays `WAITING_FOR_CONFIRMATION`.
- Directional mismatch between ICT and the relevant support/resistance zone blocks entry.
- D1/H4 conflict requires additional reversal evidence.
- A score is a rule-based quality measure, not a win probability.

## Verification
- Added `tests/strong-snr-entry-timing.test.js` for zone scoring metadata, waiting when price is far from a valid zone, and missing-D1 blocking.
- Existing regression tests should be run individually with Node.js. Live provider and browser-based end-to-end behavior still require deployment verification.
