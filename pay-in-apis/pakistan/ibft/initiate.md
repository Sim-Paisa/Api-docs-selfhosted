# Initiate Pull Request on Bank Account

Customers can be charged by directly pulling funds from their bank. Once the payment is initiated, the customer receives an OTP; upon entering the OTP (via the [Verify](./verify.md) call), the amount is deducted from the customer's bank account.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/ibft/transaction/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com/ibft/transaction/initiate` |
| **Production** | `https://ibft.simpaisa.com/ibft/transaction/initiate` |

---

## Request body

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | Int | 07 | Unique ID provided by Simpaisa for each merchant |
| `operatorId` | Yes | Int | 06 | Payment channel ID (`100018` for Pull IBFT) |
| `userKey` | Yes | String | N/A | Merchant-generated key to track the transaction |
| `amount` | Yes | String | N/A | Amount to debit |
| `accNo` | Yes | Int | 25 | Bank account number |
| `cnic` | Yes | Int | 13 | Customer CNIC (Computerized National Identity Card) |
| `bankId` | Yes | String | 24 | Unique ID for the customer's bank (Pull IBFT) |

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `status` | Response code — `0000` for success |
| `message` | Human-readable description |
| `accNo` | Masked customer bank account number |
| `bankId` | Customer's bank identifier |
| `operatorId` | Payment channel ID (Pull IBFT = `100018`) |
| `merchantId` | Merchant identifier |
| `transactionId` | Simpaisa transaction ID — store for [Verify](./verify.md) |

---

## Samples

### Sample request

```json
{
    "merchantId": "xxxxxxx",
    "operatorId": "100018",
    "userKey": "xxxxxxxxxx",
    "amount": "xxxx",
    "accNo": "xxxxxxxxxxxxxxxxxxxx",
    "cnic": "xxxxxxxxxxxxxxx",
    "bankId": "xx"
}
```

### Successful response

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3xxxxxxxxxx",
  "operatorId": "10000x",
  "merchantId": "200000x",
  "transactionId": "xxxxxxx"
}
```
