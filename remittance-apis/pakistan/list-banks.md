# List Banks (Pakistan)

Retrieve the list of banks and wallets available for Pakistan remittance, and use the returned `bankId` in downstream remittance requests.

> **Applies to:** Pakistan

---

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/banks/listByAccountType` |
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

## Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | String | 10 | The unique identifier provided to the merchant by Simpaisa |
| `accountType` | No | String | — | `BA` for bank account, `DW` for digital wallets. Omit to fetch both. |

---

## Response Parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | String | 4 | Status code of the API response. `0000` indicates success. |
| `message` | String | 50 | Message accompanying the status |
| `bankId` | String | 5 | Bank ID of the beneficiary bank or wallet |
| `bankName` | String | 30 | Name of the bank or wallet available for remittances |
| `accountType` | String | — | `BA` for bank account, `DW` for digital wallets |
| `logoURL` | String | — | URL of the bank logo |

---

## Sample

{% tabs %}
{% tab title="Response" %}

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "bankList": [
      {
        "bankId": 12557,
        "bankName": "KBL",
        "accountType": "BA",
        "logoURL": "https://static.simpaisa.com/banks/KBL.png"
      },
      {
        "bankId": 12559,
        "bankName": "Faysal Bank Limited",
        "accountType": "BA",
        "logoURL": "https://static.simpaisa.com/banks/FAYSALBANK.png"
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}

---

For cross-region context, see [shared List Banks](../list-banks.md).
