# Async flow

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
