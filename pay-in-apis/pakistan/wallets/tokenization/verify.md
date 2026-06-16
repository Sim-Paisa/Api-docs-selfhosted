# Tokenization — Verify

Complete Easypaisa tokenization by submitting the OTP. JazzCash uses [Finalize](./finalize.md) instead of this API.

**Applies to:** Easypaisa

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/wallets/transaction/verify` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/wallets/transaction/verify` |
| **Production** | `https://wallets.simpaisa.com/v2/wallets/transaction/verify` |

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `mode` | Yes | `payin` |
| `region` | Yes | `PK` |
| `operatorId` | Yes | `100007` |
| `version` | Yes | `3.0` |

---

## Request body

| Parameter | Type | Required | Length | Description |
|-----------|------|----------|--------|-------------|
| `merchantId` | String | Yes | 07 | Simpaisa-assigned merchant ID |
| `operatorId` | String | Yes | 06 | `100007` |
| `productId` | String | Yes* | — | Simpaisa-assigned plan code |
| `amount` | String | Yes* | — | Alternative to `productId` |
| `userKey` | String | Yes | — | Same `userKey` from Initiate |
| `transactionType` | String | Yes | 01 | `8` = tokenization |
| `msisdn` | String | Yes | 10 | Customer mobile number |
| `productReference` | String | Yes | — | Product description |
| `otp` | String | Yes | 10 | OTP sent to customer's wallet |

\* Pass **`productId`** or **`amount`** (same as Initiate).

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `status` | Response code |
| `message` | Human-readable status |
| `msisdn` | Customer mobile number |
| `operatorId` | `100007` |
| `merchantId` | Your merchant ID |
| `sourceId` | **SP token** — store for [Direct Charge](./direct-charge.md) and [Delink](./delink.md) |
| `transactionId` | Simpaisa transaction ID |

{% hint style="success" %}
On success, save the `sourceId` (e.g. `sp_xxxxxxxxxxxxxxxx`). It is required for all future direct charges against this customer.
{% endhint %}

---

## Flow

Once [Initiate](./initiate.md) succeeds, an OTP is triggered on the customer's Easypaisa account. The customer approves via flash message or in-app dialog (MPIN). After approval, the initial tokenization amount is deducted and `sourceId` is returned.

---

## cURL

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/verify' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100007' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000XXX",
    "operatorId": "100007",
    "productId": "100X",
    "userKey": "XXXX",
    "transactionType": "8",
    "msisdn": "3XXXXXX",
    "productReference": "xxxx",
    "otp": "XXXX"
  }'
```

---

## Samples

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "2000XXX",
  "operatorId": "100007",
  "productId": "100X",
  "userKey": "XXXX",
  "transactionType": "8",
  "msisdn": "3XXXXXX",
  "productReference": "xxxx",
  "otp": "XXXX"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3xxxxxxxxx",
  "operatorId": "100007",
  "merchantId": "200000x",
  "sourceId": "sp_xxxxxxxxxxxxxxxx",
  "transactionId": "xxxxxxxxx"
}
```

{% endtab %}
{% endtabs %}

> The `sourceId` or SP token is used for [Direct Charge](./direct-charge.md) or [Delink](./delink.md).
