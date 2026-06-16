# Inquire E-Bill Payment

Check the status of a payment against the token. If the customer has not paid, the response is **transaction-pending**. Use this call to confirm status when the IPN was not handled, or to cross-check the deduction.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/ibft/transaction/verify` |
| **Sandbox** | `https://sandbox.simpaisa.com/ibft/transaction/verify` |
| **Production** | `https://ibft.simpaisa.com/ibft/transaction/verify` |

---

## Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |

---

## Request body

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | String | 10 | Unique merchant ID |
| `operatorId` | Yes | String | 06 | Payment channel ID (`100011`) |
| `transactionId` | Yes | String | 01 | Transaction ID from [Initiate](./initiate.md) |
| `paymentToken` | Yes | String | N/A | Payment token from [Initiate](./initiate.md) |

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `status` | Simpaisa response code |
| `message` | Human-readable explanation |
| `merchantId` | Merchant identifier |
| `operatorId` | Payment channel ID |
| `paymentToken` | Payment token |
| `transactionId` | Transaction ID |
| `amount` | Transaction amount |
| `dateCreated` | Token creation timestamp |
| `paymentTokenExpiryDateTime` | Token expiry timestamp |
| `datePaid` | Payment completion timestamp (when paid) |

---

## Samples

### Sample request

```json
{
    "merchantId": "xxxxxxx",
    "operatorId": "100011",
    "transactionId": "xxxxxxx",
    "paymentToken": "xxxxxxxxx"
}
```

### Successful response

```json
{
    "status": "0000",
    "message": "Success",
    "merchantId": "xxxxxxx",
    "operatorId": "100011",
    "paymentToken": "xxxxxxxxxxxxxxxxxxxx",
    "transactionId": "xxxxxxxx",
    "amount": "xxxx",
    "dateCreated": "xxxxxxx",
    "paymentTokenExpiryDateTime": "xxxxx",
    "datePaid": "xxxxxx"
}
```

{% hint style="info" %}
If the customer has not completed payment, status reflects **transaction-pending**. Poll until a final state is reached or the token expires.
{% endhint %}
