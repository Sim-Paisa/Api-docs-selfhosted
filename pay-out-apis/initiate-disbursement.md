# Initiate Disbursement

Initiate a disbursement request to an individual beneficiary through the Simpaisa platform. The fund transfer is executed with the appropriate authorization and authentication.

<figure><img src="/files/9U2unEq2qIKmjd7PFqpT" alt=""><figcaption></figcaption></figure>

> **Applies to:** Both
>
> **Region endpoint summary**
>
> | Region | Method | Path |
> |--------|--------|------|
> | Pakistan | `POST` | `/merchants/{merchantId}/disbursements/initiate` |
> | Bangladesh | `POST` | `/remittance/{merchantId}/initiateDisbursement` |

---

## Pakistan

### Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/merchants/{merchantId}/disbursements/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

### Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `reference` | Yes | String | 45 | A unique reference number provided by the merchant, identifying the transaction. Preserved on the Simpaisa platform for reconciliation and returned in the response. |
| `customerReference` | Yes | String | 45 | The reference provided when registering a customer to the Simpaisa database |
| `amount` | Yes | String | 11 | The amount of money to transfer to the recipient |
| `currency` | No | String | 4 | The currency code of the operation, if executed in a foreign currency ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)) |
| `reason` | No | String | 30 | Purpose of payment or reason for the funds transfer. Pass the code from the provided list. |
| `narration` | No | String | 255 | Narration or remarks to reviewers, if any |

### Sample

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
The signature is generated only for the `request` and `response` sections. A request can be canceled through an [Update Disbursement](./update-disbursement.md) call against the same reference number, by passing `amount` as `0` — but only while it is in the `in_review` state.
{% endhint %}

---

## Bangladesh

### Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/remittance/{merchantId}/initiateDisbursement` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

### Request Parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `customerName` | Yes | Varchar | 45 | The customer's name shared by the merchant |
| `customerContact` | Yes | Varchar | 45 | The customer's contact number (mobile) with country code (e.g. +92, +1, +47) |
| `customerDob` | No | Varchar | 25 | The customer's date of birth, formatted as per ISO 8601 |
| `customerGender` | No | Varchar | 10 | The customer's gender — `MALE`, `FEMALE`, or `OTHER` |
| `customerAccount` | Yes | Varchar | 45 | The customer's account number (IBAN or wallet) shared for disbursement |
| `destinationBank` | Yes | Int | 4 | The BankID provided in the bank list |
| `reference` | Yes | Varchar | 45 | A unique reference per customer, attached to the bank or wallet account provided by the beneficiary. Used as `customerReference` in the initiate disbursement request. |
| `amount` | Yes | Int | 11 | The amount of money to transfer to the recipient |
| `reason` | Yes | Varchar | 30 | Purpose of payment or reason for the funds transfer. Pass the code from the provided list. |

### Response Parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | Int | 4 | Status of the API call |
| `message` | String | 50 | Status message of the API call |
| `reference` | String | 45 | The unique reference of the disbursement provided for registration of remitter and beneficiary |
| `customerReference` | Varchar | 45 | An identifier that uniquely identifies each customer |
| `state` | Varchar | 50 | The state the transaction is currently in |

### Sample

{% tabs %}
{% tab title="Request" %}

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

{% endtab %}
{% tab title="Response" %}

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

{% endtab %}
{% endtabs %}
