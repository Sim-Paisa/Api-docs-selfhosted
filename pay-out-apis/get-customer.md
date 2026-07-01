# Get Customer

Fetch the details of a registered customer by their customer reference.

> **Applies to:** Pakistan

***

## Endpoint

|             |                                                                                 |
| ----------- | ------------------------------------------------------------------------------- |
| **Method**  | `GET`                                                                           |
| **Path**    | `/merchants/{merchantId}/disbursements/register-customer?reference={reference}` |
| **Sandbox** | `https://sandbox.simpaisa.com`                                                  |

***

## Response parameters

| Parameter                         | Type     | Length | Description                                                                                                                                                            |
| --------------------------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reference`                       | String   | 45     | A unique reference per customer, attached to the bank or wallet account provided by the beneficiary. Used as `customerReference` in the initiate disbursement request. |
| `customerName`                    | String   | 45     | The customer's name shared by the merchant                                                                                                                             |
| `customerContact`                 | String   | 45     | The customer's contact number (mobile) with country code                                                                                                               |
| `customerEmail`                   | String   | 100    | The customer's email address                                                                                                                                           |
| `customerDob`                     | String   | 25     | The customer's date of birth, formatted as per ISO 8601                                                                                                                |
| `customerGender`                  | String   | 10     | The customer's gender — `MALE`, `FEMALE`, or `OTHER`                                                                                                                   |
| `customerAddress`                 | Object   | —      | The address of the customer                                                                                                                                            |
| `customerAddress.country`         | String   | 45     | The country of the address as an ISO 3166 Alpha-2 code                                                                                                                 |
| `customerAddress.city`            | String   | 45     | The city of the address                                                                                                                                                |
| `customerAddress.state`           | String   | 45     | The region/state of the address                                                                                                                                        |
| `customerAddress.streetAddress`   | String   | 45     | The street address                                                                                                                                                     |
| `customerAddress.postalCode`      | String   | 25     | The postal code of the address                                                                                                                                         |
| `customerAddress.landmark`        | String   | 45     | A landmark for the address                                                                                                                                             |
| `customerAddress.freeformAddress` | String   | 150    | A free-form description of the address                                                                                                                                 |
| `customerMaritalStatus`           | String   | 10     | The marital status — `SINGLE`, `MARRIED`, or `DIVORCED`                                                                                                                |
| `customerIdNumber`                | String   | 45     | The customer's national identification number                                                                                                                          |
| `customerIdExpirationDate`        | String   | 25     | The expiration date of the national ID (e.g. CNIC), formatted as per ISO 8601                                                                                          |
| `customerNtnNumber`               | String   | 15     | The national taxation number of the customer                                                                                                                           |
| `customerAccount`                 | String   | 45     | The customer's account number (IBAN or wallet) shared for disbursement                                                                                                 |
| `accountType`                     | String   | 3      | The account type — `BA` for bank accounts, `DW` for digital wallets                                                                                                    |
| `destinationBank`                 | String   | 25     | The name of the bank/wallet entity holding the customer's account                                                                                                      |
| `branchCode`                      | String   | 15     | The unique code assigned to the bank branch holding the customer's account                                                                                             |
| `createdDate`                     | Datetime | —      | The customer creation date                                                                                                                                             |

***

## Sample

{% tabs %}
{% tab title="Request" %}
```bash
curl --location --request GET \
  'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/register-customer?reference=AJDfldjlafdJADJ000' \
  --header 'Content-Type: application/json'
```
{% endtab %}

{% tab title="Response" %}
```json
{
  "customer": {
    "reference": "AJDfldjlafdJADJ000",
    "merchantId": 1561575,
    "customerName": "Alison",
    "customerContact": "923232781770",
    "customerEmail": "test@simpaisa.ae",
    "customerDob": "1994-04-08",
    "customerAddress": {},
    "customerGender": "FEMALE",
    "customerMaritalStatus": "SINGLE",
    "customerIdNumber": "4288888888888888",
    "customerIdExpirationDate": "2024-04-12",
    "customerNtnNumber": "NTN-8546",
    "customerAccount": "0605225288166",
    "accountType": "BA",
    "destinationBank": "UBL",
    "branchCode": "59322",
    "createdDate": "2021-09-30T10:31:38.000+00:00"
  }
}
```
{% endtab %}
{% endtabs %}
