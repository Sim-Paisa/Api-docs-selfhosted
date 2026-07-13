---
sidebar_position: 740
sidebar_label: "Inquiry"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Inquiry

Fetch the latest status of a card payment by `reference`.

Useful for:

* Checking on a transaction after a 3DS redirect if no postback has arrived
* Retrieving `c_token` and `customer.id` (`cref_`) after a tokenization flow completes
* Confirming a direct charge's final outcome
* Reconciling authorized-but-not-yet-captured transactions

If a payment was initiated with `capture=false`, the initial status stays `Authorized` until [Capture](capture.md) is called.

---

## Endpoint

|             |                                              |
| ----------- | -------------------------------------------- |
| **Method**  | `POST`                                       |
| **Path**    | `/cards/inquiry`                             |
| **Sandbox** | `https://sandbox.simpaisa.com/cards/inquiry` |

---

## Headers

| Header         | Value                                    |
| -------------- | ---------------------------------------- |
| `client-id`    | Your Client ID (e.g. `YOUR_CLIENT_ID`) |
| `Content-Type` | `application/json`                       |
| `merchantId`   | Your unique merchant ID (e.g. `YOUR_MERCHANT_ID`)  |
| `mode`         | `cards`                                  |
| `region`       | `PK`                                     |
| `version`      | `V5`                                     |

---

## Request Body

| Parameter          | Required | Description                          |
| -------------------- | -------- | --------------------------------------- |
| `request.reference`  | Yes      | Reference of the transaction to inquire about |
| `signature`           | Yes      | RSA signature of the `request` object   |

---

## Response Body

| Parameter                                         | Description                                                         |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| `response.id`                                       | Unique payment ID                                                    |
| `response.action_id`                                | Unique action ID                                                     |
| `response.amount`                                   | Transaction amount                                                   |
| `response.currency`                                 | Currency code                                                        |
| `response.approved`                                 | Whether the payment is approved                                      |
| `response.status`                                   | `Pending`, `Authorized`, `Captured`, `Tokenized`, or `Declined`      |
| `response.response_code`                            | Transaction outcome code                                             |
| `response.response_summary`                         | Human-readable outcome                                               |
| `response.transaction_state.AUTHORIZATION_STATUS`   | `PENDING`, `SUCCESS`, or `FAILED`                                     |
| `response.transaction_state.CAPTURE_STATUS`         | `PENDING`, `SUCCESS`, or `FAILED` — absent for zero-amount tokenization |
| `response.reference`                                | Reference from the request                                            |
| `response.transaction_id`                           | Simpaisa transaction ID                                               |
| `response.c_token`                                  | Present once a tokenization or direct-charge transaction reaches a terminal state |
| `response.payment_type`                             | `onetime`, `tokenization`, or `directcharge` — absent for plain `onetime` transactions in some responses |
| `response.customer.id`                              | Simpaisa-generated `cref_`                                             |
| `signature`                                         | RSA signature of the response body                                    |

---

## Samples

<Tabs>
<TabItem value="authorization-successful-capture-pending" label="Authorization Successful, Capture Pending">

Onetime payment, `capture: "false"`, after 3DS but before [Capture](capture.md) is called:

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/inquiry' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": { "reference": "h388-1782917244521" },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_357168b8f7134d28b009ec73a0",
    "action_id": "act_24d8aa4516a8486b9ea3fada05",
    "amount": "20.0",
    "currency": "PKR",
    "approved": "true",
    "status": "Authorized",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS",
      "CAPTURE_STATUS": "PENDING"
    },
    "processed_on": "2026-07-01T14:48:02Z",
    "reference": "h388-1782917244521",
    "transaction_id": "3282"
  },
  "signature": "YOUR_SIGNATURE"
}
```

</TabItem>
<TabItem value="capture-successful" label="Capture Successful">

Same transaction, after [Capture](capture.md) has been called:

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/inquiry' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": { "reference": "h388-1782917244521" },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_357168b8f7134d28b009ec73a0",
    "action_id": "act_24d8aa4516a8486b9ea3fada05",
    "amount": "20.0",
    "currency": "PKR",
    "approved": "true",
    "status": "Captured",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS",
      "CAPTURE_STATUS": "SUCCESS"
    },
    "processed_on": "2026-07-01T14:48:02Z",
    "reference": "h388-1782917244521",
    "transaction_id": "3282"
  },
  "signature": "YOUR_SIGNATURE"
}
```

