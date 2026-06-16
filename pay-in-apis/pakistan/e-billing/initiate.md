# Initiate E-Bill (Payment via Voucher)

E-billing supports both **P2B** and **B2B** payments. You generate a bill and receive a **payment token**. The customer pays using their bank portal or mobile banking app.

**Operator ID (E-Billing):** `100011`

---

## How it works

- Tokens expire after **15–30 days** by default; you can set a custom expiry per bill.
- E-billing uses an **async flow** — Simpaisa sends an **IPN** once payment completes.
- To initiate, provide the customer mobile number (`msisdn`). You can also use a pre-defined `msisdn` format where Simpaisa provides the `msisdn`.
- Display the returned token/voucher in your UI; the customer pays against that token.
- Set `expiryDuration` using `d` (days) or `h` (hours), e.g. `2d`, `6h`.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/payment/transaction/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/payment/transaction/initiate` |
| **Production** | `https://ibft.simpaisa.com/v2/payment/transaction/initiate` |

---

## Request body

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

## Response body

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

### Sample request

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

### Successful response

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

## E-Billing postback (IPN)

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
