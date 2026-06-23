# overview

Accept customer payments through mobile wallets in **Bangladesh**, **Nepal**, **Egypt**, and **Iraq** using the same two REST APIs. Regional differences are limited to **headers** (region, operator) and **operator-specific configuration**—not separate endpoints or integration patterns.

> **Not covered here:** Pakistan pay-in uses a different API surface (`/v2/wallets/...`). See [Pakistan — Wallet APIs](../pakistan/wallets/overview.md).

***

## Payment flow

All unified regions follow a **redirect-based** flow.

```mermaid
sequenceDiagram
    participant M as Merchant
    participant S as Simpaisa
    participant C as Customer
    participant W as Wallet operator

    M->>S: 1. Initiate (POST /payins/payments/initiate)
    S-->>M: transactionId + payment_url
    M->>C: 2. Redirect to payment_url
    C->>W: 3. Complete payment on operator page
    W-->>C: 4. Redirect to successUrl or failureUrl
    M->>S: 5. Inquire (POST /payins/payments/inquire)
    S-->>M: Final status
    S-->>M: 6. Postback (optional, async)
```

| Step | Action                                                        | API                                              |
| ---- | ------------------------------------------------------------- | ------------------------------------------------ |
| 1    | Create payment session                                        | [Initiate](initiate.md)                          |
| 2    | Redirect customer to `payment_url` from the Initiate response | —                                                |
| 3    | Customer pays on the wallet operator's page                   | —                                                |
| 4    | Customer lands on your `successUrl` or `failureUrl`           | —                                                |
| 5    | Confirm final status server-side                              | [Inquire](inquire.md)                            |
| 6    | Receive async notification (if configured)                    | [Webhooks](webhooks.md)                          |

{% hint style="warning" %}
Always call **Inquire** on your success/failure landing page. Do not treat the redirect alone as proof of payment. Status `0037` (Transaction-Pending) means the customer has not finished paying yet.
{% endhint %}

***

## APIs at a glance

| API              | Method | Path                        |
| ---------------- | ------ | --------------------------- |
| Initiate Payment | `POST` | `/payins/payments/initiate` |
| Inquire Payment  | `POST` | `/payins/payments/inquire`  |

***

## Environments

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | `https://payin.simpaisa.com`   |

***

## Regional configuration

Set these values per region and operator. Use the same `merchantId` in sandbox and production.

| Region     | `region` header | Currency | Operators | `operatorId` / body `operator` |
| ---------- | --------------- | -------- | --------- | ------------------------------ |
| Bangladesh | `BD`            | BDT      | bKash     | `10001`                        |
| Bangladesh | `BD`            | BDT      | Nagad     | `10002`                        |
| Nepal      | `NP`            | NPR      | Khalti    | `100025`                       |
| Egypt      | `EG`            | EGP      | Paymob    | `100026`                       |
| Iraq       | `IQ`            | IQD      | Wayl      | `100027`                       |

### Common request headers

| Header         | Value                                              | Required |
| -------------- | -------------------------------------------------- | -------- |
| `Accept`       | `text/plain, application/json, application/*+json` | Yes      |
| `Content-Type` | `application/json`                                 | Yes      |
| `api-token`    | API token issued by Simpaisa                       | Yes      |
| `mode`         | `payin`                                            | Yes      |
| `region`       | `BD` · `NP` · `EG` · `IQ`                          | Yes      |
| `operatorId`   | Operator code from table above                     | Yes      |
| `version`      | `3.0`                                              | Yes      |

{% hint style="info" %}
Pass the operator in **both** the `operatorId` header and the request body (`operator` or `operatorId` field, depending on region—see [Initiate](initiate.md) samples).
{% endhint %}

***

## Authentication

Unified pay-in regions authenticate with an **`api-token`** header or **Signature**. Simpaisa provides this token with your merchant credentials during onboarding.

For webhook setup and postback handling, see [Webhooks](./webhooks.md) and [Platform webhooks reference](../../platform-reference/webhooks.md).

***

## Operator use cases

Each operator uses the same Initiate and Inquire APIs. Examples with region-specific payloads:

| Operator | Region     | Guide                                   |
| -------- | ---------- | --------------------------------------- |
| bKash    | Bangladesh | [Use case: bKash](use-cases/bkash.md)   |
| Nagad    | Bangladesh | [Use case: Nagad](use-cases/nagad.md)   |
| Khalti   | Nepal      | [Use case: Khalti](use-cases/khalti.md) |
| Paymob   | Egypt      | [Use case: Paymob](use-cases/paymob.md) |
| Wayl     | Iraq       | [Use case: Wayl](use-cases/wayl.md)     |

***


## Status codes

See [Unified Pay-In status codes](../../platform-reference/status-codes/pay-in-unified.md).

Key codes:

| Code   | Message                    | Meaning                            |
| ------ | -------------------------- | ---------------------------------- |
| `0000` | Success                    | Payment completed                  |
| `0037` | Transaction-Pending        | Customer has not finished paying   |
| `0021` | Channel-Failed-Transaction | Operator rejected the payment      |
| `0101` | Invalid-Credential         | Check `api-token` and `merchantId` |

***

## Getting started

1. Request sandbox credentials and `api-token` from the Simpaisa integration team.
2. Configure your [postback URL](webhooks.md).
3. Implement [Initiate](initiate.md) → redirect → [Inquire](inquire.md).
4. Test each operator you plan to go live with using the use-case guides above.
5. Move to production (`payin.simpaisa.com`) after sign-off.