</TabItem>
<TabItem value="successful-tokenization-inquiry" label="Successful Tokenization Inquiry">

`payment_type: "tokenization"` transaction, after 3DS completion (before capture — `capture: "false"` was sent). Note `c_token` and `customer.id` (`cref_`) are now present, which they are not on the initial `Pending` response from [Payment](payment.md):

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/inquiry' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": { "reference": "tok-c1-1782917393692" },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_c2f65e33ec0b46559c4647acdf",
    "action_id": "act_9917fcea36f844bd883a848884",
    "amount": "20.0",
    "currency": "PKR",
    "approved": "true",
    "status": "Authorized",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS",
      "CAPTURE_STATUS": "PENDING"
    },
    "processed_on": "2026-07-01T14:50:52Z",
    "reference": "tok-c1-1782917393692",
    "transaction_id": "3283",
    "c_token": "ct_v1_c0091c45-a7ff-4728-88ee-834b284848fc",
    "payment_type": "tokenization",
    "customer": {
      "id": "cref_1f330571755c11f18b1702eb53",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    }
  },
  "signature": "YOUR_SIGNATURE"
}
```

After [Capture](capture.md) is called on this same reference, Inquiry returns `status: "Captured"` with `c_token` still present — the token is not lost on capture.

</TabItem>
<TabItem value="zero-amount-tokenization-inquiry" label="Zero-Amount Tokenization Inquiry">

`payment_type: "tokenization"` with `amount: "0.00"`, after 3DS. Note there is no `CAPTURE_STATUS` field at all, and `status` is `"Tokenized"` rather than `"Authorized"`:

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/inquiry' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": { "reference": "tok-c2-1782917563029" },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_f809893ff46f4266a906ac8f07",
    "action_id": "act_c321697f067a4c3393daae3062",
    "amount": "0.0",
    "currency": "PKR",
    "approved": "true",
    "status": "Tokenized",
    "response_code": "10000",
    "response_summary": "Card Saved Successfully",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS"
    },
    "processed_on": "2026-07-01T14:53:12Z",
    "reference": "tok-c2-1782917563029",
    "transaction_id": "3284",
    "c_token": "ct_v1_3513dad9-9cd5-4606-8bc6-eb5c5ef93a68",
    "payment_type": "tokenization",
    "customer": {
      "id": "cref_840bb3e4755c11f18b1702eb53",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    }
  },
  "signature": "YOUR_SIGNATURE"
}
```

Note: `customer.id` differs from the `cref_` returned by the non-zero-amount tokenization sample above, even though the request used the identical `customer.email`/`customer.phone` combination. Simpaisa's `cref_` deduplication behavior (documented elsewhere as matching on `merchantId` + email + phone) could not be confirmed in this sandbox — treat each tokenization call as potentially issuing a new `cref_` until this is verified.

</TabItem>
<TabItem value="direct-charge-inquiry" label="Direct Charge Inquiry">

`payment_type: "directcharge"`, `3ds.enabled: "true"`, `capture: "true"`, after 3DS completion. `c_token` is echoed back unchanged — no new tokenization occurs:

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/inquiry' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": { "reference": "dc3c-1782917742282" },
  "signature": "YOUR_SIGNATURE"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_8498f605f5574227bf956773e3",
    "action_id": "act_4ea1117430c241969690e5ff8e",
    "amount": "20.0",
    "currency": "PKR",
    "approved": "true",
    "status": "Captured",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS",
      "CAPTURE_STATUS": "SUCCESS"
    },
    "processed_on": "2026-07-01T14:56:40Z",
    "reference": "dc3c-1782917742282",
    "transaction_id": "3285",
    "c_token": "ct_v1_c0091c45-a7ff-4728-88ee-834b284848fc",
    "payment_type": "directcharge",
    "customer": {
      "id": "cref_1f330571755c11f18b1702eb53",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "country": "PK",
      "phone": { "number": "3336775364", "country_code": "+92" }
    }
  },
  "signature": "YOUR_SIGNATURE"
}
```

</TabItem>
</Tabs>
