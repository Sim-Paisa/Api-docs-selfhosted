# Pakistan — Cards

Collect payments from customers via debit and credit cards. Cards support one-time payments, card tokenization (saved `c_token` cards), zero-amount card verification, and direct charges against saved tokens — with or without a 3DS challenge.

---

## Supported Card Flows

| `payment_type` | `amount` | `source.type` | `3ds.enabled` | Description |
|-----------------|----------|----------------|----------------|-------------|
| `onetime` | > 0 | `card` | `true` | Regular one-time card payment |
| `tokenization` | > 0 | `card` | `true` | Pay once and save the card as a reusable `c_token` |
| `tokenization` | `0.00` | `card` | `true` | Save a card without charging the customer (zero-amount verification) |
| `directcharge` | > 0 | `c_token` | `true` | Charge a previously saved `c_token` with a 3DS redirect |
| `directcharge` | > 0 | `c_token` | `false` | Charge a previously saved `c_token` synchronously, no redirect |

- Tokenization must be initiated with `3ds.enabled=true` — the sandbox has no non-3DS tokenization path.
- For zero-amount tokenization, the transaction settles as `status: "Tokenized"` rather than `Authorized`/`Captured`, and has no `CAPTURE_STATUS` field. Calling [Capture](./capture.md) on it returns error `40025`.
- For direct charge, the saved card's billing/shipping address is retrieved automatically by Simpaisa — it does not need to be resubmitted.
- Direct charge identifies the customer by setting `customer.id` to the `cref_` value returned from the original tokenization — **not** a top-level `customer_id` field. A top-level or request-level `customer_id` field is rejected with `customer_required`.
- `success_url` and `failure_url` are required on every flow, including non-3DS direct charge — they are not silently ignored.
- When tokenization or direct charge completes, use the [Inquiry API](./inquiry.md) to fetch the final status and `c_token`.

---

## Introduction

The integration process outlined in this guide provides a seamless connection between your system and Simpaisa's card APIs. This documentation covers authentication, data formats, error handling, and security measures.

To begin integration, review these areas:

- **Security** — SSL handshake, IP whitelisting, and RSA encryption
- **Endpoints and methods** — APIs for initiating and managing card transactions and saved tokens
- **Request and response formats** — Expected payloads and response structures
- **Error handling** — Robust handling of failures and exceptions

To proceed with integration you need merchant credentials and a defined integration method for your platform.

---

## Collection Steps

Before using the REST APIs, understand how the flow works and which calls are made.

### Step 01 — Credentials

Obtain a **Merchant ID** and **Base URL** from the integration team. Share your **PCI DSS certificate** with the information security team.

### Step 02 — RSA Key Pair And Postback URL

Provide a **Sandbox Postback URL** and generate an **RSA key pair** (2048-bit, PKCS8 padding, SHA-256 algorithm). The merchant signs API requests with the RSA private key; Simpaisa verifies using the merchant's RSA public key. The integration team configures this against your merchant ID.

### Step 03 — Mutual SSL

Establish **2-way (mutual) SSL** authentication between your servers and Simpaisa.

### Step 04 — Card Encryption

The PCI DSS-compliant merchant converts card details to the format below and passes them in the `card` parameter. Set `source.type` to `card`. Encrypt card details with **AES** using the `secretKey` provided to the merchant. Simpaisa decrypts using the same key.

Card detail orientation:

```
<CardNumber>.<Month>.<Year>.<CVV>
```

### Step 05 — Payment Processing

Process transactions based on `payment_type`, `amount`, and `source.type` — see [Supported Card Flows](#supported-card-flows) above.

Once 3DS verification and capture complete, the full amount is deducted. If `capture=false`, the transaction stays authorized until you call the [Capture API](./capture.md).

Call the [Inquiry API](./inquiry.md) to verify status and close the transaction on your platform if you need to confirm an outcome outside of your own webhook handling.

{% hint style="warning" %}
In sandbox testing, the 3DS redirect link returned in `response.redirect` expires quickly (observed: 2-3 minutes). Complete the 3DS challenge immediately after receiving the redirect URL, or the transaction will decline with `response_code: 3501` ("Transaction link expired").
{% endhint %}

### Step 06 — UAT And Production

Conduct **User Acceptance Testing (UAT)** with the integration team. After UAT, complete the pre-production checklist. Production credentials are then generated and shared.

---

## Encryption And Authentication

### AES Card Encryption

The `card` field in the Payments API is **not plain card data** — it must be AES-encrypted and Base64-encoded before being sent. See [Card Encryption](../../../platform-reference/authentication/card-encryption.md) for the exact format and a sample encryption helper.

### RSA (Digital Signature) And SHA-256

RSA and SHA-256 secure card API traffic.

- **RSA** uses asymmetric encryption — a private key (merchant) and public key (shared with Simpaisa).
- **SHA-256** produces a 256-bit hash from input of any size.

Together, RSA signs data and SHA-256 hashes protect integrity in transit. The signature is `SHA256withRSA` (PKCS#1 v1.5), Base64-encoded, computed over the JSON-serialized `request` object only (not the outer `{request, signature}` wrapper).

### Generating RSA Keys

Generate a SHA-256 key pair with RSA 2048-bit using OpenSSL:

```bash
openssl genpkey -algorithm RSA -out PRIVATE_KEY.pem -pkeyopt rsa_keygen_bits:2048
```

Generate the public key from the private key:

```bash
openssl rsa -in PRIVATE_KEY.pem -pubout -out PUBLIC_KEY.pem
```

{% hint style="info" %}
The above is one example. Follow your technology stack or internal key-generation process.
{% endhint %}

### Signing The API Request

1. **Prepare the data** — the `request` object of the JSON body (excluding the top-level `signature` field).
2. **Serialize** — `JSON.stringify` the `request` object.
3. **Hash and sign** — SHA-256 hash, then sign with your RSA private key (PKCS#1 v1.5) to produce the digital signature.
4. **Base64-encode** the signature and attach it as the top-level `signature` field in the request body.
5. **Verification** — Simpaisa verifies with your public key; verify Simpaisa's response signatures with Simpaisa's RSA public key.

---

## APIs At A Glance

| API | Method | Path | Guide |
|-----|--------|------|-------|
| Payments | `POST` | `/cards/payments` | [Payment](./payment.md) |
| Tokens (List/Delete) | `POST` | `/cards/tokens` | [Tokens](./tokens.md) |
| Inquiry | `POST` | `/cards/inquiry` | [Inquiry](./inquiry.md) |
| Capture | `POST` | `/cards/capture` | [Capture](./capture.md) |
| Void | `POST` | `/cards-refund/reverse` | [Void](./void.md) |
| Refund | `POST` | `/cards-refund/reverse` | [Refunds](./refunds.md) |
| Postbacks | — | — | [Postbacks](./postbacks.md) |

See [Errors](./errors.md) for the full set of validation and decline error codes.

---

## Environments

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://sandbox.simpaisa.com` |

---

## Common Request Headers

All card APIs use these headers:

| Header | Value |
|--------|-------|
| `client-id` | Your Client ID (e.g. `55f840e6afoc9853`) |
| `Content-Type` | `application/json` |
| `merchantId` | Your unique merchant ID (e.g. `2000123`) |
| `mode` | `cards` |
| `region` | `PK` |
| `version` | `V5` |
