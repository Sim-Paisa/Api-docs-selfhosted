# Inquire Disbursement (Bangladesh)

Query a previously initiated Bangladesh payout by merchant reference to retrieve the latest transaction state.

> **Applies to:** Bangladesh

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/inquire?reference={reference}` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

## Request parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `merchantId` | Yes | Merchant identifier assigned by Simpaisa |
| `reference` | Yes | Reference used in initiate disbursement |

## Response highlights

- `remittance.reference`
- `remittance.state`
- `remittance.comment`
- `remittance.issueDate`
- `remittance.actualAmount`, `deductedAmount`, `remitAmount`

Canonical reference: [Inquire Disbursement](../inquire-disbursement.md)
