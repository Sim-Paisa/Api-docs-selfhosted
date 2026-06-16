# Tokenization — Finalize

Complete JazzCash tokenization after the customer returns from the hosted page. Call Finalize to retrieve the final payment status and `sourceId`.

**Applies to:** JazzCash

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/wallets/transaction/finalize` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/wallets/transaction/finalize` |
| **Production** | `https://wallets.simpaisa.com/v2/wallets/transaction/finalize` |

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `mode` | Yes | `payin` |
| `region` | Yes | `PK` |
| `operatorId` | Yes | `100008` |
| `version` | Yes | `3.0` |

---

## When to call

After the customer completes the [hosted page flow](./initiate.md#jazzcash--hosted-page), JazzCash redirects them to your `ReturnUrl`. Call Finalize from your return-page handler to show the final status and obtain the `sourceId`.

---

## Request body

| Parameter | Type | Required | Length | Description |
|-----------|------|----------|--------|-------------|
| `merchantId` | String | Yes | 07 | Simpaisa-assigned merchant ID |
| `operatorId` | String | Yes | 06 | `100008` |
| `orderId` | String | Yes | — | Same `OrderId` passed to the hosted page URL |

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `status` | Response code |
| `message` | Human-readable status |
| `msisdn` | Customer mobile number |
| `operatorId` | `100008` |
| `merchantId` | Your merchant ID |
| `sourceId` | **SP token** — store for [Direct Charge](./direct-charge.md) and [Delink](./delink.md) |
| `transactionId` | Simpaisa transaction ID |

{% hint style="success" %}
On success, save the `sourceId` (e.g. `sp_xxxxxxxxxxxxxxxx`). It is required for all future direct charges against this customer.
{% endhint %}

---

## cURL

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/finalize' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100008' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "xxxx",
    "operatorId": "100008",
    "orderId": "xxxx"
  }'
```

---

## Samples

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "xxxx",
  "operatorId": "100008",
  "orderId": "xxxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3xxxxxxxxx",
  "operatorId": "100008",
  "merchantId": "xxxxxxxx",
  "sourceId": "sp_xxxxxxxxxxxxxxxx",
  "transactionId": "xxxxxxxxx"
}
```

{% endtab %}
{% endtabs %}

> The `sourceId` or SP token is used for [Direct Charge](./direct-charge.md) or [Delink](./delink.md).
