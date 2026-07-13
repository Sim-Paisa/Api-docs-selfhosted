---
sidebar_position: 700
sidebar_label: "Payment"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Payment

Initiate one-time card payments, card tokenization, and direct charges against saved tokens.

***

## Payment Process

Request behavior depends on `payment_type`, `source.type`, `amount`, `3ds.enabled`, and `capture`:

| `payment_type` | `amount` | Description |
| --------------- | -------- | ----------- |
| `onetime`       | > 0      | Regular card payment |
| `tokenization`  | > 0      | Pay once and save a reusable `c_token` |
| `tokenization`  | `0.00`   | Save a `c_token` with 0 charge |
| `directcharge`  | > 0      | Charge a previously saved `c_token` |

**Rules:**

* For `onetime` and `tokenization`, set `source.type=card` with an AES-encrypted card value.
* For `directcharge`, set `source.type=c_token` with a previously issued `c_token` as `source.card`.
* Tokenization must use `3ds.enabled=true` — no non-3DS tokenization path exists.
* For zero-amount tokenization (`amount: "0.00"`), the transaction settles as `status: "Tokenized"` with no `CAPTURE_STATUS` field, regardless of the `capture` value sent.
* `capture=true` captures immediately after approval; `capture=false` authorizes only — capture later with [Capture](capture.md).
* For `directcharge`, identify the customer by setting `customer.id` to the `cref_` value from the original tokenization. A top-level `customer_id` field, or a `customer_id` nested directly under `request`, is **rejected** with `error_codes: ["customer_required"]`.
* `success_url` and `failure_url` are required on every `payment_type`/`3ds.enabled` combination, including `directcharge` with `3ds.enabled=false` — omitting them is rejected with `success_url_required`/`failure_url_required`.
* For `directcharge`, Simpaisa retrieves the saved card's billing/shipping address automatically — it does not need to be resubmitted.
* Every response observed (including plain `onetime`) includes a Simpaisa-generated `customer.id` (`cref_...`). This is not exclusive to tokenization flows.
* No `tracker_id` field was observed in any response — all transactions (including tokenization and direct charge) are still identified by the numeric `transaction_id`.

***

## Endpoint

|             |                                               |
| ----------- | --------------------------------------------- |
| **Method**  | `POST`                                        |
| **Path**    | `/cards/payments`                             |
| **Sandbox** | `https://sandbox.simpaisa.com/cards/payments` |

***

## Headers

| Header         | Value                                    |
| -------------- | ---------------------------------------- |
| `client-id`    | Your Client ID (e.g. `YOUR_CLIENT_ID`) |
| `Content-Type` | `application/json`                       |
| `merchantId`   | Your unique merchant ID (e.g. `YOUR_MERCHANT_ID`)  |
| `mode`         | `cards`                                  |
| `region`       | `PK`                                     |
| `version`      | `V5`                                     |

***

## Request Body

| Parameter                                | Required                          | Description                                              |
| ----------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `request.source.type`                     | Yes                                | `card` (encrypted card, for `onetime`/`tokenization`) or `c_token` (for `directcharge`) |
| `request.source.card`                     | Yes                                | AES-encrypted card value, or a saved `c_token` for `directcharge` |
| `request.amount`                          | Yes                                | Transaction amount. `"0.00"` only valid with `payment_type: tokenization` |
| `request.currency`                        | Yes                                | Currency code, e.g. `PKR`                                |
| `request.payment_type`                    | Yes                                | `onetime`, `tokenization`, or `directcharge`             |
| `request.reference`                       | Yes                                | Unique transaction reference                             |
| `request.capture`                         | Yes                                | `true` to capture immediately; `false` to authorize only. Ignored (forced `false`) for zero-amount tokenization |
| `request.description`                     | Yes                                | Payment description                                      |
| `request.3ds.enabled`                     | Yes                                | `true` or `false` — must be `true` for tokenization      |
| `request.success_url`                     | Yes                                | Redirect URL after successful 3DS — required even when `3ds.enabled=false` |
| `request.failure_url`                     | Yes                                | Redirect URL after failed 3DS — required even when `3ds.enabled=false` |
| `request.customer.email`                  | Yes for `onetime`/`tokenization`  | Customer email                                            |
| `request.customer.name`                   | Yes for `onetime`/`tokenization`  | Customer full name                                        |
| `request.customer.country`                | Yes for `onetime`/`tokenization`  | ISO 2-letter country, e.g. `PK`                          |
| `request.customer.phone.number`           | Yes for `onetime`/`tokenization`  | Phone number without country code                        |
| `request.customer.phone.country_code`     | Yes for `onetime`/`tokenization`  | Country calling code, e.g. `+92`                         |
| `request.customer.id`                     | Yes for `directcharge`            | The `cref_` value identifying the customer who owns the `c_token`. This is how `directcharge` resolves the customer — not a top-level field |
| `request.shipping.address`                | Yes for `tokenization`            | Shipping address object, stored against the `c_token`   |
| `request.shipping.address.address_line1`  | Yes for `tokenization`            | First address line                                        |
| `request.shipping.address.city`           | Yes for `tokenization`            | City                                                       |
| `request.shipping.address.state`          | Yes for `tokenization`            | State or province                                          |
| `request.shipping.address.zip`            | Yes for `tokenization`            | Postal code                                                |
| `request.shipping.address.country`        | Yes for `tokenization`            | ISO 2-letter country                                       |
| `request.payment_ip`                      | Yes                                | IP address of the user initiating the payment              |
| `signature`                               | Yes                                | RSA signature of the `request` object                     |

