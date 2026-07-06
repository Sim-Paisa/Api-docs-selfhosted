---
sidebar_position: 1210
sidebar_label: "List Banks"
unlisted: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Banks (Bangladesh)

Retrieve the list of banks available for Bangladesh remittance. Use the returned `bankCode` with [List Banks by Code](../list-banks-by-code.md) to resolve a usable `bankId`.

> **Applies to:** Bangladesh

---

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/banks/list` |
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

---

## Response Parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | Int | 4 | Status of the API call |
| `message` | String | 50 | Status message |
| `bankList` | Array | — | List of available banks |
| `bankName` | String | 30 | Name of the available bank |
| `bankCode` | Int | 4 | Bank code for resolving bank IDs via `list-banks-by-code` |

---

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location --request GET 'https://sandbox.simpaisa.com/remittance/{merchantId}/banks/list' \
  --header 'Content-Type: application/json'
```

</TabItem>
<TabItem value="response" label="Response">

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

</TabItem>
</Tabs>

---
