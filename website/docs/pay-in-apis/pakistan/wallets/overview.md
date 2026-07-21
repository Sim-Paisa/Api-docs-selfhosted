---
sidebar_position: 380
sidebar_label: "Overview"
---

# Wallets

Accept one-time and tokenized payments from Pakistan's major mobile wallets through Simpaisa's wallet APIs. Simpaisa supports **Easypaisa**, **JazzCash**, **HBL Konnect**, and **Alfa**. Tokenization (recurring charges) is available on **Easypaisa** and **JazzCash** only.

> **Not covered here:** Bangladesh, Nepal, Egypt, and Iraq use the [Unified Pay-In](../../unified-pay-in/overview.md) APIs (`/payins/payments/...`).

***

## Supported Wallets

| Wallet      | Operator ID | Transaction types      |
| ----------- | ----------- | ---------------------- |
| Easypaisa   | `100007`    | One-time, Tokenization |
| JazzCash    | `100008`    | One-time, Tokenization |
| HBL Konnect | `100014`    | One-time               |
| Alfa        | `100012`    | One-time               |

***

## Payment Flows

| Flow               | Description                                                                          | APIs                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **One-time (OTP)** | Initiate sends OTP; Verify completes payment with OTP (+ MPIN on Easypaisa/JazzCash) | Initiate → [Verify](verify/index.md)                                 |
| **Async (OTP)**    | Verify returns `Transaction-Pending`; final status via postback                      | Initiate → [Verify](verify/index.md) → Postback                      |
| **Non-OTP**        | Single Verify call (no OTP); customer approves in wallet app                         | [Verify — Non-OTP](verify/index.md#non-otp-flow) → Postback / [Inquire](inquire.md) |
| **Tokenization**   | Save wallet credentials as `sourceId`; charge later via Direct Charge                | [Tokenization](tokenization/overview.md)                                      |

### One-time Payment Journey

### Easypaisa Sample User Journey

### JazzCash Sample User Journey

***

## APIs At A Glance

| API                              | Method | Path                                     |
| -------------------------------- | ------ | ---------------------------------------- |
| Initiate Payment                 | `POST` | `/v2/wallets/transaction/initiate`       |
| Verify Payment                   | `POST` | `/v2/wallets/transaction/verify`         |
| Finalize (JazzCash tokenization) | `POST` | `/v2/wallets/transaction/finalize`       |
| Direct Charge                    | `POST` | `/v2/wallets/transaction/direct-payment` |
| Delink Account                   | `POST` | `/v2/wallets/transaction/delink`         |
| Transaction Inquiry              | `POST` | `/v2/inquire/wallet/transaction/inquiry` |
| Refund                           | `POST` | `/v3/transaction/refund`                 |

***

## Environments

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Sandbox     | `https://sandbox.simpaisa.com` |
| Production  | `https://payin.simpaisa.com` |

Refunds use a separate host — see [Refund](refund/index.md).

***

## Headers

| Header         | Value                                              | Required         |
| -------------- | -------------------------------------------------- | ---------------- |
| `Accept`       | `text/plain, application/json, application/*+json` | Yes              |
| `Content-Type` | `application/json`                                 | Yes              |
| `mode`         | `payin`                                            | Yes              |
| `region`       | `PK`                                               | Yes              |
| `operatorId`   | Operator code from table above (e.g. `100007`)     | Yes              |
| `version`      | `3.0`                                              | Yes              |
| `Request-Id`   | Unique request identifier for idempotency          | No (recommended) |

:::info
Set `operatorId` in the header **and** in the request body. They must match the wallet the customer is paying with.
:::

***

## Common Request Parameters

Parameters shared across wallet APIs. Wallet-specific fields are documented on Initiate and [Verify](verify/index.md).

| Parameter                 | Length | Type   | Description                                                         |
| ------------------------- | ------ | ------ | ------------------------------------------------------------------- |
| `merchantId`              | 07     | String | Unique ID assigned by Simpaisa to your merchant account             |
| `userKey` / `orderId`     | N/A    | String | Your order reference to track the transaction                       |
| `msisdn`                  | 10     | String | Customer mobile number linked to the wallet account                 |
| `currency`                | 03     | String | Currency code (PKR for Pakistan wallets)                            |
| `operatorId`              | 06     | String | Payment channel ID                                                  |
| `amount`                  | N/A    | String | Total amount to charge                                              |
| `transactionId`           | N/A    | String | Simpaisa-generated transaction ID (returned after Initiate)         |
| `redirectUrl`             | N/A    | String | Page where the customer sees the transaction result                 |
| `transactionType`         | 01     | String | `0` = one-time · `8` = tokenization                                 |
| `productReference`        | N/A    | String | Short description of the product or service                         |
| `otp`                     | 10     | String | One-time password sent via SMS (Verify only)                        |
| `accountNumber` / `accNo` | 25     | String | Wallet account number (Alfa)                                        |
| `cnic`                    | 13     | String | Customer CNIC (HBL Konnect)                                         |
| `mpin`                    | N/A    | String | Mobile wallet PIN — handled by the wallet app on Easypaisa/JazzCash |
| `sourceId` / `sptoken`    | N/A    | String | Simpaisa token for saved wallet credentials (tokenization)          |

### Parameter Matrix By Wallet (one-time OTP)

| Parameter          | Easypaisa | JazzCash | HBL Konnect | Alfa |
| ------------------ | :-------: | :------: | :---------: | :--: |
| `merchantId`       |     ✅     |     ✅    |      ✅      |   ✅  |
| `operatorId`       |     ✅     |     ✅    |      ✅      |   ✅  |
| `amount`           |     ✅     |     ✅    |      ✅      |   ✅  |
| `userKey`          |     ✅     |     ✅    |      ✅      |   ✅  |
| `transactionType`  |     ✅     |     ✅    |      ✅      |   ✅  |
| `msisdn`           |     ✅     |     ✅    |      ✅      |   ✅  |
| `cnic`             |     ❌     |     ❌    |      ✅      |   ❌  |
| `accountNumber`    |     ❌     |     ❌    |      ❌      |   ✅  |
| `productReference` |     ✅     |     ✅    |      ✅      |   ✅  |
| `otp` (Verify)     |     ✅     |     ✅    |      ✅      |   ✅  |

### OTP Length And Type

| Wallet      | Type                                  | Length |
| ----------- | ------------------------------------- | ------ |
| Easypaisa   | Int                                   | 04     |
| JazzCash    | Int                                   | 04     |
| HBL Konnect | Int                                   | 05     |
| Alfa        | String (alphanumeric, case-sensitive) | 08     |

### Account Number Length And Type

| Wallet      | Type | Length |
| ----------- | ---- | ------ |
| Easypaisa   | Int  | 10     |
| JazzCash    | Int  | 10     |
| HBL Konnect | Int  | 10     |
| Alfa        | Int  | 14     |

:::warning
Easypaisa and JazzCash enforce an **MPIN approval** flow handled entirely by the wallet. HBL Konnect and Alfa do not support MPIN — OTP alone completes the transaction.
:::

***

## Transaction Callbacks (IPN / Postback)

When a transaction status changes, Simpaisa sends an HTTP `POST` to your configured callback URL.

Callbacks are sent when:

* An initial transaction succeeds or fails
* A recurring or tokenized charge succeeds
* A customer unsubscribes or delinks through Simpaisa
* Payment is made against a voucher or bill number
* An **async** flow completes (after Verify returns `Transaction-Pending`)

### Sample Wallet Callback

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3097524704",
  "operatorId": "100007",
  "merchantId": "20000XX",
  "transactionId": "49068982",
  "amount": "1",
  "createdTimestamp": "2023-06-08 16:09:56.0",
  "updatedTimestamp": "2023-06-08 11:10:38.779",
  "userKey": "36937443",
  "transactionType": "0"
}
```

### Sample Refund Callback

```json
{
  "message": "Success",
  "status": "0000",
  "createdDateTime": "2023-11-17 12:47:48.561",
  "userKey": "test",
  "transactionId": 290325803,
  "merchantID": 20000xx,
  "refundAmount": 1.0,
  "operatorId": 100007,
  "mobileNo": "3336775364",
  "updateDateTime": "2023-11-17 12:47:50.244"
}
```

:::info
In async flows, the Verify response is always `Transaction-Pending` (`0037`). Use the postback (or [Inquire](inquire.md)) for the final success or failure decision.
:::

***

## Async Flow Overview

1. **Initiate** — customer enters mobile number (and wallet-specific fields) to receive OTP.
2. **Verify** — customer submits OTP; response is `Transaction-Pending`.
3. **Postback** — Simpaisa notifies your callback URL with success or failure.

If the customer abandons before entering OTP, no postback is sent. If Verify does not return `Transaction-Pending`, no postback will follow.

All four wallets support async flow. See [Verify — Async](verify/index.md#async-flow).

***

## Related Guides

| Topic               | Guide                                             |
| ------------------- | ------------------------------------------------- |
| Initiate payment    | Initiate                           |
| Verify payment      | [Verify](verify/index.md)                               |
| Transaction inquiry | [Inquire](inquire.md)                             |
| Tokenization        | [Tokenization overview](tokenization/overview.md) |
| Refunds             | [Refund](refund/index.md)                               |
