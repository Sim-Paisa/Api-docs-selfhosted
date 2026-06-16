# Verify Payment

Complete a wallet payment after [Initiate](./initiate.md), or process a **non-OTP** payment in a single call. Pass the OTP received by the customer (OTP flows) or omit it (non-OTP flows).

**Applies to:** Easypaisa · JazzCash · HBL Konnect · Alfa

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/v2/wallets/transaction/verify` |
| **Sandbox** | `https://sandbox.simpaisa.com/v2/wallets/transaction/verify` |
| **Production** | `https://wallets.simpaisa.com/v2/wallets/transaction/verify` |

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Accept` | Yes | `text/plain, application/json, application/*+json` |
| `Content-Type` | Yes | `application/json` |
| `mode` | Yes | `payin` |
| `region` | Yes | `PK` |
| `operatorId` | Yes | Wallet operator code |
| `version` | Yes | `3.0` |
| `Request-Id` | Non-OTP | Unique request identifier for idempotency |

---

## Request body (common fields)

| Parameter | Type | Required | Length | Description |
|-----------|------|----------|--------|-------------|
| `merchantId` | Int | Yes | 7 | Simpaisa-assigned merchant ID |
| `operatorId` | Int | Yes | 6 | Payment channel ID |
| `amount` | Int/Float | Yes | — | Total amount (must match Initiate) |
| `userKey` | String | Yes | — | Same `userKey` used in Initiate |
| `transactionType` | Int | Yes | — | `0` = one-time payment |
| `msisdn` | Int | Yes | 10 | Customer mobile number |
| `productReference` | String | Yes | — | Same product reference from Initiate |
| `otp` | Int/String | OTP flows | 4–10 | OTP sent via SMS — omit for non-OTP |

### Wallet-specific fields

| Parameter | Wallets | Type | Length | Description |
|-----------|---------|------|--------|-------------|
| `cnic` | HBL Konnect | Int | 13 | Customer CNIC |
| `accountNumber` | Alfa | Int | 25 | Alfa wallet account number |

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `status` | `0000` = success (sync) · `0037` = Transaction-Pending (async / non-OTP) |
| `message` | Human-readable status |
| `msisdn` | Customer mobile number |
| `operatorId` | Payment channel ID |
| `merchantId` | Your merchant ID |
| `transactionId` | Simpaisa transaction ID |

{% hint style="warning" %}
In **async** and **non-OTP** flows, Verify returns `status` = `0037` (`Transaction-Pending`). Use the [postback](./overview.md#transaction-callbacks-ipn--postback) or [Inquire](./inquire.md) API for the final decision.
{% endhint %}

---

## Integration steps (OTP flow)

1. Call [Initiate](./initiate.md) and receive OTP on the customer's wallet.
2. Collect OTP from the customer.
3. Call Verify with the same parameters as Initiate plus `otp`.
4. On sync success (`0000`), fulfill the order. On async (`0037`), wait for postback.

---

## cURL (Easypaisa OTP)

```bash
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/verify' \
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
    "productReference": "xxxx",
    "otp": "XXXX"
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
  "productReference": "xxxx",
  "otp": "XXXX"
}
```

{% endtab %}

{% tab title="Successful response (sync)" %}

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

## Use case: Easypaisa and JazzCash (OTP)

Upon entering the OTP, the customer receives a flash message or in-app approval request to enter **MPIN**. The MPIN window is handled by the mobile wallet. After MPIN approval, the amount is deducted from the wallet account.

| Wallet | `operatorId` | OTP | MPIN |
|--------|--------------|-----|------|
| Easypaisa | `100007` | 4-digit Int | Required (wallet-handled) |
| JazzCash | `100008` | 4-digit Int | Required (wallet-handled) |

{% tabs %}
{% tab title="Easypaisa — request" %}

```json
{
  "merchantId": "2000XXX",
  "operatorId": "100007",
  "amount": "100",
  "userKey": "XXXX",
  "transactionType": "0",
  "msisdn": "3XXXXXX",
  "productReference": "xxxx",
  "otp": "1234"
}
```

{% endtab %}

{% tab title="JazzCash — request" %}

```json
{
  "merchantId": "2000XXX",
  "operatorId": "100008",
  "amount": "100",
  "userKey": "XXXX",
  "transactionType": "0",
  "msisdn": "3XXXXXX",
  "productReference": "xxxx",
  "otp": "1234"
}
```

{% endtab %}
{% endtabs %}

---

## Use case: HBL Konnect (OTP)

The customer only needs to provide the OTP to complete the transaction. There are no additional approvals in HBL Konnect.

| Field | Value |
|-------|-------|
| `operatorId` | `100014` |
| `cnic` | Required (same as Initiate) |
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
  "productReference": "xxxx",
  "otp": "12345"
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
curl --location 'https://sandbox.simpaisa.com/v2/wallets/transaction/verify' \
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
    "productReference": "xxxx",
    "otp": "12345"
  }'
```

---

## Use case: Alfa (OTP)

After Initiate, the customer receives an **alphanumeric, case-sensitive** OTP. Upon entering the correct OTP, the amount is deducted from the customer's Alfa account.

| Field | Value |
|-------|-------|
| `operatorId` | `100012` |
| `accountNumber` | Required (same as Initiate) |
| OTP | 8-character String |

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
  "productReference": "xxxx",
  "otp": "Ab12Cd34"
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

---

## Async flow

In async flow, the Verify response is **always** `Transaction-Pending` (`0037`). Final success or failure arrives via postback. If `Transaction-Pending` is not returned, no postback will be sent.

All four wallets support async Verify. Parameter sets match the synchronous OTP Verify calls for each wallet.

### Async: Easypaisa and JazzCash

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "xxxxxxx",
  "operatorId": "100007",
  "userKey": "xxxxxx",
  "msisdn": "xxxxxxxxxxx",
  "transactionType": "0",
  "amount": "xxxx",
  "productReference": "xxxxx-xxxx-xxx",
  "otp": "xxxx"
}
```

{% endtab %}

{% tab title="Response (pending)" %}

```json
{
  "status": "0037",
  "message": "Transaction-Pending",
  "msisdn": "xxxxxxxxxxx",
  "operatorId": "100007",
  "merchantId": "xxxxxxx",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

### Async: Alfa

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
  "productReference": "xxxxx-xxxx-xxx",
  "otp": "xxxx"
}
```

{% endtab %}

{% tab title="Response (pending)" %}

```json
{
  "status": "0037",
  "message": "Transaction-Pending",
  "msisdn": "xxxxxxxxxxx",
  "operatorId": "100012",
  "merchantId": "xxxxxxx",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

### Async: HBL Konnect

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
  "productReference": "xxxxx-xxxx-xxx",
  "otp": "xxxx"
}
```

{% endtab %}

{% tab title="Response (pending)" %}

```json
{
  "status": "0037",
  "message": "Transaction-Pending",
  "msisdn": "xxxxxxxxxxx",
  "operatorId": "100014",
  "merchantId": "xxxxxxx",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

---

## Non-OTP flow

Process a wallet payment **without an OTP**. The customer approves the payment in the wallet app (or via USSD). You make the final decision from the **postback/webhook** or [Inquire](./inquire.md).

{% hint style="info" %}
This is an **asynchronous** flow. Verify returns `Transaction-Pending` (`0037`) first; Simpaisa notifies you later with the final status.
{% endhint %}

### Approval window

| Wallet | Max approval time |
|--------|-------------------|
| Easypaisa | 60 seconds |
| JazzCash | 360 seconds |

### Sequence

1. User initiates payment on your checkout.
2. You call **Verify** (without `otp`).
3. Simpaisa validates the request, stores data, and forwards it to the wallet channel.
4. Simpaisa returns `Transaction-Pending` (`0037`).
5. The wallet requests customer authentication/approval (~60–360 seconds).
6. The wallet updates payment status to Simpaisa.
7. Simpaisa sends a **postback** to your callback URL with the final status.

If you do not receive a postback, call [Inquire](./inquire.md).

### User journey

<figure><img src="/files/OFElV98cpxX1jW1IkFVD" alt="Non-OTP wallet payment flow — step 1"><figcaption>Non-OTP flow: merchant calls Verify without OTP; customer approves in wallet app.</figcaption></figure>

<figure><img src="/files/YOgEDS65VEgq8jwzRUxk" alt="Non-OTP wallet payment flow — step 2"><figcaption>Non-OTP flow: Simpaisa sends postback with final transaction status.</figcaption></figure>

### Request body (non-OTP)

No `otp` field. All other fields match the standard Verify call.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchantId` | String | Yes | Your merchant ID |
| `operatorId` | String | Yes | Wallet operator ID |
| `userKey` | String | Yes | Your order reference |
| `msisdn` | String | Yes | Customer mobile number |
| `transactionType` | String | Yes | `0` for one-time payment |
| `amount` | String | Yes | Transaction amount |
| `productReference` | String | Yes | Product or service description |

### cURL (non-OTP)

```bash
curl -X POST "https://sandbox.simpaisa.com/v2/wallets/transaction/verify" \
  -H "Content-Type: application/json" \
  -H "operatorID: 100008" \
  -H "Request-Id: 341324134" \
  -H "mode: payin" \
  -H "region: PK" \
  -H "version: 3.0" \
  -d '{
    "merchantId": "2000888",
    "operatorId": "100008",
    "userKey": "1612138803922",
    "msisdn": "3219200750",
    "transactionType": "0",
    "amount": "2016.00",
    "productReference": "thunes"
  }'
```

{% tabs %}
{% tab title="Request" %}

```json
{
  "merchantId": "2000888",
  "operatorId": "100008",
  "userKey": "1612138803922",
  "msisdn": "3219200750",
  "transactionType": "0",
  "amount": "2016.00",
  "productReference": "thunes"
}
```

{% endtab %}

{% tab title="Response (pending)" %}

```json
{
  "status": "0037",
  "message": "Transaction-Pending",
  "msisdn": "xxxxxxxxxxx",
  "operatorId": "100008",
  "merchantId": "xxxxxxx",
  "transactionId": "xxxxxxx"
}
```

{% endtab %}
{% endtabs %}

### Sample webhook (final status)

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
