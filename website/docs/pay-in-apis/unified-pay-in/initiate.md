---
sidebar_position: 270
sidebar_label: "Initiate"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Initiate Payment

Create a pay-in session and receive a `payment_url` to redirect the customer to the wallet operator's payment page.

**Applies to:** Bangladesh · Nepal · Egypt · Iraq

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/payins/payments/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com/payins/payments/initiate` |
| **Production** | `https://payin.simpaisa.com/payins/payments/initiate` |

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Accept` | Yes | `text/plain, application/json, application/*+json` |
| `Content-Type` | Yes | `application/json` |
| `api-token` | Yes | Merchant API token |
| `mode` | Yes | `payin` |
| `region` | Yes | `BD` · `NP` · `EG` · `IQ` |
| `operatorId` | Yes | Operator code — see [regional configuration](./overview.md#regional-configuration) |
| `version` | Yes | `3.0` |

---

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchantId` | String | Yes | Simpaisa-assigned merchant ID (7 digits) |
| `userKey` | String | Yes | Your unique order reference |
| `msisdn` | String | Yes | Customer mobile number linked to the wallet |
| `amount` | String | Yes | Amount to charge |
| `operator` | String | Yes | Operator ID (must match `operatorId` header) |
| `successUrl` | String | Yes | Redirect URL after successful payment |
| `failureUrl` | String | Yes | Redirect URL after failed payment |
| `productReference` | String | Yes | Short description of the product or service |
| `platform` | String | No | Platform identifier |
| `currencyCode` | String | No* | ISO currency — `BDT` · `NPR` · `EGP` · `IQD` |
| `transactionType` | String | No | `0` = one-time payment (default) |

\* Recommended for NP, EG, and IQ. Required for correct currency handling in those regions.

---

## Response Body

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | String | Status code — `0037` means pending (redirect customer to pay) |
| `message` | String | Human-readable status |
| `merchantId` | String | Echo of your merchant ID |
| `userKey` | String | Echo of your order reference |
| `msisdn` | String | Customer mobile number |
| `amount` | String | Transaction amount |
| `transactionId` | String | Simpaisa transaction ID — **store this** for [Inquire](./inquire.md) |
| `payment_url` | String | URL to redirect the customer to complete payment |
| `operator` | String | Operator ID used |
| `currencyCode` | String | Currency, when returned |
| `transactionType` | String | Transaction type |

---

## Integration Steps

1. Call Initiate with the correct `region`, `operatorId`, and body fields.
2. If `status` is `0037` (Transaction-Pending), redirect the customer to `payment_url`.
3. When the customer returns to `successUrl` or `failureUrl`, call [Inquire](./inquire.md) with `transactionId`.
4. Optionally handle the async [postback](./webhooks.md).

:::info
`payment_url` is returned for sandbox and production. Redirect the customer's browser (or open in WebView) immediately after a successful Initiate call.
:::

---

## Samples

<Tabs>
<TabItem value="bangladesh-bkash" label="Bangladesh — bKash">

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: BD' \
  --header 'operatorId: 10001' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "4000000",
    "operator": "10001",
    "msisdn": "1812345678",
    "amount": "20.00",
    "userKey": "order-22223452",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "Top-up"
  }'
```

**Response**

```json
{
  "status": "0037",
  "message": "Transaction-Pending",
  "merchantId": "4000000",
  "userKey": "order-22223452",
  "msisdn": "1812345678",
  "amount": "20.00",
  "transactionId": "110647",
  "payment_url": "https://sandbox.simpaisa.com/payins-redirect/110647/530818005517471744"
}
```

</TabItem>
<TabItem value="bangladesh-nagad" label="Bangladesh — Nagad">

Same request as bKash; set `operatorId` header and body `operator` to `10002`.

</TabItem>
<TabItem value="nepal-khalti" label="Nepal — Khalti">

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: NP' \
  --header 'operatorId: 100025' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000150",
    "operatorId": "100025",
    "msisdn": "9865806257",
    "amount": "10",
    "userKey": "sample-order-001",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "test1",
    "currencyCode": "NPR",
    "transactionType": "0",
    "platform": "0"
  }'
```

</TabItem>
<TabItem value="egypt-paymob" label="Egypt — Paymob">

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: EG' \
  --header 'operatorId: 100026' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000150",
    "operator": "100026",
    "msisdn": "1012345678",
    "amount": "10",
    "userKey": "sample-order-001",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "test1",
    "currencyCode": "EGP",
    "transactionType": "0",
    "platform": "0"
  }'
```

</TabItem>
<TabItem value="iraq-wayl" label="Iraq — Wayl">

```bash
curl --location 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: IQ' \
  --header 'operatorId: 100027' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "6000001",
    "operatorId": "100027",
    "msisdn": "7901234567",
    "amount": "10",
    "userKey": "sample-order-001",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "test1",
    "currencyCode": "IQD",
    "transactionType": "0"
  }'
```

</TabItem>
</Tabs>

---

## Operator Use Cases

| Operator | Region | Details |
|----------|--------|---------|
| bKash | BD | [Use case: bKash](./use-cases/bkash.md) |
| Nagad | BD | [Use case: Nagad](./use-cases/nagad.md) |
| Khalti | NP | [Use case: Khalti](./use-cases/khalti.md) |
| Paymob | EG | [Use case: Paymob](./use-cases/paymob.md) |
| Wayl | IQ | [Use case: Wayl](./use-cases/wayl.md) |

---

## Related

- [Inquire Payment](./inquire.md) — confirm final status after redirect
- [Overview](./overview.md) — flow diagram and regional table
- [Status codes](../../platform-reference/status-codes/pay-in-unified.md)
