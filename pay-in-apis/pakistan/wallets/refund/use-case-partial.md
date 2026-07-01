# Partial Refund

Currently supported by **Easypaisa**, **JazzCash**, and **HBL Konnect**.

The partial refund amount must not exceed the original transaction amount — for example, if a transaction of 1000 PKR took place, the partial refund must be less than 1000 PKR. The refund process is asynchronous: the final status is delivered via IPN/postback to your configured URL.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v3/transaction/refund` |

---

## Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |

---

## Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `transactionId` | Yes | String | — | Unique ID of the transaction to refund |
| `merchantId` | Yes | String | 7 | Unique ID assigned by Simpaisa to the merchant |
| `amount` | Yes | String | — | Amount to refund (must not exceed the original) |
| `transactionDate` | Yes | String | — | Original transaction date (YYYY-MM-DD) |
| `type` | Yes | String | — | Transaction type (must be `WALLETS`) |

---

## Response Parameters

| Parameter | Description |
|-----------|-------------|
| `status` | Response code indicating the result of the refund |
| `message` | Message corresponding to the status code |
| `merchantId` | Echo of the merchant ID |
| `transactionId` | Original transaction ID |
| `referenceNumber` | Unique reference number for this refund |

---

## Sample

```bash
curl --location 'https://sandbox.simpaisa.com/v3/transaction/refund' \
  --header 'Accept: text/plain, application/json, application/*+json' \
  --header 'Content-Type: application/json' \
  --data '{
    "transactionId": "95188981",
    "merchantId": "100000X",
    "amount": "1",
    "transactionDate": "2023-08-24",
    "type": "WALLETS"
  }'
```

{% tabs %}
{% tab title="Request" %}

```json
{
  "transactionId": "95188981",
  "merchantId": "100000X",
  "amount": "1",
  "transactionDate": "2023-08-24",
  "type": "WALLETS"
}
```

{% endtab %}
{% tab title="Successful response" %}

```json
{
  "status": "0135",
  "message": "Refund-Submitted",
  "merchantId": "2000347",
  "transactionId": "95188981",
  "referenceNumber": "20230831164719"
}
```

{% endtab %}
{% endtabs %}
