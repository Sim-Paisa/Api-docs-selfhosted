---
sidebar_position: 510
sidebar_label: "Direct Charge"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Tokenization — Direct Charge

Charge a customer on a defined schedule using a saved `sourceId` from a completed tokenization flow. No OTP is required for direct charges.

**Applies to:** Easypaisa · JazzCash

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/wallets/transaction/direct-payment` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/wallets/transaction/direct-payment` |
| **Production** | `https://wallets.simpaisa.com/v2/wallets/transaction/direct-payment` |

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `mode` | Yes | `payin` |
| `region` | Yes | `PK` |
| `operatorId` | Yes | `100007` (Easypaisa) or `100008` (JazzCash) |
| `version` | Yes | `3.0` |

---

## Prerequisites

- Customer completed initial tokenization ([Easypaisa Verify](./verify/index.md) or [JazzCash Finalize](./finalize/index.md))
- Valid `sourceId` (SP token) was returned and stored
- Customer approved the initial charge via wallet app or flash message

:::warning
Direct Charge **cannot** run without a `sourceId`. If the customer was [delinked](./delink.md), they must complete the tokenization flow again.
:::

---

## Request Body

| Parameter | Type | Required | Length | Description |
|-----------|------|----------|--------|-------------|
| `merchantId` | String | Yes | 07 | Simpaisa-assigned merchant ID |
| `operatorId` | String | Yes | 06 | `100007` or `100008` |
| `transactionType` | String | Yes | 01 | `8` = tokenized charge |
| `amount` | String | Yes | — | Amount to charge |
| `userKey` | String | Yes | — | Your unique order reference for this charge |
| `sourceId` | String | Yes | — | SP token from tokenization |
| `platform` | String | No | 1 | Set to `3` to route charge/refund IPNs to separate webhook endpoints |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `status` | Response code |
| `message` | Human-readable status |
| `operatorId` | Payment channel ID |
| `merchantId` | Your merchant ID |
| `sourceId` | Echo of the SP token |
| `transactionId` | Simpaisa transaction ID for this charge |

---

## CURL

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/direct-payment' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100007' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "xxxx",
    "operatorId": "100007",
    "transactionType": "8",
    "amount": "100",
    "userKey": "xxxxxxx",
    "sourceId": "sp_xxxxxxxxxxxxxxxx"
  }'
```

---

## Samples

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "merchantId": "xxxx",
  "operatorId": "100007",
  "transactionType": "8",
  "amount": "100",
  "userKey": "xxxxxxx",
  "sourceId": "sp_xxxxxxxxxxxxxxxx"
}
```

</TabItem>
<TabItem value="successful-response" label="Successful response">

```json
{
  "status": "0000",
  "message": "Success",
  "operatorId": "100007",
  "merchantId": "xxxxxxxx",
  "sourceId": "sp_xxxxxxxxxxxxxxxx",
  "transactionId": "xxxxxxxxx"
}
```

</TabItem>
</Tabs>

### With `platform` Parameter

```json
{
  "merchantId": "xxxx",
  "operatorId": "100008",
  "transactionType": "8",
  "amount": "100",
  "userKey": "xxxxxxx",
  "sourceId": "sp_xxxxxxxxxxxxxxxx",
  "platform": "3"
}
```
