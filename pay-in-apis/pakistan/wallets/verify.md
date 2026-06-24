# One Time Payment

In async flow, the Verify response is **always** `Transaction-Pending` (`0037`). Final success or failure arrives via postback. If `Transaction-Pending` is not returned, no postback will be sent.

All four wallets support async Verify. Parameter sets match the synchronous OTP Verify calls for each wallet.\
<br>

### User journey

### Request body (non-OTP)

No `otp` field. All other fields match the standard Verify call.

| Parameter          | Type   | Required | Description                    |
| ------------------ | ------ | -------- | ------------------------------ |
| `merchantId`       | String | Yes      | Your merchant ID               |
| `operatorId`       | String | Yes      | Wallet operator ID             |
| `userKey`          | String | Yes      | Your order reference           |
| `msisdn`           | String | Yes      | Customer mobile number         |
| `transactionType`  | String | Yes      | `0` for one-time payment       |
| `amount`           | String | Yes      | Transaction amount             |
| `productReference` | String | Yes      | Product or service description |

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

***

## Non-OTP flow

Process a wallet payment **without an OTP**. The customer approves the payment in the wallet app (or via USSD). You make the final decision from the **postback/webhook** or [Inquire](inquire.md).

{% hint style="info" %}
This is an **asynchronous** flow. Verify returns `Transaction-Pending` (`0037`) first; Simpaisa notifies you later with the final status.
{% endhint %}

Full flow details, headers, and a sample request/response: [Verify — Non-OTP](./verify/use-case-non-otp.md).
