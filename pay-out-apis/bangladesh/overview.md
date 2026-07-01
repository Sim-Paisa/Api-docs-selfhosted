# Pay-Out Overview (Bangladesh)

Bangladesh pay-out supports bank and wallet disbursements using the Bangladesh configuration profile.

> **Applies to:** Bangladesh

## Base URLs

| Environment | URL |
|-------------|-----|
| Sandbox | `https://sandbox.simpaisa.com` |
| Production | `https://payout.simpaisa.com` |

## Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |
| `mode` | `payout` |
| `region` | `BD` |
| `version` | `3.0` |

## Core Flow

1. Pre-fund account and obtain MID.
2. Use bank/branch mapping data to resolve destination details.
3. Initiate disbursement and track state transitions.
4. Reconcile with inquiry + postback notifications.

Related pages:
- [Initiate disbursement](./initiate-disbursement.md)
- [Inquire disbursement](./inquire-disbursement.md)
- [Disbursement states](./disbursement-states.md)

Canonical reference: [Pay-Out Overview (Bangladesh section)](../overview.md#bangladesh)
