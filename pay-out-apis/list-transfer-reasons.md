# List Transfer Reasons

Fetch the list of transfer reason codes to pass when making an [Initiate Disbursement](./initiate-disbursement.md) call.

<figure><img src="/files/rnxUvLJ8w8zNL19Y0cXA" alt=""><figcaption></figcaption></figure>

---

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/merchants/{merchantId}/disbursements/reasons` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Response parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Int | Simpaisa-delegated ID for each reason, ordered sequentially |
| `category` | String | Reason for the funds transfer or payment, covering B2B, B2C, or C2C scenarios |
| `code` | String | The code defining the type of disbursement taking place |

---

## Sample

{% tabs %}
{% tab title="Request" %}

```bash
curl --location --request GET 'https://sandbox.simpaisa.com/merchants/{merchantId}/disbursements/reasons' \
  --header 'Content-Type: application/json'
```

{% endtab %}
{% tab title="Response" %}

```json
[
  {
    "id": 1,
    "category": "Category A",
    "code": "1234"
  },
  {
    "id": 3,
    "category": "Category C",
    "code": "5678"
  },
  {
    "id": 5,
    "category": "Category D",
    "code": "9999"
  }
]
```

{% endtab %}
{% endtabs %}
