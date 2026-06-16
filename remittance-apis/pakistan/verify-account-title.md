# Verify Account Title (Pakistan)

Verify a beneficiary account title before remittance initiation. This helps prevent failed transactions caused by invalid or mismatched beneficiary details.

> **Applies to:** Pakistan

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/remittance/{merchantId}/fetch-account` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |
| `mode` | `remittance` |
| `region` | `PK` |
| `version` | `3.0` |

---

## Request parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `destinationBank` | Yes | String | 5 | Bank ID where the beneficiary account is held |
| `customerAccount` | Yes | String | 24 | Beneficiary IBAN, account number, or mobile wallet |
| `merchantId` | Yes | String | 10 | The unique identifier provided to the merchant by Simpaisa |
| `signature` | Yes | String | — | RSA request signature |

---

## Response parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | String | 4 | Status code of the API response. `0000` indicates success. |
| `message` | String | 50 | Message accompanying the status |
| `customerAccount` | String | 24 | The verified beneficiary account number/IBAN |
| `accountTitle` | String | 40 | Official account title from the destination bank |
| `bankTitle` | String | 30 | Name of the destination bank |
| `destinationBank` | String | 5 | Bank ID where the account exists |
| `signature` | String | — | Response RSA signature |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/remittance/{merchantId}/fetch-account' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "request": {
      "destinationBank": "12486",
      "customerAccount": "PK28TMFB0000000045745227"
    },
    "signature": "signature_string"
  }'
```

{% endtab %}
{% tab title="Response" %}

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "customerAccount": "PK28TMFB0000000045745227",
    "accountTitle": "Alison Smith",
    "bankTitle": "Telenor Microfinance Bank",
    "destinationBank": "12486"
  },
  "signature": "response_signature_string"
}
```

{% endtab %}
{% endtabs %}

---

For full shared reference, see [Verify Account Title](../verify-account-title.md).