See [Overview — AES encryption](overview.md#aes-card-encryption) for card encryption format.

***

## Response Body

| Parameter                                         | Description                                            |
| --------------------------------------------------- | ------------------------------------------------------- |
| `response.id`                                       | Unique payment ID                                       |
| `response.action_id`                                | Unique action ID                                        |
| `response.amount`                                   | Transaction amount                                      |
| `response.currency`                                 | Currency code                                           |
| `response.approved`                                 | Whether the payment is approved                        |
| `response.status`                                   | `Pending`, `Authorized`, `Captured`, `Tokenized`, or `Declined` |
| `response.response_code`                            | Transaction outcome code                                |
| `response.response_summary`                         | Human-readable outcome                                 |
| `response.transaction_state.AUTHORIZATION_STATUS`   | `PENDING`, `SUCCESS`, or `FAILED`                       |
| `response.transaction_state.CAPTURE_STATUS`         | `PENDING`, `SUCCESS`, or `FAILED` — absent for zero-amount tokenization |
| `response.source.id`                                | Source ID assigned by Simpaisa                          |
| `response.source.type`                              | Source type                                             |
| `response.source.billing_address`                   | Billing address (tokenization / direct charge)          |
| `response.customer.id`                              | Simpaisa-generated `cref_` — present on every flow, not just tokenization |
| `response.customer`                                 | Customer details object                                 |
| `response.shipping.address`                         | Shipping address (tokenization / direct charge)         |
| `response.processed_on`                             | ISO processing timestamp                                |
| `response.reference`                                | Reference from request                                  |
| `response.redirect`                                 | 3DS redirect URL — present when `3ds.enabled=true` and status is `Pending`; absent for non-3DS direct charge |
| `response.transaction_id`                           | Simpaisa transaction ID                                  |
| `response.c_token`                                  | Saved card token — present on the initial response for `directcharge` (echoed back); appears for tokenization only once terminal (via [Inquiry](inquiry.md) or postback, not on the initial `Pending` response) |
| `response.payment_type`                             | Payment type processed                                   |
| `signature`                                         | RSA signature of the response body                       |

***

## Samples

<Tabs>
<TabItem value="onetime" label="Onetime">

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "source": {
      "type": "card",
      "card": "ZqjFY65MpTzyPvPwNrcDVBQhsBCYvLu0JqSitYoDYTc="
    },
    "amount": "20.00",
    "currency": "PKR",
    "payment_type": "onetime",
    "reference": "h388-1782917244521",
    "capture": "false",
    "description": "Set of 3 masks",
    "3ds": { "enabled": "true" },
    "success_url": "https://your-success-url.com/",
    "failure_url": "https://your-failure-url.com/",
    "customer": {
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    },
    "payment_ip": "0:0:0:0:0:0:0:1"
  },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_1943802bec064fdb9d3c77989d",
    "action_id": "act_fda9b1dc6e544af490d728d113",
    "amount": "20.00",
    "currency": "PKR",
    "approved": "false",
    "status": "Pending",
    "response_code": "20118",
    "response_summary": "Transaction Pending",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "PENDING",
      "CAPTURE_STATUS": "PENDING"
    },
    "source": {
      "id": "src_8e5d7d9f805545aea83f069bd4",
      "type": "CARD"
    },
    "customer": {
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" },
      "id": "cref_c64e7f8e755b11f18b1702eb53"
    },
    "processed_on": "2026-07-01T14:47:28Z",
    "reference": "h388-1782917244521",
    "redirect": "https://sandbox.simpaisa.com/card/?transactionId=3282&refId=h388-1782917244521",
    "transaction_id": "3282"
  },
  "signature": "YOUR_SIGNATURE"
}
```

After completing 3DS at `response.redirect` (expires in ~2-3 minutes in sandbox), the transaction moves to `Authorized` — see [Inquiry](inquiry.md).

</TabItem>
<TabItem value="tokenization-pay-save" label="Tokenization — Pay + Save">

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "source": {
      "type": "card",
      "card": "ZqjFY65MpTzyPvPwNrcDVBQhsBCYvLu0JqSitYoDYTc="
    },
    "amount": "20.00",
    "currency": "PKR",
    "payment_type": "tokenization",
    "reference": "tok-c1-1782917393692",
    "capture": "false",
    "description": "Save card for future payments",
    "3ds": { "enabled": "true" },
    "success_url": "https://your-success-url.com/",
    "failure_url": "https://your-failure-url.com/",
    "customer": {
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    },
    "shipping": {
      "address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "payment_ip": "0:0:0:0:0:0:0:1"
  },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_772cbefa7f9442d28415fe2e55",
    "action_id": "act_5f2435be45224169989fb29a15",
    "amount": "20.00",
    "currency": "PKR",
    "approved": "false",
    "status": "Pending",
    "response_code": "20118",
    "response_summary": "Transaction Pending",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "PENDING",
      "CAPTURE_STATUS": "PENDING"
    },
    "source": {
      "id": "src_d2e3ebe2c4914b8d86d2222ec8",
      "type": "CARD",
      "billing_address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "customer": {
      "id": "cref_1f330571755c11f18b1702eb53",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    },
    "shipping": {
      "address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "processed_on": "2026-07-01T14:49:56Z",
    "reference": "tok-c1-1782917393692",
    "redirect": "https://sandbox.simpaisa.com/card/?transactionId=3283&refId=tok-c1-1782917393692",
    "transaction_id": "3283",
    "payment_type": "tokenization"
  },
  "signature": "YOUR_SIGNATURE"
}
```

