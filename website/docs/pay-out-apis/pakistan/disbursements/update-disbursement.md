---
sidebar_position: 910
sidebar_label: "Update Disbursement"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update Disbursement

Update a disbursement request against an individual through the Simpaisa platform. A disbursement can only be updated while it is in the `publishing` or `in_review` state. The fund transfer is executed with the appropriate authorization and authentication.

> **Applies to:** Pakistan

***

## Endpoint

|             |                                                  |
| ----------- | ------------------------------------------------ |
| **Method**  | `PUT`                                            |
| **Path**    | `/merchants/{merchantId}/disbursements/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com`                   |

***

## Request Parameters

| Parameter           | Required | Type   | Length | Description                                                                                                                                                          |
| ------------------- | -------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reference`         | Yes      | String | 255    | A unique reference number provided by the merchant, identifying the transaction. Preserved on the Simpaisa platform for reconciliation and returned in the response. |
| `customerReference` | Yes      | String | 45     | The customer reference number provided when registering the customer, used to fetch the customer's disbursement details                                              |
| `amount`            | Yes      | String | 11     | The amount of money to transfer to the recipient                                                                                                                     |
| `currency`          | No       | String | 4      | The currency code of the operation, if executed in a foreign currency ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217))                                           |
| `reason`            | No       | String | 30     | Purpose of payment or reason for the funds transfer. Pass the code from the provided list.                                                                           |
| `narration`         | No       | String | 255    | Narration or remarks to reviewers, if any                                                                                                                            |

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location --request PUT 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/initiate' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: JSESSIONID=ABC05054E48504EB3880A318011EA8DF' \
  --data-raw '{
    "request": {
      "reference": "2021-07-26-047v77p",
      "customerReference": "AJDfldjlafdJADJ000",
      "amount": 100,
      "currency": "PKR",
      "reason": "0300",
      "narration": "if any"
    },
    "signature": "T4MjcQ4oP8xDa7a1I0bjqmhn8fpysNJGYlu/EF1qYnueTHF33QnF6h+MYnr16uLMUDwWlYQ6i/V7EJB7bT9ZvzhAmQAEaLGrdyyk7oyM9Adn0AgUAxkA/8uwdurtwYijP88MUui5EzRcyMNhEX0txtM8aPfHFWIIjOTT22m6qY7jXjlZ2S9QwQLkvkTUVqIsQK5suxy3XTiKh5zP2XKyIz/LnTVJaKI6V7MxOwkvWjsTbB6f03QaSDTee23BGA7nFfgjv/iiKjyLvY5YDzaRDlHB9PEuP0oZ+NcVPiFPFQaYiRgag3brP1YHmUnkI7144Y5ToXf/QyDf9nWfvIb2AA=="
  }'
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "2021-07-26-047v77p"
  },
  "signature": "Ss1ABRpDKCQ83HGvGrTgAJIG1PRYMSaC4VeYI/u46yzkSVWu3Q5ivLea7aNyUw2unjbqfxDBj69iFTgyAtM98S+wsVFCxmG6LLLplOfynTJj8YE8psKK8781iL/X5l3ZJz67V1iMmXWDDjVXZ7orgO20iRMPG3E7zQSqC4mBa81Wrr/oBDvKY2hrK8MT2mv4oDQMCpFOVNlCwXrzZUOLO2VzHXY3LW9DC/OwbD77nPnm2cK6alC7BNKsfj1t1aXiQ7mH9reP2230B4jYtn/7H/KnnJqYM95jAvTIaf78fDwSwJWcL48AzUmBDqFxbuOcRByxQnntk1n77IcRdlikTQ=="
}
```

</TabItem>
</Tabs>

:::info
The signature is generated only for the `request` and `response` sections.
:::
