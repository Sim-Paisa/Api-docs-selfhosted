# Use Case: Khalti (Nepal)

Collect a payment via **Khalti** using the unified [Initiate](../initiate.md) and [Inquire](../inquire.md) APIs.

| Setting | Value |
|---------|-------|
| Region | `NP` |
| Operator | `100025` |
| Currency | `NPR` |

---

## Initiate

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: NP' \
  --header 'operatorId: 100025' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000150",
    "operatorId": "100025",
    "msisdn": "9865806257",
    "amount": "10",
    "userKey": "sample-order-001",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "test1",
    "currencyCode": "NPR",
    "transactionType": "0",
    "platform": "0"
  }'
```

{% hint style="info" %}
Nepal samples use `operatorId` in the body (not `operator`). Keep header and body operator values aligned.
{% endhint %}

Redirect the customer to `payment_url`, then call [Inquire](../inquire.md).

---

## Sample Postback

```json
{
  "status": "0000",
  "message": "Success",
  "transactionId": "1423487",
  "merchantId": "5000001",
  "amount": "365.0",
  "msisdn": "1632332883",
  "userKey": "BDTb95a870f04403992d5034a2d201d2",
  "operator": "100025",
  "transactionType": "0",
  "createdTimestamp": "2025-09-19 16:15:53.0",
  "updatedTimestamp": "2025-09-19 16:17:07.187",
  "currencyCode": "NPR"
}
```
