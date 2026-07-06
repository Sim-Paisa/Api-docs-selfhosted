---
sidebar_position: 180
sidebar_label: "Error Handling"
---

# Error Handling

If an error occurs, the API returns an appropriate HTTP status code along with an error message in the response body.

---

## HTTP Status Codes

| Status Code | Description |
| ----------- | ----------- |
| 400 | Bad request |
| 401 | Unauthorized access |
| 404 | Transaction not found |
| 500 | Internal server error |

---

## Application-level Errors

Pay-in, pay-out, remittance, and card APIs also return **business status codes** in the JSON body (e.g. `status: "0050"`). These are distinct from HTTP status codes.

| Product | Status code reference |
|---------|----------------------|
| Pakistan wallet pay-in | [Pay-In (wallet — PK)](./status-codes/pay-in-pk-wallet.md) |
| Unified pay-in (BD/NP/EG/IQ) | [Pay-In (unified)](./status-codes/pay-in-unified.md) |
| Cards | [Cards](./status-codes/cards.md) |
| Pay-out | [Pay-Out](./status-codes/pay-out.md) |
| Remittance | [Remittance](./status-codes/remittance.md) |

---

## Recommended Handling

1. Check the HTTP status first — retry only on transient `5xx` errors with backoff.
2. Parse the JSON `status` and `message` fields for business outcomes.
3. For async flows (non-OTP wallets, disbursements, remittances), combine API responses with [webhooks](./webhooks.md) and inquiry APIs for final state.
4. Log `reference`, `transactionId`, or `userKey` for support escalation.
