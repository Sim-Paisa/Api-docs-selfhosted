# Transaction Inquiry

Monitor the status and details of a remittance transaction after it has been initiated. Using a unique reference ID, you can track whether the remittance has been successfully disbursed, is in progress, or has been rejected. This supports reconciliation and provides transparency into transaction processing.

> **Applies to:** Both

***

## Endpoint

|             |                                                          |
| ----------- | -------------------------------------------------------- |
| **Method**  | `GET`                                                    |
| **Path**    | `/remittance/{merchantId}/inquire?reference={reference}` |
| **Sandbox** | `https://sandbox.simpaisa.com`                           |

***

## Request Parameters

| Parameter    | Required | Type   | Length | Description                                                    |
| ------------ | -------- | ------ | ------ | -------------------------------------------------------------- |
| `merchantId` | Yes      | String | 10     | The unique ID of a merchant provided by Simpaisa               |
| `reference`  | Yes      | String | 50     | The payment reference provided while initiating the remittance |

***

## Response Parameters

| Parameter              | Type   | Length | Description                                                       |
| ---------------------- | ------ | ------ | ----------------------------------------------------------------- |
| `remittance`           | Object | —      | Details of the remittance that has been executed                  |
| `reference`            | String | 45     | The remittance reference provided while initiating the remittance |
| `issueDate`            | String | 20     | The date when the transaction was executed                        |
| `currency`             | String | 3      | Currency in which the remittance was executed                     |
| `actualAmount`         | String | 15     | The amount of the remittance                                      |
| `deductedAmount`       | String | 15     | Amount deducted as fee or tax                                     |
| `remitAmount`          | String | 15     | The amount received by the beneficiary                            |
| `state`                | String | 20     | The status of the remittance                                      |
| `uuid`                 | String | 36     | Universally unique identifier of the remittance on Simpaisa's end |
| `comment`              | String | 50     | Comment or details of the remittance status                       |
| `reason`               | String | 4      | The reason or purpose of the remittance                           |
| `remitterName`         | String | 199    | Name of the remitter or sender                                    |
| `beneficiaryName`      | String | 199    | Name of the beneficiary or receiver                               |
| `beneficiaryAccountNo` | String | 24     | The account number of the beneficiary or receiver                 |
| `settlements`          | Object | —      | Details of fees or taxes applied on the merchant or beneficiary   |

***

## Sample

{% tabs %}
{% tab title="Request" %}
```bash
curl --location --request GET \
  'https://sandbox.simpaisa.com/remittance/{merchantId}/inquire?reference={reference}'
```
{% endtab %}

{% tab title="Response" %}
```json
{
  "remittance": {
    "reference": "test",
    "issueDate": "2024-05-15 12:41:23",
    "currency": "PKR",
    "actualAmount": 3.0,
    "deductedAmount": 4.0,
    "remitAmount": 2.0,
    "state": "rejected",
    "uuid": "007c74d5-b696-48d9-860a-65c0120a75e6",
    "comment": "Invalid-Customer-Account",
    "reason": "1152",
    "remitterName": "Hafsah",
    "beneficiaryName": "Kiran",
    "beneficiaryAccountNo": "3333061963",
    "settlements": {
      "customer": {},
      "merchant": {}
    }
  }
}
```
{% endtab %}
{% endtabs %}
