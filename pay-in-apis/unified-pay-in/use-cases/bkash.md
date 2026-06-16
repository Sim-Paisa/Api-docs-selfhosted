# Use case: bKash (Bangladesh)

Collect a payment via **bKash** using the unified [Initiate](../initiate.md) and [Inquire](../inquire.md) APIs.

| Setting | Value |
|---------|-------|
| Region | `BD` |
| Operator | `10001` |
| Currency | `BDT` |

---

## Initiate

Set `operatorId: 10001` in headers and `"operator": "10001"` in the body.

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: BD' \
  --header 'operatorId: 10001' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "4000000",
    "operator": "10001",
    "msisdn": "1812345678",
    "amount": "20.00",
    "userKey": "order-22223452",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "Top-up"
  }'
```

Redirect the customer to `payment_url` from the response.

---

## Inquire

After redirect, call Inquire with the returned `transactionId`. See [Inquire](../inquire.md).

---

## Sample postback

```json
{
  "status": "0000",
  "message": "Success",
  "transactionId": "1423487",
  "merchantId": "4000006",
  "amount": "365.0",
  "msisdn": "1632332883",
  "userKey": "BDTb95a870f04403992d5034a2d201d2",
  "operator": "10001",
  "transactionType": "0",
  "createdTimestamp": "2025-09-19 16:15:53.0",
  "updatedTimestamp": "2025-09-19 16:17:07.187",
  "currencyCode": "BDT"
}
```
