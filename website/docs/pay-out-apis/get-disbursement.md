---
sidebar_position: 930
sidebar_label: "Get Disbursement"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Disbursement

Fetch the details of a disbursement transaction. You can look it up either by the transaction `reference` provided in the [Initiate Disbursement](pakistan/initiate-disbursement.md) call, or by the `uuid` Simpaisa assigns to every disbursement.

> **Applies to:** Pakistan

***

## Endpoint

| Lookup       | Method | Path                                                          |
| ------------ | ------ | ------------------------------------------------------------- |
| By reference | `GET`  | `/merchants/{merchantId}/disbursements?reference={reference}` |
| By UUID      | `GET`  | `/merchants/{merchantId}/disbursements?uuid={uuid}`           |

Sandbox base URL: `https://sandbox.simpaisa.com`

***

## Response Parameters

| Parameter            | Description                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `customerName`       | The customer's name shared by the merchant in the disbursement file                                                                             |
| `customerAccount`    | The customer's account number (IBAN) shared for disbursement                                                                                    |
| `issueDate`          | The date the disbursement was requested. Disbursements become available immediately after they are issued.                                      |
| `disbDate`           | The date the disbursement was completed. Available immediately after it is disbursed.                                                           |
| `currency`           | The currency used by all requests in the disbursement                                                                                           |
| `reference`          | Unique identifier defined by the merchant for the disbursement                                                                                  |
| `actualAmount`       | The amount the request was placed for, without any fees or charges                                                                              |
| `disbursedAmount`    | The final amount the beneficiary receives, after deductions                                                                                     |
| `deductedAmount`     | The amount deducted as fee or tax (can apply to the merchant and/or beneficiary depending on the business case)                                 |
| `adjustmentsWithTax` | Manual adjustments, if present; already included in the total disbursement amount                                                               |
| `state`              | State of the disbursement                                                                                                                       |
| `reason`             | Reason or purpose of the disbursement                                                                                                           |
| `comments`           | A message describing the current state of the settlement (in case of rejection, the reason for the failure)                                     |
| `settlements`        | A collection of fees applied to the merchant or customer. The list of possible deductions is shared with the business at the time of agreement. |

***

## Sample

<Tabs>
<TabItem value="request-by-reference" label="Request — by reference">

```bash
curl --location --request GET \
  'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements?reference=pay89' \
  --header 'Content-Type: application/json'
```

</TabItem>
<TabItem value="request-by-uuid" label="Request — by UUID">

```bash
curl --location --request GET \
  'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements?uuid=ac5c93b4-00f2-38bb-bf19-f66c5e291c41' \
  --header 'Content-Type: application/json'
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "disbursement": {
    "customerName": "John Doe",
    "customerAccount": "BBBBAAAAAAAAAAAAAA",
    "issueDate": "2023-07-27",
    "disbDate": "2023-07-27",
    "currency": "PKR",
    "actualAmount": 20.46,
    "disbursedAmount": 20.46,
    "deductedAmount": 20.46,
    "reference": "pay89",
    "uuid": "ac5c93b4-00f2-38bb-bf19-f66c5e291c41",
    "state": "disbursed",
    "reason": "0350",
    "comments": "Successfully Disbursed.",
    "settlements": {
      "customer": {
        "tax": "0.01"
      },
      "merchant": {
        "processingFee": "0.03"
      }
    }
  }
}
```

</TabItem>
</Tabs>
