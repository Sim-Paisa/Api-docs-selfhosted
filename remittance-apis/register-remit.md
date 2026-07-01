# Register Remit

`register-remit` is the first call in the **double API** remittance flow, where two APIs are used to send a remittance. This call registers the remitter and beneficiary; you then complete the transfer with [Remit Initiate (Double)](remit-initiate-double.md).

**Applies to:** Pakistan · Bangladesh

***

## Endpoint

|             |                                                |
| ----------- | ---------------------------------------------- |
| **Method**  | `POST`                                         |
| **Path**    | `/remittance/{merchantId}/register-remit-info` |
| **Sandbox** | `https://sandbox.simpaisa.com`                 |

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
| `amlStatus`               | Yes      | String | —      | AML screening status                                           |

***

## Response Parameters

| Parameter   | Type   | Length | Description                                                                    |
| ----------- | ------ | ------ | ------------------------------------------------------------------------------ |
| `status`    | String | 4      | Status of the API call                                                         |
| `message`   | String | 50     | Status message of the API call                                                 |
| `reference` | String | 45     | The unique reference provided for registration of the remitter and beneficiary |

{% hint style="info" %}
The signature is generated only for the `request` and `response` sections.
{% endhint %}

***

## Sample

{% tabs %}
{% tab title="Request" %}
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
    "purpose": "1152"
  },
  "signature": "Uy4eEfUd759CvLg80Ags6brlOmUrBPrs0mFfn6Fa8P0chY7XSjTIqTADru/eUlwRG9cFCLLVTD7V0eBPtYE1vPvS6FU09EaeaDnOfoDcb8lYQzeweBkcj0UiQ/sStsKIRfJaBlTnKnOpWUqULJV/b2SyVjujym7Fk/d4bxX1TXFSVUvxuhvYqJ7JpvQ1FimqCr0wzDYWvXEmAWGwUrU6kKyJZxat5wwK2VPvzo9ME6J85EtAPXwWyq8zuIHehiehbx58ZGTE1QLRjExqVohubXUIrM3bH5EJ88a/OID33ThtkIyACL7JZJ76jD+IQedNGqsjyK5AuSl27BcQoCSKRw=="
}
```
{% endtab %}

{% tab title="Response" %}
```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "customer122_249"
  },
  "signature": "dHxJhYpu8lQ32uRic7V54LucXAC2OR/QkoFho+ldXf0s4NZ08NQkiVhOwlKmBqMCn5v6rQB2atpFPwFW3osL5RU3C4O1lxJiI0yWiDjj0qGoiEpCz6vbxJHqJmn78WvQZ8GTIO+i8XSmHLwzq+NfiN4VnJk5VwcFyVyVk7Pyy+f3/U5Qx5UQsyAf7wgq4s6yzT4DQsym3DoIO1EsLYJcUecVltDB3yQA5T7yhuXMyADz8k6qUn98fzg+vNNS9ZenKQt0hDjgg20/W01uavtSoVcLZeUacK6tyBE1ogQ9BcyA/YZWekoeFJYUKjlYF2Lb4BtRBfVxQTOYy/3QcY+O2g=="
}
```
{% endtab %}
{% endtabs %}
