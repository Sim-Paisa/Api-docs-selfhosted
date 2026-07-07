---
sidebar_position: 840
sidebar_label: "PUT"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PUT

Update the details of a registered customer on Simpaisa. The core fields — `reference`, `customerAccount`, `accountType`, and `destinationBank` — cannot be changed; this call only updates other beneficiary details.

> **Applies to:** Pakistan

***

## Endpoint

|             |                                                           |
| ----------- | --------------------------------------------------------- |
| **Method**  | `PUT`                                                     |
| **Path**    | `/merchants/{merchantId}/disbursements/register-customer` |
| **Sandbox** | `https://sandbox.simpaisa.com`                            |

***

## Request Parameters

| Parameter                         | Required | Type   | Length | Description                                                                                                                                                            |
| --------------------------------- | -------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reference`                       | Yes      | String | 45     | A unique reference per customer, attached to the bank or wallet account provided by the beneficiary. Used as `customerReference` in the initiate disbursement request. |
| `customerName`                    | Yes      | String | 45     | The customer's name shared by the merchant                                                                                                                             |
| `customerContact`                 | Yes      | String | 45     | The customer's contact number (mobile) with country code                                                                                                               |
| `customerEmail`                   | Yes      | String | 100    | The customer's email address                                                                                                                                           |
| `customerDob`                     | Yes      | String | 25     | The customer's date of birth, formatted as per ISO 8601                                                                                                                |
| `customerGender`                  | Yes      | String | 10     | The customer's gender — `MALE`, `FEMALE`, or `OTHER`                                                                                                                   |
| `customerAddress`                 | No       | Object | —      | The address of the customer                                                                                                                                            |
| `customerAddress.country`         | No       | String | 45     | The country of the address as an ISO 3166 Alpha-2 code. Required if address is provided.                                                                               |
| `customerAddress.city`            | No       | String | 45     | The city of the address                                                                                                                                                |
| `customerAddress.state`           | No       | String | 45     | The region/state of the address. Required if address is provided.                                                                                                      |
| `customerAddress.streetAddress`   | No       | String | 45     | The street address                                                                                                                                                     |
| `customerAddress.postalCode`      | No       | String | 25     | The postal code of the address                                                                                                                                         |
| `customerAddress.landmark`        | No       | String | 45     | A landmark for the address                                                                                                                                             |
| `customerAddress.freeformAddress` | No       | String | 150    | A free-form description of the address                                                                                                                                 |
| `customerMaritalStatus`           | No       | String | 10     | The marital status — `SINGLE`, `MARRIED`, or `DIVORCED`                                                                                                                |
| `customerIdNumber`                | No       | String | 45     | The customer's national identification number                                                                                                                          |
| `customerIdExpirationDate`        | No       | String | 25     | The expiration date of the national ID (e.g. CNIC), formatted as per ISO 8601                                                                                          |
| `customerNtnNumber`               | No       | String | 15     | The national taxation number of the customer                                                                                                                           |
| `customerAccount`                 | Yes      | String | 45     | The customer's account number (IBAN or wallet) shared for disbursement                                                                                                 |
| `accountType`                     | Yes      | String | 3      | The account type — `BA` for bank accounts, `DW` for digital wallets (e.g. Easypaisa)                                                                                   |
| `destinationBank`                 | Yes      | String | 25     | The name of the bank/wallet entity holding the customer's account                                                                                                      |
| `branchCode`                      | No       | String | 15     | The unique code assigned to the bank branch holding the customer's account                                                                                             |

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location --request PUT 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/register-customer' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: JSESSIONID=54DA2859F23201F2DDE1E20F6FE74E44' \
  --data-raw '{
    "request": {
      "reference": "AJDfldjlafdJADJ000",
      "customerName": "John Doe",
      "customerContact": "923000000000",
      "customerEmail": "f6990600-3f30-4a55-b45b-ebad0524b1a1@simpaisa.com",
      "customerDob": "1989-12-19",
      "customerGender": "MALE",
      "customerAddress": {
        "country": "PK",
        "city": "PK",
        "state": "Sindh",
        "streetAddress": "Steet 1c",
        "postalCode": "75600",
        "landmark": "Leaning tower of Pisa",
        "freeformAddress": "123 Main"
      },
      "customerMaritalStatus": "SINGLE",
      "customerIdNumber": "4288888888888888",
      "customerIdExpirationDate": "2024-04-12",
      "customerNtnNumber": "NTN-8546",
      "branchCode": "646416"
    },
    "signature": "0x650c9f2e6701e3fe73d3054904a9a4bbdb96733f1c4c743ef573ad6ac14c5a3bf8a4731f6e6276faea5247303677fb8dbdf24ff78e53c25052cdca87eecfee85476bcb8a05cb9a1efef7cb87dd68223e117ce800ac46177172544757a487be32f5ab8fe0879fa8add78be465ea8f8d5acf977e9f1ae36d4d47816ea6ed41372b"
  }'
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "AJDfldjlafdJADJ000"
  },
  "signature": "R0My/I2+JiJQLmA22hORQ1SlZqwk1P3Au4w7If3oZRVKv1BnRYMHNgp1q3xuua0DdG3Y962qpw9JrV3eksamVGE49Jp5VzAKhsqHIPvmXPOIdfHkSULilwab8FFTAulCiXUbLpjWg+5R4Q73szPvDlIfgdgWHVw4INHRFuS3eBKzkMbZkBM3laS9SFELqsF4tHUbeC2WJej2qJ/vzBYyc1UlkHZCB/4TkNIwxEAEnwNWK2BvEn8wKXoYbWEWfOM57ogZ7ya5OotX4O6wZRCEdhiiUXy2QseE/UrzepWjJY7F8XOntLuJLnPpMVpXzx3YKnD9/YVIxB1onQcpibHxBQ=="
}
```

</TabItem>
</Tabs>

:::info
The signature is generated only for the `request` and `response` sections.
:::
