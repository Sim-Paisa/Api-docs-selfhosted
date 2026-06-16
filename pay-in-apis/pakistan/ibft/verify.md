# Verify Pull Request on Bank Account

The customer provides the **OTP** received via SMS to approve the transaction on their bank account.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/ibft/transaction/verify` |
| **Sandbox** | `https://sandbox.simpaisa.com/ibft/transaction/verify` |
| **Production** | `https://ibft.simpaisa.com/ibft/transaction/verify` |

---

## Request body

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | Int | 07 | Unique ID provided by Simpaisa for each merchant |
| `operatorId` | Yes | Int | 06 | Payment channel ID |
| `userKey` | Yes | String | N/A | Merchant-generated key to track the transaction |
| `amount` | Yes | String | N/A | Transaction amount |
| `accNo` | Yes | Int | 25 | Bank account number |
| `cnic` | Yes | Int | 13 | Customer CNIC |
| `bankId` | Yes | String | 24 | Bank ID for Pull IBFT |
| `otp` | Yes | Int | 10 | One-time password sent via SMS |

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `status` | Simpaisa response code |
| `message` | Human-readable explanation |
| `msisdn` | Customer contact number linked to bank or wallet |
| `operatorId` | Payment channel ID |
| `merchantId` | Merchant identifier |
| `transactionId` | Unique transaction ID |

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
    "bankId": "xx",
    "otp": "xxxxxx"
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
