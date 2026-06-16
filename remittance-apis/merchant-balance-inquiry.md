# Merchant Balance Inquiry

Check your available balance, total balance, and any amount on hold before initiating a remittance. The response includes the total balance, the balance available for remittances, the security deposit hold, and the maximum amount allowed per transaction (if a limit is set).

<figure><img src="/files/54d8W8t4AZY9ug1DfP6Z" alt=""><figcaption></figcaption></figure>

---

## Endpoint

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/remittance/{merchantId}/balance-data` |
| **Sandbox** | `https://sandbox.simpaisa.com` |

---

## Request parameters

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | String | 10 | The unique ID of a merchant provided by Simpaisa |

---

## Response parameters

| Parameter | Type | Length | Description |
|-----------|------|--------|-------------|
| `iso-currency-code` | String | 3 | The currency code as per international standard |
| `balance-in-total` | Int | 15 | The total balance of the merchant |
| `available-balance` | Int | 15 | The balance that can be used for remittances |
| `balance-on-hold` | Int | 15 | The balance kept as a security deposit |
| `max-amount-limit` | Int | 15 | The maximum amount per remittance, if enabled |

---

## Sample

{% tabs %}
{% tab title="Response" %}

```json
{
  "response": {
    "iso-currency-code": "PKR",
    "balance-in-total": 100.0,
    "available-balance": 100.0,
    "balance-on-hold": 0.0,
    "max-amount-limit": 100.0
  }
}
```

{% endtab %}
{% endtabs %}

---

## Related

- [Remittance status codes](../platform-reference/status-codes/remittance.md)
- [Webhooks](../platform-reference/webhooks.md) — receive asynchronous remittance status updates
