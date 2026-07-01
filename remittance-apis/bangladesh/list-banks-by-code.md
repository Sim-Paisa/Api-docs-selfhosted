# List Banks By Code (Bangladesh)

Resolve branch-level `bankId` values for Bangladesh remittance by passing a `bankCode` (and optionally a routing number). Use the returned `bankId` when initiating remittance.

> **Applies to:** Bangladesh

---

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/banks/list/{bankCode}?routingNo={routingNumber}` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |
| `mode` | `remittance` |
| `region` | `BD` |
| `version` | `3.0` |

---

## Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | Int | 10 | The unique ID of a merchant provided by Simpaisa |
| `bankCode` | Yes | Int | 4 | Bank code whose branches are to be fetched |
| `routingNum` | No | Int | 9 | If provided, the API returns the direct `bankId`; if omitted, all routing entries are returned |

---

## Response Parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | Int | 4 | Status of the API call |
| `message` | String | 50 | Status message |
| `bankList` | Array | — | Bank/branch entries |
| `bankId` | Int | 5 | ID used in remittance initiation |
| `bankName` | String | 30 | Name of the available bank |
| `distName` | String | 10 | District name |
| `distCode` | Int | 3 | District code |
| `branchCode` | Int | 3 | Branch code |
| `branchName` | String | 20 | Branch name |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request GET \
  'https://sandbox.simpaisa.com/remittance/{merchantId}/banks/list/{bankCode}' \
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
        "bankId": 12481,
        "bankName": "HBL",
        "bankType": "BA",
        "distName": "Karachi",
        "distCode": "111",
        "branchCode": "001",
        "branchName": "Karachi DHA"
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}

---

For full shared reference, see [List Banks by Code](../list-banks-by-code.md).
