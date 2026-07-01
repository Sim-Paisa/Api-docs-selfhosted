# Inquire Hosted Page Payment Status

After the customer completes payment on the hosted page, they are redirected to your `redirectUrl`. Call this API on that landing page to show whether the transaction succeeded or failed.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/inquire` |
| **Sandbox** | `https://stg-widgetapi.simpaisa.com/inquire` |
| **Production** | `https://widgetapi.simpaisa.com/inquire` |

---

## Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |

---

## Request Body

| Parameter | Required | Type | Length | Description |
|-----------|----------|------|--------|-------------|
| `merchantId` | Yes | String | 07 | Unique merchant ID |
| `orderId` | Yes | String | N/A | Your order reference from the checkout URL |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `status` | Simpaisa response code |
| `message` | Human-readable explanation |
| `amount` | Transaction amount |
| `operator` | Operator name (e.g. Easypaisa, Jazzcash) |
| `createdDate` | Transaction creation timestamp |
| `operatorId` | Payment channel ID |
| `transactionId` | Simpaisa transaction ID |
| `merchantId` | Merchant identifier |
| `orderId` | Your order reference |

---

## Samples

### Sample Request

```json
{
    "merchantId": "xxxxxxx",
    "orderId": "xxxxx"
}
```

### Sample Response

```json
{
    "status": "xxxxxx",
    "message": "xxxxxxxxxxxxxx",
    "amount": "xxxxx",
    "operator": "xxxxxxx",
    "createdDate": "xxxxxxxxx",
    "operatorId": "xxxxxxxxx",
    "transactionId": "xxxxxxxxxx",
    "merchantId": "xxxxxxxx",
    "orderId": "xxxxxxxxx"
}
```

{% hint style="info" %}
You can call the inquire API more than once. If used while payment is still in progress, the response is **transaction-pending**.
{% endhint %}