After 3DS completion, [Inquiry](inquiry.md#successful-tokenization-inquiry-non-zero-amount) returns `c_token` and `customer.id` (`cref_`). Since `capture: "false"` was sent, the transaction settles as `Authorized`; call [Capture](capture.md) to move it to `Captured`. The `c_token` remains present on Inquiry after capture too.

</TabItem>
<TabItem value="tokenization-save-without-charge" label="Tokenization — Save Without Charge">

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "source": {
      "type": "card",
      "card": "ZqjFY65MpTzyPvPwNrcDVBQhsBCYvLu0JqSitYoDYTc="
    },
    "amount": "0.00",
    "currency": "PKR",
    "payment_type": "tokenization",
    "reference": "tok-c2-1782917563029",
    "capture": "false",
    "description": "Save card for future payments",
    "3ds": { "enabled": "true" },
    "success_url": "https://your-success-url.com/",
    "failure_url": "https://your-failure-url.com/",
    "customer": {
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    },
    "shipping": {
      "address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "payment_ip": "0:0:0:0:0:0:0:1"
  },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_8a84b5055170460ea61e555850",
    "action_id": "act_032004dfb9664d829a791b06da",
    "amount": "0.00",
    "currency": "PKR",
    "approved": "false",
    "status": "Pending",
    "response_code": "20118",
    "response_summary": "Transaction Pending",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "PENDING",
      "CAPTURE_STATUS": "PENDING"
    },
    "source": {
      "id": "src_74f1b53a36eb4346ad7732a1ca",
      "type": "CARD",
      "billing_address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "customer": {
      "id": "cref_840bb3e4755c11f18b1702eb53",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    },
    "shipping": {
      "address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "processed_on": "2026-07-01T14:52:46Z",
    "reference": "tok-c2-1782917563029",
    "redirect": "https://sandbox.simpaisa.com/card/?transactionId=3284&refId=tok-c2-1782917563029",
    "transaction_id": "3284",
    "payment_type": "tokenization"
  },
  "signature": "YOUR_SIGNATURE"
}
```

After 3DS completion, the transaction settles directly as `status: "Tokenized"` (no separate capture step) — see [Inquiry](inquiry.md#successful-zero-amount-tokenization-inquiry). Calling [Capture](capture.md) against this reference is rejected with `response_code: "40025"` — `"Capture is not applicable for zero-amount tokenization."`

</TabItem>
<TabItem value="direct-charge-with-3ds" label="Direct Charge With 3DS">

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "source": {
      "type": "c_token",
      "card": "ct_v1_c0091c45-a7ff-4728-88ee-834b284848fc"
    },
    "amount": "20.00",
    "currency": "PKR",
    "payment_type": "directcharge",
    "reference": "dc3c-1782917742282",
    "capture": "true",
    "description": "Direct charge with 3DS",
    "3ds": { "enabled": "true" },
    "success_url": "https://your-success-url.com/",
    "failure_url": "https://your-failure-url.com/",
    "customer": {
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" },
      "id": "cref_1f330571755c11f18b1702eb53"
    },
    "payment_ip": "0:0:0:0:0:0:0:1"
  },
  "signature": "YOUR_SIGNATURE"
}'
```

