# Initiate Disbursement

Initiate a disbursement request to a registered beneficiary through the Simpaisa platform. The fund transfer is executed with the appropriate authorization and authentication.

> **Applies to:** Pakistan

## Endpoint

|             |                                                  |
| ----------- | ------------------------------------------------ |
| **Method**  | `POST`                                           |
| **Path**    | `/merchants/{merchantId}/disbursements/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com`                   |

## Request Parameters

| Parameter           | Required | Type   | Length | Description                                                                                                                                                          |
| ------------------- | -------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reference`         | Yes      | String | 45     | A unique reference number provided by the merchant, identifying the transaction. Preserved on the Simpaisa platform for reconciliation and returned in the response. |
| `customerReference` | Yes      | String | 45     | The reference provided when registering a customer to the Simpaisa database                                                                                          |
| `amount`            | Yes      | String | 11     | The amount of money to transfer to the recipient                                                                                                                     |
| `currency`          | No       | String | 4      | The currency code of the operation, if executed in a foreign currency ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217))                                           |
| `reason`            | No       | String | 30     | Purpose of payment or reason for the funds transfer. Pass the code from the provided list.                                                                           |
| `narration`         | No       | String | 255    | Narration or remarks to reviewers, if any                                                                                                                            |

## Sample

{% tabs %}
{% tab title="Request" %}
```bash
curl --location --request POST 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/initiate' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: JSESSIONID=54DA2859F23201F2DDE1E20F6FE74E44' \
  --data-raw '{
    "request": {
      "reference": "db-55-92",
      "customerReference": "AJDfldjlafdJADJ000",
      "amount": 5000,
      "currency": "PKR",
      "reason": "0100",
      "narration": "if any"
    },
    "signature": "0x650c9f2e6701e3fe73d3054904a9a4bbdb96733f1c4c743ef573ad6ac14c5a3bf8a4731f6e6276faea5247303677fb8dbdf24ff78e53c25052cdca87eecfee85476bcb8a05cb9a1efef7cb87dd68223e117c"
  }'
```
{% endtab %}

{% tab title="Response" %}
```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "reference": "db-55-92",
    "state": "published"
  },
  "signature": "0x650c9f2e6701e3fe73d3054904a9a4bbdb96733f1c4c743ef573ad6ac14c5a3bf8a4731f6e6276faea5247303677fb8dbdf24ff78e53c25052cdca87eecfee85476bcb8a05cb9a1efef7cb87dd68223e117c"
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
The signature is generated only for the `request` and `response` sections. A request can be canceled through an [Update Disbursement](../update-disbursement.md) call against the same reference number, by passing `amount` as `0` — but only while it is in the `in_review` state.
{% endhint %}

Canonical reference: [Initiate Disbursement (Pakistan section)](../initiate-disbursement.md#pakistan)
