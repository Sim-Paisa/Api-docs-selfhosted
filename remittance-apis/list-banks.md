# List Banks

Retrieve the list of banks and wallets available for initiating remittance requests. Use this to confirm that the beneficiary's bank is supported and to obtain the identifiers required by later calls.

> **Applies to:** Both
>
> **Region endpoint summary**
>
> | Region | Method | Path |
> |--------|--------|------|
> | Pakistan | `GET` | `/remittance/{merchantId}/banks/listByAccountType` |
> | Bangladesh | `GET` | `/remittance/{merchantId}/banks/list` |

---

## Pakistan

This API returns a comprehensive list of banks available for remittance. The `bankId` in the response must be referenced in subsequent API calls to process remittances. Merchants are encouraged to store or reference this list to confirm that the beneficiary's bank is supported.

You can optionally specify an `accountType` — `BA` for bank account or `DW` for digital wallets. If an account type is defined, the API returns only that type; if omitted, it returns the complete list of banks and wallets.

<figure><img src="/files/kqJyigbpRXiWHTwrpEMN" alt=""><figcaption></figcaption></figure>

### Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/banks/listByAccountType` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

### Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | String | 10 | The unique identifier provided to the merchant by Simpaisa |
| `accountType` | No | String | — | `BA` for bank account, `DW` for digital wallets |

### Response Parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | String | 4 | Status code of the API response. `0000` indicates success. |
| `message` | String | 50 | Message accompanying the status, e.g. "Success". |
| `bankID` | String | 5 | Bank ID of the beneficiary bank or wallet |
| `bankName` | String | 30 | Name of the bank or wallet available for remittances |
| `accountType` | String | — | `BA` for bank account, `DW` for digital wallets |
| `logoURL` | String | — | URL of the bank logo |

### Sample

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

## Bangladesh

This API returns the list of banks available for remittance. The `bankCode` in the response is used in subsequent calls — such as [List Banks by Code](./list-banks-by-code.md) — to retrieve a specific bank's ID, which is required to initiate a remittance. Merchants are advised to store or reference this list to verify that the beneficiary's bank is supported.

<figure><img src="/files/kp7mDNg9yEH6SdUn4SHV" alt=""><figcaption></figcaption></figure>

### Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/banks/list` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

### Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | Int | 10 | The unique ID of a merchant provided by Simpaisa |

### Response Parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | Int | 4 | Status of the API call |
| `message` | String | 50 | Status message of the API call |
| `bankList` | Array | — | The list of available banks on which remittance can be initiated |
| `bankName` | String | 30 | Name of the available bank |
| `bankCode` | Int | 4 | Bank code representing the available bank |

### Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request GET 'https://sandbox.simpaisa.com/remittance/{merchantId}/banks/list' \
  --header 'Content-Type: application/json'
```

{% endtab %}
{% tab title="Response" %}

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "bankList": [
      {
        "bankName": "HBL",
        "bankCode": "0001"
      },
      {
        "bankName": "Telenor Microfinance Bank",
        "bankCode": "0002"
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}
