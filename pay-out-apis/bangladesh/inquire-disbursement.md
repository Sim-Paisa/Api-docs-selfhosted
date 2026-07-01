# Inquire Disbursement (Bangladesh)

Query a previously initiated Bangladesh payout by merchant reference to retrieve the latest transaction state.

> **Applies to:** Bangladesh

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/inquire?reference={reference}` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

## Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | Int | 10 | The unique ID of a merchant provided by Simpaisa |
| `reference` | Yes | String | 50 | The payment reference provided when initiating the disbursement |

## Response Parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `remittance` | Object | — | Details of the transaction that has been executed |
| `reference` | String | 45 | The reference provided when initiating the disbursement |
| `issueDate` | String | 20 | The date the transaction was executed |
| `currency` | String | 3 | Currency in which the transaction was executed |
| `actualAmount` | Int | 15 | The amount of the transaction |
| `deductedAmount` | Int | 15 | Amount deducted as fee or tax |
| `remitAmount` | Int | 15 | The amount received by the beneficiary |
| `state` | String | 20 | The status of the transaction |
| `comment` | String | 50 | Comment or details of the transaction status |
| `reason` | Int | 4 | The reason or purpose of the transaction |
| `remitterName` | String | 199 | Name of the remitter or sender |
| `beneficiaryName` | String | 199 | Name of the beneficiary or receiver |
| `beneficiaryAccountNo` | String | 24 | The account number of the beneficiary or receiver |
| `settlements` | Object | — | Details of fees or taxes applied on the merchant or beneficiary |

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

Canonical reference: [Inquire Disbursement](../inquire-disbursement.md)
