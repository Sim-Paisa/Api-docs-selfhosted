---
sidebar_position: 1030
sidebar_label: "Initiate Disbursement"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Initiate Disbursement

Create a payout request for a Bangladesh and Egypt beneficiary account or wallet.

> **Applies to:** Bangladesh, Egypt&#x20;

## Endpoint

|             |                                                 |
| ----------- | ----------------------------------------------- |
| **Method**  | `POST`                                          |
| **Path**    | `/remittance/{merchantId}/initiateDisbursement` |
| **Sandbox** | `https://sandbox.simpaisa.com`                  |

## Request Parameters

| Parameter         | Required | Type    | Length | Description                                                                                                                                                            |
| ----------------- | -------- | ------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customerName`    | Yes      | Varchar | 45     | The customer's name shared by the merchant                                                                                                                             |
| `customerContact` | Yes      | Varchar | 45     | The customer's contact number (mobile) with country code (e.g. +92, +1, +47)                                                                                           |
| `customerDob`     | No       | Varchar | 25     | The customer's date of birth, formatted as per ISO 8601                                                                                                                |
| `customerGender`  | No       | Varchar | 10     | The customer's gender — `MALE`, `FEMALE`, or `OTHER`                                                                                                                   |
| `customerAccount` | Yes      | Varchar | 45     | The customer's account number (IBAN or wallet) shared for disbursement                                                                                                 |
| `destinationBank` | Yes      | Int     | 4      | The BankID provided in the bank list                                                                                                                                   |
| `reference`       | Yes      | Varchar | 45     | A unique reference per customer, attached to the bank or wallet account provided by the beneficiary. Used as `customerReference` in the initiate disbursement request. |
| `amount`          | Yes      | Int     | 11     | The amount of money to transfer to the recipient                                                                                                                       |
| `reason`          | Yes      | Varchar | 30     | Purpose of payment or reason for the funds transfer. Pass the code from the provided list.                                                                             |

## Response Parameters

| Parameter           | Type    | Length | Description                                                                                    |
| ------------------- | ------- | ------ | ---------------------------------------------------------------------------------------------- |
| `status`            | Int     | 4      | Status of the API call                                                                         |
| `message`           | String  | 50     | Status message of the API call                                                                 |
| `reference`         | String  | 45     | The unique reference of the disbursement provided for registration of remitter and beneficiary |
| `customerReference` | Varchar | 45     | An identifier that uniquely identifies each customer                                           |
| `state`             | Varchar | 50     | The state the transaction is currently in                                                      |

## Sample

<Tabs>
<TabItem value="request" label="Request">

```bash
curl --location 'https://sandbox.simpaisa.com/remittance/{merchantId}/initiateDisbursement' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "request": {
      "customerName": "John Doe",
      "customerContact": "923097524712",
      "customerEmail": "Johndoe@gmail.com",
      "customerDob": "1951-01-01",
      "customerGender": "MALE",
      "customerAccount": "03079770870",
      "destinationBank": "12633",
      "reference": "JAZZCASHMC10",
      "amount": 5.0,
      "reason": "0130"
    },
    "signature": "OJyUDlenuIf/9sLwSS3YqFKH47rTjpwOP+kogCZq0su6fZP+z+ZdO2qGW6c7r7Ea/SCPMEySxSrWHrjZJKpct7CjxnbykiFNuMT9lGKBEmUVNN1dED5ISuURMifLtOmAiUTG+7W8srM7DEg+M45szjVhZx3XBFpyDYhSH8W90ISh4fUswRpYSLchnqT8kwNDGWXii/ZcI2qkHvddcfqgYffsw08ARM+4k586Ma5PWIPnbDcAHjKXFuDbaGQdPhH1SaSXajBrMSmgWcP5+1nngeDLcCgDfEH4Qu6n3tc5y88LirKZQDcpmsSZv+Tt0tGcW/yTYP00bIrGGSs0wGpB6g=="
  }'
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "JAZZCASHMC1023",
    "customerReference": "ref_1561600_5b38f7bf7b15441baca31d9b9f765d86",
    "state": "in_process"
  },
  "signature": "EvoTmy/dPvmjTKfqy/v3A6+HHd3YrOgyHr+odBYmW+kzRrp/ucyu1UMxpCd3PSrSjAwjk71ByLq8FmlJdeJvQw6SieptjNtv4PXJ/FJJgzdRVKfiimz1lUJGHRdhGQYnnrZd0F3CWTmtiSselBLQmOeWaXJjpUHH9ox2tQM7JbD9wISiILnqNofex6SAx8hjgJvXAxd0XqMgxmV5AZlvTvN2OUdmK5vlM+HgwnVNhh5teRRifgG9IYjO+gmBQcx3niXVrnG/zk3lOSI7ZCu6s3/DfXowy7OSdwagvwfb5b15FANs78IriPqhAxCCMS7CrI5sbXVyP8K5M8nM95XB3g=="
}
```

</TabItem>
</Tabs>
