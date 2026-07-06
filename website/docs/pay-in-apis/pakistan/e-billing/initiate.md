---
sidebar_position: 620
sidebar_label: "Initiate"
---

# Initiate E-Bill (Payment Via Voucher)

Generate a payment voucher (token) for the customer to pay via their bank portal or mobile banking app. See the [E-Billing overview](./overview.md) for the P2B/B2B concept, operator ID, and how tokens work.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/payment/transaction/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/payment/transaction/initiate` |
| **Production** | `https://ibft.simpaisa.com/v2/payment/transaction/initiate` |

---

## Request Body

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | String | 07 | Unique merchant ID |
| `amount` | Yes | String | N/A | Total amount to be paid |
| `userKey` | Yes | String | N/A | Merchant key to track the transaction |
| `msisdn` | Yes | String | 10 | Customer contact number |
| `transactionType` | Yes | String | 01 | Payment type — one-time, recursive, or tokenized |
| `expiryDuration` | Yes | String | N/A | Token expiry, e.g. `2d` or `6h` |
| `operatorId` | Yes | String | 06 | Payment channel ID (`100011`) |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `status` | Simpaisa response code |
| `message` | Human-readable explanation |
| `merchantId` | Merchant identifier |
| `operatorId` | Payment channel ID |
| `paymentToken` | Unique token the customer uses to pay via e-banking or mobile wallet |
| `transactionId` | Simpaisa transaction ID — store for [Inquire](./inquire.md) |
| `amount` | Transaction amount |
| `dateCreated` | Timestamp when the payment token was generated |
| `paymentTokenExpiryDateTime` | Timestamp when the token expires |

---

## Samples

### Sample Request

```json
{
    "merchantId": "xxxxxxx",
    "amount": "xxxx",
    "userKey": "xxxxxx",
    "msisdn": "xxxxxxxxx",
    "transactionType": "3",
    "expiryDuration": "2d",
    "operatorId": 100011
}
```

### Successful Response

```json
{
  "status": "0000",
  "message": "Success",
  "merchantId": "xxxxxx",
  "operatorId": "100011",
  "paymentToken": "xxxxxxxxxxxxxxxxxxxx",
  "transactionId": "xxxxxxxx",
  "amount": "xxxx",
  "dateCreated": "xxxxxxx",
  "paymentTokenExpiryDateTime": "xxxxxxx"
}
```

---

## E-Billing Postback (IPN)

When the customer pays, Simpaisa sends an async notification to your configured postback URL:

```json
{
  "status": "0000",
  "message": "Success",
  "merchantId": "20000XX",
  "operatorId": "100011",
  "paymentToken": "10007714409644242324",
  "transactionId": "xxxxxxxx",
  "amount": "xxxx",
  "dateCreated": "xxxxxxx",
  "paymentTokenExpiryDateTime": "xxxxxxx",
  "datePaid": "xxxxxx"
}
```

Return HTTP `200` to acknowledge receipt.
