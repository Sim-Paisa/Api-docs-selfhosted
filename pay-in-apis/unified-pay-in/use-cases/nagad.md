# Use Case: Nagad (Bangladesh)

Collect a payment via **Nagad** using the unified [Initiate](../initiate.md) and [Inquire](../inquire.md) APIs.

| Setting | Value |
|---------|-------|
| Region | `BD` |
| Operator | `10002` |
| Currency | `BDT` |

---

## Initiate

Same request as [bKash](./bkash.md). Set `operatorId` header and body `operator` to **`10002`**.

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: BD' \
  --header 'operatorId: 10002' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "4000000",
    "operator": "10002",
    "msisdn": "1812345678",
    "amount": "20.00",
    "userKey": "order-22223453",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "Top-up"
  }'
```

Redirect the customer to `payment_url` from the response, then call [Inquire](../inquire.md).
