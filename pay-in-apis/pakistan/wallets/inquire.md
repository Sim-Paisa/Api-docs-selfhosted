# Inquire Payment

Fetch the status of a wallet transaction when postback notifications are not received or a postback URL has not been configured.

**Applies to:** Mobile wallets (Easypaisa · JazzCash · HBL Konnect · Alfa)

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/inquire/wallet/transaction/inquiry` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/inquire/wallet/transaction/inquiry` |
| **Production** | `https://wallets.simpaisa.com/v2/inquire/wallet/transaction/inquiry` |

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Accept` | Yes | `text/plain, application/json, application/*+json` |
| `Content-Type` | Yes | `application/json` |
| `mode` | Yes | `payin` |
| `region` | Yes | `PK` |
| `operatorId` | Yes | Wallet operator code |
| `version` | Yes | `3.0` |
| `Request-Id` | No (recommended) | Unique request identifier for idempotency |

{% hint style="warning" %}
Avoid frequent polling. Use [postbacks](./overview.md#transaction-callbacks-ipn--postback) for final decisioning when possible.
{% endhint %}

---

## Request Body

Identify the transaction by **`userKey`** or **`transactionId`** (provide one).

| Parameter | Type | Required | Length | Description |
|-----------|------|----------|--------|-------------|
| `merchantId` | Int | Yes | 7 | Simpaisa-assigned merchant ID |
| `userKey` | String | Yes* | — | Your order reference from Initiate/Verify |
| `transactionId` | String | Yes* | — | Simpaisa transaction ID from Initiate/Verify |

\* Provide `userKey` **or** `transactionId`.

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `merchantId` | Your merchant ID |
| `transactionId` | Simpaisa transaction ID |
| `userKey` | Your order reference |
| `transaction` | Nested object with full transaction details |

### `transaction` Object

| Parameter | Description |
|-----------|-------------|
| `status` | Final status code — `0000` = Success |
| `message` | Human-readable status |
| `msisdn` | Customer mobile number |
| `operatorId` | Payment channel ID |
| `merchantId` | Merchant ID |
| `transactionId` | Transaction ID |
| `amount` | Transaction amount |
| `userKey` | Order reference |
| `transactionType` | `0` = one-time payment |
| `createdTimestamp` | Transaction creation time |
| `updatedTimestamp` | Last status update time |

---

## When To Use

- Postback URL is not configured
- Postback was not received (network timeout, server downtime)
- [Non-OTP](./verify.md#non-otp-flow) or [async](./verify.md#async-flow) Verify returned `Transaction-Pending`

{% hint style="info" %}
At present, this Inquire API works for **mobile wallets** only.
{% endhint %}

---

## CURL

```bash
curl -X POST "https://sandbox.simpaisa.com/v2/inquire/wallet/transaction/inquiry" \
  -H "Content-Type: application/json" \
  -H "operatorID: 100008" \
  -H "Request-Id: 341324134" \
  -H "mode: payin" \
  -H "region: PK" \
  -H "version: 3.0" \
  -d '{
    "merchantId": "xxxxxxx",
    "userKey": "xxxxx"
  }'
```

---

## Samples

{% tabs %}
{% tab title="Request (by userKey)" %}

```json
{
  "merchantId": "xxxxxxx",
  "userKey": "xxxxx"
}
```

{% endtab %}

{% tab title="Request (by transactionId)" %}

```json
{
  "merchantId": "xxxxxxx",
  "transactionId": "xxxxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "merchantId": "2000xxx",
  "transactionId": "9518xxxx",
  "userKey": "xxxxxxxx",
  "transaction": {
    "transactionType": "0",
    "amount": "1",
    "merchantId": "xxxxxxxx",
    "createdTimestamp": "2024-03-27 12:58:36.077",
    "message": "Success",
    "msisdn": "3xxxxxxxxx",
    "operatorId": "100008",
    "updatedTimestamp": "2024-03-27 12:59:39.128",
    "transactionId": "xxxxxxxxxx",
    "userKey": "xxxxxxx",
    "status": "0000"
  }
}
```

{% endtab %}
{% endtabs %}
