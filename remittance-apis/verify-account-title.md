# Verify Account Title

Verify the account title of a beneficiary before initiating a remittance. This validation ensures the remittance is sent to a valid, active bank account, reducing failures caused by incorrect or inactive account details. The API returns the official account title as registered with the bank, which can be cross-verified against the provided beneficiary details.

- **Remittance validation** — confirm the beneficiary's account details match the official bank records before initiating a remittance, reducing failed transactions.
- **Fraud prevention** — verifying the account title confirms the account is active and registered in the name of the intended beneficiary.
- **Account confirmation** — confirm the account is eligible to receive funds and is not inactive, blocked, or invalid.

<figure><img src="/files/IuGRN9zGtbtT5TcE0QFz" alt=""><figcaption></figcaption></figure>

> **Applies to:** Pakistan

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/remittance/{merchantId}/fetch-account` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Request parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `destinationBank` | Yes | String | 5 | The bank code (Bank ID) where the beneficiary's account is located |
| `customerAccount` | Yes | String | 24 | The beneficiary's IBAN, account number, or mobile wallet to verify |
| `merchantId` | Yes | String | 10 | The unique identifier provided to the merchant by Simpaisa |
| `signature` | Yes | String | — | RSA signature to ensure secure communication |

---

## Response parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `status` | String | 4 | Status code of the API response. `0000` indicates success. |
| `message` | String | 50 | Message accompanying the status, e.g. "Success". |
| `customerAccount` | String | 24 | The account number or IBAN of the beneficiary that was verified |
| `accountTitle` | String | 40 | The official title of the beneficiary's account as registered with the bank |
| `bankTitle` | String | 30 | The name of the bank where the beneficiary's account is located |
| `destinationBank` | String | 5 | The bank ID where the account exists |
| `signature` | String | — | RSA signature of the response for verification |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/remittance/{merchantId}/fetch-account' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "request": {
      "destinationBank": "12486",
      "customerAccount": "PK28TMFB0000000045745227"
    },
    "signature": "signature_string"
  }'
```

{% endtab %}
{% tab title="Response" %}

```json
{
  "response": {
    "status": "0000",
    "message": "Success",
    "customerAccount": "PK28TMFB0000000045745227",
    "accountTitle": "Alison Smith",
    "bankTitle": "Telenor Microfinance Bank",
    "destinationBank": "12486"
  },
  "signature": "response_signature_string"
}
```

{% endtab %}
{% endtabs %}