:::warning
Do **not** send a top-level `customer_id` field, and do not nest `customer_id` directly under `request` — both are rejected with `error_codes: ["customer_required"]`. The customer must be identified via `request.customer.id`.
:::

#### Response (initial — 3DS Pending)

```json
{
  "response": {
    "id": "pay_953365de4da143b696c56d7f8b",
    "action_id": "act_e77cf441f5a24a7a937b6206ad",
    "amount": "20.00",
    "currency": "PKR",
    "approved": "false",
    "status": "Pending",
    "response_code": "20118",
    "response_summary": "Transaction Pending",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "PENDING",
      "CAPTURE_STATUS": "PENDING"
    },
    "source": {
      "id": "src_6766f7f87d5f463d8b90f9aec6",
      "type": "CARD",
      "billing_address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "customer": {
      "id": "cref_1f330571755c11f18b1702eb53",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    },
    "shipping": {
      "address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "processed_on": "2026-07-01T14:55:45Z",
    "reference": "dc3c-1782917742282",
    "redirect": "https://sandbox.simpaisa.com/card/?transactionId=3285&refId=dc3c-1782917742282",
    "transaction_id": "3285",
    "payment_type": "directcharge"
  },
  "signature": "YOUR_SIGNATURE"
}
```

Note that `billing_address`/`shipping.address` are populated automatically from the token's stored data even though this request sent no `shipping` block. After 3DS completion, [Inquiry](inquiry.md#direct-charge-inquiry) shows `status: "Captured"` with `c_token` echoed back unchanged.

</TabItem>
<TabItem value="direct-charge-without-3ds" label="Direct Charge Without 3DS">

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "source": {
      "type": "c_token",
      "card": "ct_v1_c0091c45-a7ff-4728-88ee-834b284848fc"
    },
    "amount": "20.00",
    "currency": "PKR",
    "payment_type": "directcharge",
    "reference": "dc4-1782917874415",
    "capture": "true",
    "description": "Direct charge without 3DS",
    "3ds": { "enabled": "false" },
    "success_url": "https://your-success-url.com/",
    "failure_url": "https://your-failure-url.com/",
    "customer": {
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" },
      "id": "cref_1f330571755c11f18b1702eb53"
    },
    "payment_ip": "0:0:0:0:0:0:0:1"
  },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response (final — synchronous, no redirect)

```json
{
  "response": {
    "id": "pay_9170ef47f552489998f8f746b6",
    "action_id": "act_51186f96a53a4800850c60ec39",
    "amount": "20.00",
    "currency": "PKR",
    "approved": "true",
    "status": "Captured",
    "response_code": "10000",
    "response_summary": "Approved",
    "source": {
      "id": "src_be8bc8922bd747d691a7a74f94",
      "type": "CARD",
      "billing_address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "customer": {
      "id": "cref_1f330571755c11f18b1702eb53",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    },
    "shipping": {
      "address": {
        "address_line1": "123 Main Street",
        "city": "Karachi",
        "state": "SD",
        "zip": "75500",
        "country": "PK"
      }
    },
    "processed_on": "2026-07-01T14:57:56Z",
    "reference": "dc4-1782917874415",
    "transaction_id": "3286",
    "c_token": "ct_v1_c0091c45-a7ff-4728-88ee-834b284848fc",
    "payment_type": "directcharge"
  },
  "signature": "YOUR_SIGNATURE"
}
```

This is the complete, final outcome — no `redirect` field is present, and no separate postback follows. If declined, `approved: "false"` is returned with the relevant `response_code`/`response_summary`, still synchronously.

</TabItem>
</Tabs>
