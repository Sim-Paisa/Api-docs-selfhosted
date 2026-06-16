# Inquire Payment

Retrieve the final status of a pay-in transaction after the customer returns from the wallet operator's payment page.

**Applies to:** Bangladesh · Nepal · Egypt · Iraq

Also referred to as **Finalize Payment Status** in legacy documentation.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/payins/payments/inquire` |
| **Sandbox** | `https://sandbox.simpaisa.com/payins/payments/inquire` |
| **Production** | `https://payin.simpaisa.com/payins/payments/inquire` |

---

## When to call

Call Inquire on your `successUrl` and `failureUrl` landing pages after the customer is redirected back from `payment_url`.

| Scenario | Action |
|----------|--------|
| Customer just returned from payment page | Call Inquire immediately |
| Status is `0037` (Transaction-Pending) | Customer has not finished — poll Inquire or wait for postback |
| Postback not received | Call Inquire as fallback |
| During active payment | Inquire may return `0037` — do not treat as failure |

{% hint style="warning" %}
Do not rely on the browser redirect alone. Always confirm payment server-side with Inquire (and/or postback).
{% endhint %}

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Accept` | Yes | `text/plain, application/json, application/*+json` |
| `Content-Type` | Yes | `application/json` |
| `api-token` | Yes | Merchant API token |
| `mode` | Yes | `payin` |
| `region` | Yes | `BD` · `NP` · `EG` · `IQ` |
| `operatorId` | Yes | Same operator used in [Initiate](./initiate.md) |
| `version` | Yes | `3.0` |

---

## Request body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchantId` | String | Yes | Your Simpaisa merchant ID |
| `transactionId` | String | Yes | `transactionId` from the Initiate response |

---

## Response body

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | String | Final status — `0000` = Success, `0037` = still pending |
| `message` | String | Human-readable status |
| `merchantId` | String | Echo of merchant ID |
| `userKey` | String | Your order reference from Initiate |
| `msisdn` | String | Customer mobile number |
| `amount` | String | Charged amount |
| `transactionId` | String | Echo of transaction ID |
| `operator` / `operatorId` | String | Operator used |
| `currencyCode` | String | `BDT` · `NPR` · `EGP` · `IQD` |
| `transactionType` | String | `0` = one-time payment |
| `createdTimestamp` / `createdDate` | String | Transaction created time |
| `updatedTimestamp` / `updatedDate` | String | Last status update time |

---

## Flow position

This is **step 5** in the [unified pay-in flow](./overview.md#payment-flow) (after Initiate → redirect → customer payment → return URL).

---

## Samples

{% tabs %}
{% tab title="Bangladesh" %}

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/inquire' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: BD' \
  --header 'operatorId: 10001' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "4000016",
    "transactionId": "2289"
  }'
```

**Success response**

```json
{
  "status": "0000",
  "message": "Success",
  "merchantId": "4000016",
  "userKey": "9993-MD1",
  "msisdn": "3123456789",
  "operator": "10001",
  "currencyCode": "BDT",
  "amount": "100.0",
  "transactionId": "2289",
  "createdTimestamp": "2024-08-19 14:52:22.0",
  "updatedTimestamp": "2024-08-19 14:52:37.0",
  "transactionType": "0"
}
```

{% endtab %}

{% tab title="Nepal" %}

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/inquire' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: NP' \
  --header 'operatorId: 100025' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000150",
    "transactionId": "1827"
  }'
```

{% endtab %}

{% tab title="Egypt" %}

Use `region: EG` and `operatorId: 100026`.

{% endtab %}

{% tab title="Iraq" %}

Use `region: IQ` and `operatorId: 100027`.

{% endtab %}
{% endtabs %}

---

## Related

- [Initiate Payment](./initiate.md)
- [Overview & postbacks](./overview.md)
- [Status codes](../../platform-reference/status-codes/pay-in-unified.md)
