# Balance Inquiry

Fetch real-time balance information. Checking your balance before making a disbursement helps avoid on-hold transactions and lets you pre-fund the account in time.

<figure><img src="/files/q6UKvHYhaFpg5IfgiZ0e" alt=""><figcaption></figcaption></figure>

> **Applies to:** Pakistan

---

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/merchants/{merchantId}/disbursements/balance-data` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Response parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `balance-in-total` | String | The total amount of money in your account |
| `available-balance` | String | Your current balance minus the hold, with respect to your defined consumption limit |
| `balance-on-hold` | String | The balance on hold, as set by the business |
| `isoCurrencyCode` | String | The currency code, as per [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) |
| `max-amount-limit` | String | The maximum limit defined by the business for utilizing the total balance |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request GET 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/balance-data'
```

{% endtab %}
{% tab title="Response" %}

```json
{
  "balance-in-total": 1000000,
  "available-balance": 950000,
  "balance-on-hold": 5000,
  "isoCurrencyCode": "PKR",
  "max-amount-limit": 500000
}
```

{% endtab %}
{% endtabs %}
