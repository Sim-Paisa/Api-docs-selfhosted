---
sidebar_position: 960
sidebar_label: "Fetch Account Title"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Fetch Account Title

Fetch the account title information of a customer. This is useful for checking whether a provided account is valid before initiating a disbursement.

> **Applies to:** Pakistan

***

## Endpoint

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Method**  | `POST`                                                |
| **Path**    | `/merchants/{merchantId}/disbursements/fetch-account` |
| **Sandbox** | `https://sandbox.simpaisa.com`                        |

***

## Request Parameters

| Parameter         | Required | Type   | Description                                    |
| ----------------- | -------- | ------ | ---------------------------------------------- |
| `destinationBank` | Yes      | String | The bank name as provided by the customer      |
| `customerAccount` | Yes      | String | The account number as provided by the customer |

***

## Response Parameters

| Parameter         | Type   | Description                                   |
| ----------------- | ------ | --------------------------------------------- |
| `customerAccount` | String | The account number that was provided          |
| `accountTitle`    | String | Title of the provided account (e.g. John Doe) |
| `bankTitle`       | String | The bank name where the account exists        |
| `destinationBank` | String | The bank name as provided by the customer     |
| `iban`            | String | The IBAN of the provided account              |

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/fetch-account' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: JSESSIONID=54DA2859F23201F2DDE1E20F6FE74E44' \
  --data-raw '{
    "request": {
      "destinationBank": "BAFL",
      "customerAccount": "00089521717459"
    },
    "signature": "g9TYRxajdaeriaicaclksaJJKKOPAPOA989734kaljnancmasnkarjopASHFIAEHN=="
  }'
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "customerAccount": "00089521717459",
    "accountTitle": "Alison Smith",
    "bankTitle": "Bank Alfalah Limited",
    "destinationBank": "BAFL",
    "iban": "PK00BAFL0000000089521717459"
  },
  "signature": "JHFYeioofhsjdsjnjdfhsouhsdpoioaajhdjsdhfojpCMABDFIAEHYAKSJFAO"
}
```

</TabItem>
</Tabs>

:::info
The signature is generated only for the `request` and `response` sections.
:::
