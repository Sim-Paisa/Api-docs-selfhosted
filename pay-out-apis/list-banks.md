# List Banks

Fetch the list of available banks and mobile wallets on which a disbursement can be initiated.

> **Applies to:** Pakistan

***

## Endpoint

|             |                                               |
| ----------- | --------------------------------------------- |
| **Method**  | `GET`                                         |
| **Path**    | `/merchants/{merchantId}/disbursements/banks` |
| **Sandbox** | `https://sandbox.simpaisa.com`                |

***

## Response Parameters

| Parameter     | Type   | Length | Description                                                                               |
| ------------- | ------ | ------ | ----------------------------------------------------------------------------------------- |
| `code`        | String | 3      | The `destinationBank` code to use when registering a customer                             |
| `name`        | String | 255    | The complete name of the bank                                                             |
| `accountType` | String | 3      | Defines whether the account is a bank account (`BA`) or digital wallet (`DW`)             |
| `bankType`    | String | —      | Defines the kind of transaction supported (e.g. digital payment or cash over the counter) |

***

## Sample

{% tabs %}
{% tab title="Request" %}
```bash
curl --location --request GET 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/banks' \
  --header 'Content-Type: application/json'
```
{% endtab %}

{% tab title="Response" %}
```json
{
  "banks": [
    {
      "code": "ABBL",
      "name": "Al Baraka Bank Limited",
      "accountType": "BA",
      "bankType": 2
    },
    {
      "code": "ABHI",
      "name": "Abhi Finance",
      "accountType": "BA",
      "bankType": 0
    },
    {
      "code": "APNA",
      "name": "Apna Microfinance Bank",
      "accountType": "BA",
      "bankType": 0
    },
    {
      "code": "BAFL",
      "name": "Bank Alfalah Limited",
      "accountType": "BA",
      "bankType": 0
    },
    {
      "code": "BAHL",
      "name": "Bank AL Habib Limited",
      "accountType": "BA",
      "bankType": 0
    }
  ]
}
```
{% endtab %}
{% endtabs %}
