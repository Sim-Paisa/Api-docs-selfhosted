# Pakistan — Cards

Collect payments from customers via debit and credit cards. Cards support one-time payments, tokenization (saved card tokens), and direct charges against saved tokens.

---

## Supported Card Flows

| `payment_type` | Description |
|----------------|-------------|
| `onetime` | Regular card payment |
| `tokenization` | Save a reusable `c_token` |
| `directcharge` | Charge a previously saved `c_token` |

| `source.type` | When to use |
|---------------|-------------|
| `card` | Encrypted card value in `source.card` |
| `c_token` | Saved token in `source.card` for direct charge |

- Tokenization must be initiated with `3ds.enabled=true`.
- For tokenization, `capture` can be `true` or `false`.
- When tokenization completes, use the [Inquiry API](./inquiry.md) to fetch the final status and generated `c_token`, or receive the data via [Postbacks](./postbacks.md).

---

## Introduction

The integration process outlined in this guide provides a seamless connection between your system and Simpaisa card APIs. This documentation covers authentication, data formats, error handling, and security measures.

To begin integration, review these areas:

- **Security** — SSL handshake, IP whitelisting, and RSA encryption
- **Endpoints and methods** — APIs for initiating and managing card transactions
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

Process transactions based on `payment_type`:

| Flow | Input |
|------|-------|
| `onetime` | Encrypted card in `source.card` |
| `tokenization` | Encrypted card in `source.card`, `3ds.enabled=true` |
| `directcharge` | Saved token in `source.card`, `source.type=c_token` |

Once 3DS verification and capture complete, the full amount is deducted and a postback is generated. If `capture=false`, the transaction stays authorized until you call the [Capture API](./capture.md).

If no postback arrives within **40 minutes**, call the [Inquiry API](./inquiry.md) to verify status and close the transaction on your platform.

### Step 06 — UAT And Production

Conduct **User Acceptance Testing (UAT)** with the integration team. After UAT, complete the pre-production checklist. Production credentials are then generated and shared.

---

## Encryption And Authentication

### AES Card Encryption

The `card` field in the Payments API is **not plain card data** — it must be AES-encrypted and Base64-encoded before being sent. See [Card Encryption](../../../platform-reference/authentication/card-encryption.md) for the exact format and a sample encryption helper.

### RSA (digital Signature) And SHA-256

RSA and SHA-256 secure card API traffic.

- **RSA** uses asymmetric encryption — a private key (merchant) and public key (shared with Simpaisa).
- **SHA-256** produces a 256-bit hash from input of any size.

Together, RSA encrypts/signs data and SHA-256 hashes protect integrity in transit.

### Encryption For Simpaisa APIs

The merchant sends a **digital signature** with each API request. Simpaisa authenticates the client before processing.

- Exchange **RSA keys** before API calls (2048-bit, PKCS8 padding).
- Sign each request with your **RSA private key**; Simpaisa verifies with your **RSA public key**.
- Verify API **response signatures** using Simpaisa's RSA public key.

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

1. **Prepare the data** — the full request body or required fields per your integration spec.
2. **Hash the data** — SHA-256.
3. **Sign the hash** — encrypt with your RSA private key to create the digital signature.
4. **Attach the signature** — include it in the request body as `signature`.
5. **Verification** — Simpaisa decrypts with your public key and compares hashes.

---

## APIs At A Glance

| API | Method | Path | Guide |
|-----|--------|------|-------|
| Payments | `POST` | `/cards/payments` | [Payment](./payment.md) |
| Inquiry | `POST` | `/cards/inquiry` | [Inquiry](./inquiry.md) |
| Capture | `POST` | `/cards/capture` | [Capture](./capture.md) |
| Void | `POST` | `/cards-refund/reverse` | [Void](./void.md) |
| Finalize | `POST` | `/mastercard/finalize` | [Finalize](./finalize.md) |
| Refund | `POST` | `/cards-refund/reverse` | [Refunds](./refunds.md) |
| Postbacks | — | Webhook to your URL | [Postbacks](./postbacks.md) |

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
