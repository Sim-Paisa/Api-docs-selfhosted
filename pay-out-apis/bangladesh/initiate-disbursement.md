# Initiate Disbursement (Bangladesh)

Create a payout request for a Bangladesh beneficiary account or wallet.

> **Applies to:** Bangladesh

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/remittance/{merchantId}/initiateDisbursement` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

## Required request fields

- `customerName`
- `customerContact`
- `customerAccount`
- `destinationBank`
- `reference`
- `amount`
- `reason`

## Response highlights

- `status`, `message`
- `reference`
- `customerReference`
- `state` (typically starts at `in_process`)

Canonical reference: [Initiate Disbursement (Bangladesh section)](../initiate-disbursement.md#bangladesh)
