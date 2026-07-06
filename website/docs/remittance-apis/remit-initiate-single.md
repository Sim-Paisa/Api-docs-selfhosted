---
sidebar_position: 1100
sidebar_label: "Remit Initiate Single"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Remit Initiate Single

Initiate a remittance in a single call by submitting the sender's, beneficiary's, and transaction details together. This handles the core operation of transferring funds from the sender to the beneficiary, including currency codes, bank information, and the transaction amount.

**Applies to:** Pakistan · Bangladesh. Egypt

***

## Endpoint

|             |                                           |
| ----------- | ----------------------------------------- |
| **Method**  | `POST`                                    |
| **Path**    | `/remittance/{merchantId}/remit-initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com`            |

***

## Request Parameters

| Parameter                 | Required | Type   | Length | Description                                                    |
| ------------------------- | -------- | ------ | ------ | -------------------------------------------------------------- |
| `reference`               | Yes      | String | 45     | Unique reference used to register the remitter and beneficiary |
| `remitterName`            | Yes      | String | 199    | Name of the remitter or sender                                 |
| `remitterCity`            | Yes      | String | 199    | City of the remitter or sender                                 |
| `remitterAddress`         | Yes      | String | 199    | Address of the remitter or sender                              |
| `remitterContactNo`       | Yes      | String | 20     | Contact number of the remitter or sender                       |
| `remitterCountryCode`     | Yes      | String | 4      | Country of residence of the remitter                           |
| `remitterCurrencyCode`    | Yes      | String | 4      | Currency code of the remitter                                  |
| `remitterNationalId`      | Yes      | String | 20     | National ID of the remitter or sender                          |
| `remitterNationality`     | Yes      | String | 20     | Nationality of the remitter                                    |
| `beneficiaryName`         | Yes      | String | 199    | Name of the beneficiary or receiver                            |
| `beneficiaryContactNo`    | Yes      | String | 15     | Contact number of the beneficiary                              |
| `beneficiaryAddress`      | Yes      | String | 199    | Address of the beneficiary                                     |
| `beneficiaryAccountNo`    | Yes      | String | 20     | Bank account number of the beneficiary                         |
| `beneficiaryNationalId`   | Yes      | String | 20     | National ID of the beneficiary                                 |
| `beneficiaryNationality`  | Yes      | String | 49     | Nationality of the beneficiary                                 |
| `beneficiaryBankId`       | Yes      | String | 4      | Bank ID of the beneficiary                                     |
| `relationWithBeneficiary` | Yes      | String | 20     | Relationship of the remitter to the beneficiary                |
| `amount`                  | Yes      | String | 15     | The amount to be sent or remitted                              |
| `narration`               | Yes      | String | 30     | Comments or a brief description of the remittance              |
| `purpose`                 | Yes      | String | 4      | Reason for the remittance or funds transfer                    |

***

## Response Parameters

| Parameter   | Type   | Length | Description                                                                                      |
| ----------- | ------ | ------ | ------------------------------------------------------------------------------------------------ |
| `status`    | String | 4      | Status of the API call                                                                           |
| `message`   | String | 50     | Status message of the API call                                                                   |
| `reference` | String | 45     | The unique reference of the remittance provided for registration of the remitter and beneficiary |
| `signature` | String | —      | The signature of the response body, sent by Simpaisa for validation                              |

:::info
The signature is generated only for the `request` and `response` sections.
:::

***

## Sample

<Tabs>
<TabItem value="request" label="Request">

```json
{
  "request": {
    "reference": "test-11652124231266",
    "remitterName": "Test User",
    "remitterCity": "Karachi",
    "remitterAddress": "Pakistan",
    "remitterContactNo": "55881422",
    "remitterCountryCode": "PK",
    "remitterCurrencyCode": "PKR",
    "remitterNationalId": "1111111111111",
    "remitterNationality": "Karachi",
    "beneficiaryName": "Test",
    "beneficiaryContactNo": "55881422",
    "beneficiaryAddress": "Pakistan",
    "beneficiaryAccountNo": "0001763189",
    "beneficiaryNationalId": "123456789",
    "beneficiaryNationality": "Pakistani",
    "beneficiaryBankId": "12485",
    "relationWithBeneficiary": "Brother",
    "amount": "10",
    "narration": "testing",
    "purpose": "1152"
  },
  "signature": "Uy4eEfUd759CvLg80Ags6brlOmUrBPrs0mFfn6Fa8P0chY7XSjTIqTADru/eUlwRG9cFCLLVTD7V0eBPtYE1vPvS6FU09EaeaDnOfoDcb8lYQzeweBkcj0UiQ/sStsKIRfJaBlTnKnOpWUqULJV/b2SyVjujym7Fk/d4bxX1TXFSVUvxuhvYqJ7JpvQ1FimqCr0wzDYWvXEmAWGwUrU6kKyJZxat5wwK2VPvzo9ME6J85EtAPXwWyq8zuIHehiehbx58ZGTE1QLRjExqVohubXUIrM3bH5EJ88a/OID33ThtkIyACL7JZJ76jD+IQedNGqsjyK5AuSl27BcQoCSKRw=="
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "test-11652124231266"
  },
  "signature": "0x650c9f2e6701e3fe73d3054904a9a4bbdb96733f1c4c743ef573ad6ac14c5a3bf8a4731f617c"
}
```

</TabItem>
</Tabs>
