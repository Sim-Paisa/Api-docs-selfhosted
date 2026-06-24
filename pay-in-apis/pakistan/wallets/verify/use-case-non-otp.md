# Verify Payment — Non-OTP Flow

## One-time payment without OTP

This flow processes a wallet payment **without an OTP**. The customer approves the payment in the wallet app (or via USSD), and the merchant makes the final decision based on the **postback/webhook**.

{% hint style="info" %}
This is an **asynchronous** flow. The Verify API returns `Transaction-Pending` first, then Simpaisa notifies you later.
{% endhint %}

---

## Approval window

| Wallet | Maximum time to approve |
|--------|-------------------------|
| Easypaisa | 60 seconds |
| JazzCash | 360 seconds |

---

## Sequence

1. The user initiates payment on the merchant checkout.
2. The merchant calls the [Verify API](../verify.md) (without OTP).
3. Simpaisa validates the request, stores the data, and forwards it to the wallet channel.
4. Simpaisa returns a synchronous response: `Transaction-Pending` (`status = 0037`).
5. The wallet requests customer authentication/approval (~60–360 sec).
6. The wallet updates the payment status to Simpaisa.
7. Simpaisa sends a **postback/webhook** to the merchant callback URL with the final status.

If you don't receive a postback, call the [Inquire API](../inquire.md) to fetch the latest status.

---

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `operatorID` | Yes | Wallet operator code, e.g. `100008` |
| `Request-Id` | No (recommended) | Unique request identifier for idempotency |
| `mode` | Yes | `payin` |
| `region` | Yes | `PK` |
| `version` | Yes | `3.0` |

---

## Sample

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

---

## User journey

<figure><img src="/files/OFElV98cpxX1jW1IkFVD" alt=""><figcaption></figcaption></figure>

<figure><img src="/files/YOgEDS65VEgq8jwzRUxk" alt=""><figcaption></figcaption></figure>

---

## Related

- [Verify Payment](../verify.md)
- [Inquire Payment](../inquire.md)
- [Webhooks](../../../../platform-reference/webhooks.md)
- [Error handling](../../../../platform-reference/error-handling.md)
