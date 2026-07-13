---
sidebar_position: 330
sidebar_label: "ZainCash"
---

# Use Case: ZainCash (Iraq)

Collect a payment via **ZainCash** using the unified [Initiate](../initiate.md) and [Inquire](../inquire.md) APIs.

| Setting | Value |
|---------|-------|
| Region | `IQ` |
| Operator | `100027` |
| Currency | `IQD` |

---

## Initiate

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: IQ' \
  --header 'operatorId: 100027' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "6000001",
    "operatorId": "100027",
    "msisdn": "7901234567",
    "amount": "10",
    "userKey": "sample-order-001",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "test1",
    "currencyCode": "IQD",
    "transactionType": "0"
  }'
```

Redirect the customer to `payment_url`, then call [Inquire](../inquire.md) with `region: IQ` and `operatorId: 100027`.

:::info
Iraq uses `operatorId` in the request and response (not `operator`). `operator` is Bangladesh-only.
:::

---

## Sample Postback

```json
{
  "status": "0000",
  "message": "Success",
  "transactionId": "1423487",
  "merchantId": "6000001",
  "amount": "365.0",
  "msisdn": "1632332883",
  "userKey": "BDTb95a870f04403992d5034a2d201d2",
  "operatorId": "100027",
  "transactionType": "0",
  "createdTimestamp": "2025-09-19 16:15:53.0",
  "updatedTimestamp": "2025-09-19 16:17:07.187",
  "currencyCode": "IQD"
}
```
