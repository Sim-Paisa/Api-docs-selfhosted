# Initiate Payment

Start a wallet payment by sending an OTP to the customer's mobile wallet number. After a successful Initiate call, call [Verify](./verify.md) with the OTP to complete the charge.

**Applies to:** Easypaisa · JazzCash · HBL Konnect · Alfa

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/wallets/transaction/initiate` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/wallets/transaction/initiate` |
| **Production** | `https://wallets.simpaisa.com/v2/wallets/transaction/initiate` |

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Accept` | Yes | `text/plain, application/json, application/*+json` |
| `Content-Type` | Yes | `application/json` |
| `mode` | Yes | `payin` |
| `region` | Yes | `PK` |
| `operatorId` | Yes | Wallet operator code — see [overview](./overview.md#supported-wallets) |
| `version` | Yes | `3.0` |

---

## Request Body (common Fields)

| Parameter | Type | Required | Length | Description |
|-----------|------|----------|--------|-------------|
| `merchantId` | Int | Yes | 7 | Simpaisa-assigned merchant ID |
| `operatorId` | Int | Yes | 6 | Payment channel ID |
| `amount` | Int/Float | Yes | — | Total amount to charge |
| `userKey` | String | Yes | — | Your unique order reference |
| `transactionType` | Int | Yes | 01 | `0` = one-time payment |
| `msisdn` | Int | Yes | 10 | Customer mobile number linked to the wallet |
| `productReference` | String | Yes | — | Brief description of the product or service |

### Wallet-specific Fields

| Parameter | Wallets | Type | Length | Description |
|-----------|---------|------|--------|-------------|
| `cnic` | HBL Konnect | Int | 13 | Customer CNIC |
| `accountNumber` | Alfa | Int | 14–25 | Alfa wallet account number (distinct from MSISDN) |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `status` | Simpaisa response code — `0000` = Initiate succeeded |
| `message` | Human-readable status |
| `msisdn` | Customer mobile number |
| `operatorId` | Payment channel ID |
| `merchantId` | Your merchant ID |
| `transactionId` | Simpaisa transaction ID — store for [Inquire](./inquire.md) and refunds |

---

## Integration Steps

1. Collect wallet-specific customer details (see use cases below).
2. Call Initiate with `transactionType` = `0`.
3. On `status` = `0000`, prompt the customer for the OTP sent to their wallet number.
4. Call [Verify](./verify.md) with the same parameters plus `otp`.

{% hint style="info" %}
For Easypaisa and JazzCash, only `msisdn` is required beyond the common fields. HBL Konnect also requires `cnic`. Alfa requires `accountNumber` in addition to `msisdn`.
{% endhint %}

---

## CURL (Easypaisa)

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/initiate' \
  --header 'Accept: text/plain, application/json, application/*+json' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100007' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000XXX",
    "operatorId": "100007",
    "amount": "100",
    "userKey": "XXXX",
    "transactionType": "0",
    "msisdn": "3XXXXXX",
    "productReference": "xxxx"
  }'
```

---

## Samples

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "2000XXX",
  "operatorId": "100007",
  "amount": "100",
  "userKey": "XXXX",
  "transactionType": "0",
  "msisdn": "3XXXXXX",
  "productReference": "xxxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3xxxxxxxxxx",
  "operatorId": "100007",
  "merchantId": "200000x",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

---

## Use Case: Easypaisa And JazzCash (OTP)

To charge customers on Easypaisa or JazzCash, call Initiate with the customer's `msisdn` (wallet account number). An OTP is sent to the customer's mobile wallet number, which leads to the first step of verification.

After Initiate succeeds, the customer enters the OTP on your checkout. On Easypaisa and JazzCash, the wallet then prompts for **MPIN approval** via flash message or in-app dialog — this is handled entirely by the wallet.

| Field | Easypaisa | JazzCash |
|-------|-----------|----------|
| `operatorId` | `100007` | `100008` |
| OTP length | 4 digits | 4 digits |
| MPIN required | Yes | Yes |

{% tabs %}
{% tab title="Easypaisa" %}

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/initiate' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100007' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000XXX",
    "operatorId": "100007",
    "amount": "100",
    "userKey": "XXXX",
    "transactionType": "0",
    "msisdn": "3XXXXXX",
    "productReference": "xxxx"
  }'
```

{% endtab %}

{% tab title="JazzCash" %}

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/initiate' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100008' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000XXX",
    "operatorId": "100008",
    "amount": "100",
    "userKey": "XXXX",
    "transactionType": "0",
    "msisdn": "3XXXXXX",
    "productReference": "xxxx"
  }'
```

{% endtab %}
{% endtabs %}

---

## Use Case: HBL Konnect

HBL Konnect requires the customer's **CNIC** (Computerized National Identity Card) in addition to `msisdn`. The wallet sends an OTP after Initiate. If the customer enters a valid OTP and has sufficient funds, the transaction succeeds — no MPIN step.

| Field | Value |
|-------|-------|
| `operatorId` | `100014` |
| `cnic` | 13-digit CNIC |
| OTP length | 5 digits |

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "2000XXX",
  "operatorId": "100014",
  "amount": "100",
  "userKey": "XXXX",
  "transactionType": "0",
  "msisdn": "3XXXXXX",
  "cnic": "XXXXXXXXXXXXX",
  "productReference": "xxxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3xxxxxxxxxx",
  "operatorId": "100014",
  "merchantId": "200000x",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/initiate' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100014' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000XXX",
    "operatorId": "100014",
    "amount": "100",
    "userKey": "XXXX",
    "transactionType": "0",
    "msisdn": "3XXXXXX",
    "cnic": "XXXXXXXXXXXXX",
    "productReference": "xxxx"
  }'
```

---

## Use Case: Alfa

Alfa requires both `msisdn` (customer mobile number) and `accountNumber` (the Alfa wallet account number — distinct from MSISDN).

| Field | Value |
|-------|-------|
| `operatorId` | `100012` |
| `accountNumber` | 14-digit Alfa account |
| OTP | 8-character alphanumeric, case-sensitive |

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "2000XXX",
  "operatorId": "100012",
  "amount": "100",
  "userKey": "XXXX",
  "transactionType": "0",
  "msisdn": "3XXXXXX",
  "accountNumber": "xxxxxxxxxx",
  "productReference": "xxxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3xxxxxxxxxx",
  "operatorId": "100012",
  "merchantId": "200000x",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/initiate' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100012' \
  --header 'version: 3.0' \
  --data '{
    "merchantId": "2000XXX",
    "operatorId": "100012",
    "amount": "100",
    "userKey": "XXXX",
    "transactionType": "0",
    "msisdn": "3XXXXXX",
    "accountNumber": "xxxxxxxxxx",
    "productReference": "xxxx"
  }'
```

---

## Async Flow

In async flow, you must configure a **postback/callback URL**. Simpaisa posts the final transaction result after the Verify call completes. See [overview — Async flow](./overview.md#async-flow-overview).

<figure><img src="/files/3Ho2Lnac1H5Hkj7w5c4r" alt="Async wallet payment flow"><figcaption>Async flow: Initiate → Verify (pending) → postback notification.</figcaption></figure>

The Initiate request body is identical to the synchronous OTP flow for each wallet. Async behavior is determined by your merchant configuration and the Verify step — see [Verify — Async](./verify.md#async-flow).

{% hint style="warning" %}
If the customer does not enter the OTP and leaves the payment journey, **no postback** is sent for that transaction.
{% endhint %}

### Async: Easypaisa And JazzCash

Request parameters match the standard OTP Initiate call.

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "xxxxxxx",
  "operatorId": "100007",
  "userKey": "xxxxxx",
  "msisdn": "xxxxx",
  "transactionType": "0",
  "amount": "xxxx",
  "productReference": "xxxxx-xxxx-xxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "xxxxxxxxxx",
  "operatorId": "100007",
  "merchantId": "xxxxxxxxx",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

### Async: Alfa

Include `accountNumber` as in the standard Alfa flow.

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "xxxxxxx",
  "operatorId": "100012",
  "amount": "xxxx",
  "userKey": "xxxxxx",
  "transactionType": "0",
  "msisdn": "xxxxxxx",
  "accountNumber": "xxxxxxxxxxxxx",
  "productReference": "xxxxx-xxxx-xxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "xxxxxxxxxx",
  "operatorId": "100012",
  "merchantId": "xxxxxxxxx",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

### Async: HBL Konnect

Include `cnic` as in the standard HBL Konnect flow.

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "xxxxxxx",
  "operatorId": "100014",
  "amount": "xxxx",
  "userKey": "xxxxxxx",
  "transactionType": "0",
  "msisdn": "xxxxxxxxxxxx",
  "cnic": "xxxxxxxxxxxxx",
  "productReference": "xxxxx-xxxx-xxx"
}
```

{% endtab %}

{% tab title="Successful response" %}

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "xxxxxxxxxx",
  "operatorId": "100014",
  "merchantId": "xxxxxxxxx",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}
