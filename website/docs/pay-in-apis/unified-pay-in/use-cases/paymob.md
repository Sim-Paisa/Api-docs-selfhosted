---
sidebar_position: 320
sidebar_label: "Paymob"
---

# Use Case: Paymob (Egypt)

Collect a payment via **Paymob** using the unified [Initiate](../initiate.md) and [Inquire](../inquire.md) APIs.

| Setting | Value |
|---------|-------|
| Region | `EG` |
| Operator | `100026` |
| Currency | `EGP` |

---

## Initiate

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: EG' \
  --header 'operatorId: 100026' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000150",
    "operatorId": "100026",
    "msisdn": "1012345678",
    "amount": "10",
    "userKey": "sample-order-001",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "test1",
    "currencyCode": "EGP",
    "transactionType": "0",
    "platform": "0"
  }'
```

:::info
Egypt uses `operatorId` in the request and response (not `operator`). `operator` is Bangladesh-only. Keep header and body values aligned — Paymob is **`100026`**.
:::

Redirect the customer to `payment_url`, then call [Inquire](../inquire.md) with `region: EG` and `operatorId: 100026`.

---

## Sample Postback

```json
{
  "status": "0000",
  "message": "Success",
  "transactionId": "1423487",
  "merchantId": "7000001",
  "amount": "365.0",
  "msisdn": "1632332883",
  "userKey": "BDTb95a870f04403992d5034a2d201d2",
  "operatorId": "100026",
  "transactionType": "0",
  "createdTimestamp": "2025-09-19 16:15:53.0",
  "updatedTimestamp": "2025-09-19 16:17:07.187",
  "currencyCode": "EGP"
}
```
