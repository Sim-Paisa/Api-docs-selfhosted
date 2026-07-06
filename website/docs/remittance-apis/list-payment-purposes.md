---
sidebar_position: 1090
sidebar_label: "List Payment Purposes"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List Payment Purposes

Retrieve the list of predefined payment purposes (reasons) that must be provided when initiating a remittance. Each purpose has a unique code categorizing the nature of the transaction — such as salary disbursement, vendor payments, or refunds. The correct purpose code must be included in the remittance initiation request.

* **Regulatory compliance** — providing a specific payment purpose for each transaction ensures compliance with legal and regulatory requirements.
* **Transaction classification** — purpose codes let merchants categorize and track different types of remittances, such as salary payments, vendor payments, and refunds.

> **Applies to:** Both

***

## Endpoint

|             |                                         |
| ----------- | --------------------------------------- |
| **Method**  | `GET`                                   |
| **Path**    | `/remittance/{merchantId}/reasons/list` |
| **Sandbox** | `https://sandbox.simpaisa.com`          |

***

## Request Parameters

| Parameter    | Required | Type   | Length | Description                                                |
| ------------ | -------- | ------ | ------ | ---------------------------------------------------------- |
| `merchantId` | Yes      | String | 10     | The unique identifier provided to the merchant by Simpaisa |

***

## Response Parameters

| Parameter    | Type   | Length | Description                                                                    |
| ------------ | ------ | ------ | ------------------------------------------------------------------------------ |
| `status`     | String | 4      | Status code of the API response. `0000` indicates a successful request.        |
| `message`    | String | 50     | Message accompanying the status, e.g. "Success".                               |
| `reasonList` | Array  | —      | A list of available payment reasons/purposes that can be used for remittances  |
| `id`         | String | 10     | The unique ID of the payment reason or purpose                                 |
| `category`   | String | 50     | The category or description of the payment purpose                             |
| `code`       | String | —      | The unique code associated with the payment purpose, to be used in remittances |

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location --request GET 'https://sandbox.simpaisa.com/remittance/{merchantId}/reasons/list' \
  --header 'Content-Type: application/json'
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reasonList": [
      {
        "id": 1,
        "category": "Vendor Payments",
        "code": "1001"
      },
      {
        "id": 2,
        "category": "Distributor Payments",
        "code": "1002"
      }
    ]
  }
}
```

</TabItem>
</Tabs>
