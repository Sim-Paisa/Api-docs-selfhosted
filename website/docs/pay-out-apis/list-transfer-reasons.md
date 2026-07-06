---
sidebar_position: 970
sidebar_label: "List Transfer Reasons"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Transfer Reasons

Fetch the list of transfer reason codes to pass when making an [Initiate Disbursement](pakistan/initiate-disbursement.md) call.

> **Applies to:** Pakistan

***

## Endpoint

|             |                                                 |
| ----------- | ----------------------------------------------- |
| **Method**  | `GET`                                           |
| **Path**    | `/merchants/{merchantId}/disbursements/reasons` |
| **Sandbox** | `https://sandbox.simpaisa.com`                  |

***

## Response Parameters

| Parameter  | Type   | Description                                                                   |
| ---------- | ------ | ----------------------------------------------------------------------------- |
| `id`       | Int    | Simpaisa-delegated ID for each reason, ordered sequentially                   |
| `category` | String | Reason for the funds transfer or payment, covering B2B, B2C, or C2C scenarios |
| `code`     | String | The code defining the type of disbursement taking place                       |

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location --request GET 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/reasons' \
  --header 'Content-Type: application/json'
```

</TabItem>
<TabItem value="response" label="Response">

```json
[
  {
    "id": 1,
    "category": "Category A",
    "code": "1234"
  },
  {
    "id": 3,
    "category": "Category C",
    "code": "5678"
  },
  {
    "id": 5,
    "category": "Category D",
    "code": "9999"
  }
]
```

</TabItem>
</Tabs>
