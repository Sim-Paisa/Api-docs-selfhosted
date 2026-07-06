---
sidebar_position: 520
sidebar_label: "Delink"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Tokenization — Delink

Remove a saved `sourceId` (SP token) so no further direct charges can be made against the customer's wallet account. The customer must complete the tokenization flow again to re-enable recurring charges.

**Applies to:** Easypaisa · JazzCash

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/wallets/transaction/delink` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/wallets/transaction/delink` |
| **Production** | `https://wallets.simpaisa.com/v2/wallets/transaction/delink` |

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

## Request Body

| Parameter | Type | Required | Length | Description |
|-----------|------|----------|--------|-------------|
| `merchantId` | String | Yes | 7 | Simpaisa-assigned merchant ID |
| `operatorId` | String | Yes | 06 | `100007` or `100008` |
| `sourceId` | String | Yes | — | SP token to revoke |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `status` | Response code — success means token is revoked |
| `message` | Human-readable status |
| `operatorId` | Payment channel ID |
| `merchantId` | Your merchant ID |
| `sourceId` | Echo of the revoked SP token |

:::info
After a successful Delink, [Direct Charge](./direct-charge.md) calls against that `sourceId` will fail. The customer must go through [Initiate](./initiate.md) and [Verify](./verify.md) / [Finalize](./finalize.md) again.
:::

---

## CURL

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/delink' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100007' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "xxxx",
    "operatorId": "100007",
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
  "sourceId": "sp_xxxxxxxxxxxxxxxx"
}
```

</TabItem>
</Tabs>
