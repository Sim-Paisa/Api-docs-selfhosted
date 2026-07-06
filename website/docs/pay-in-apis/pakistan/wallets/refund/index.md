---
sidebar_position: 570
sidebar_label: "Refund"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Refund

Refund wallet transactions via API, email, or the Simpaisa Portal. API refunds support **full** and **partial** amounts on supported operators.

---

## Refund Methods

| Method | Description | Operators |
|--------|-------------|-----------|
| **API** | Programmatic refund via `/v3/transaction/refund` | Easypaisa, JazzCash, HBL Konnect |
| **Email** | Send refund details to your Simpaisa POC | All payment types (wallets, card, IBFT) |
| **Portal** | Refund from the Simpaisa Dashboard transaction tab | Easypaisa, JazzCash, HBL Konnect |

:::info
Portal refunds require feature enablement. Contact Simpaisa support to activate portal refund access for your merchant account.
:::

### Refund Features

- **Full refund** — refund the entire original transaction amount
- **Partial refund** — refund a portion of the original amount (Easypaisa, JazzCash, and HBL Konnect)

Partial and full API refunds are currently available for **wallets only**. Support for other operators is in development.

---

## Environments

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://sandbox.simpaisa.com` |
| Production | `https://refund.simpaisa.com` |

---

## Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v3/transaction/refund` |
| **Sandbox** | `https://sandbox.simpaisa.com/v3/transaction/refund` |
| **Production** | `https://refund.simpaisa.com/v3/transaction/refund` |

---

## Response Codes

| Code | Message |
|------|---------|
| `0000` | Success |
| `0135` | Refund-Submitted |
| `0003` | Invalid-Merchant |
| `0090` | Transaction-Not-Found |
| `0094` | Invalid-Type |
| `0134` | Refund-Request-Already-Exists |
| `0137` | Amount-Greater-Than-Transaction-Amount |
| `0138` | Amount-Exceeds-Total-Amount-In-Process |
| `0140` | Invalid-Transaction-Date |

:::info
Refunds run on an **asynchronous** flow. The API returns `Refund-Submitted` (`0135`); the final status is sent via IPN/postback to your configured URL.
:::

### Sample Refund Callback

```json
{
  "message": "Success",
  "status": "0000",
  "createdDateTime": "2023-11-17 12:47:48.561",
  "userKey": "test",
  "transactionId": 290325803,
  "merchantID": 20000xx,
  "refundAmount": 1.0,
  "operatorId": 100007,
  "mobileNo": "3336775364",
  "updateDateTime": "2023-11-17 12:47:50.244"
}
```

---

## Full Refund

Refund the entire original transaction amount. Omit the `amount` field.

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionId` | String | Yes | Original transaction ID to refund |
| `merchantId` | String | Yes | Your merchant ID (7 digits) |
| `transactionDate` | String | Yes | Original transaction date (`YYYY-MM-DD`) |
| `type` | String | Yes | Must be `WALLETS` |

### Response Body

| Parameter | Description |
|-----------|-------------|
| `status` | `0135` = Refund-Submitted |
| `message` | Human-readable status |
| `merchantId` | Echo of your merchant ID |
| `transactionId` | Original transaction ID |
| `referenceNumber` | Unique reference for this refund request |

### CURL

```bash
curl --location 'https://sandbox.simpaisa.com/v3/transaction/refund' \
  --header 'Accept: text/plain, application/json, application/*+json' \
  --header 'Content-Type: application/json' \
  --data '{
    "transactionId": "95188981",
    "merchantId": "100000X",
    "transactionDate": "2023-08-24",
    "type": "WALLETS"
  }'
```

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "transactionId": "95188981",
  "merchantId": "100000X",
  "transactionDate": "2023-08-24",
  "type": "WALLETS"
}
```

</TabItem>
<TabItem value="successful-response" label="Successful response">

```json
{
  "status": "0135",
  "message": "Refund-Submitted",
  "merchantId": "2000347",
  "transactionId": "95188981",
  "referenceNumber": "20230831164719"
}
```

</TabItem>
</Tabs>

---

## Partial Refund

Refund a portion of the original transaction. Currently supported on **Easypaisa**, **JazzCash**, and **HBL Konnect**.

Full parameters, headers, and a sample request/response: [Partial Refund](./use-case-partial.md).

---

## Refund Via Email

Send the following details to your Simpaisa support contact or delegated POC:

- Original `transactionId`
- `merchantId`
- Refund amount (full or partial)
- Reason for refund

Refunds are executed per Simpaisa SLA.

---

## Refund Via Portal

1. Log in to the Simpaisa Portal/Dashboard.
2. Navigate to the **Transactions** tab.
3. Locate the transaction and execute the refund.

Portal refunds are available for Easypaisa, JazzCash, and HBL Konnect when the feature is enabled on your account.
