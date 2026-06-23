# tokenization initiate

Start a tokenization consent flow. **Easypaisa** uses a REST Initiate call. **JazzCash** opens a hosted registration page via a GET URL.

***

## Easypaisa — REST Initiate

### Endpoint

|                |                                                                |
| -------------- | -------------------------------------------------------------- |
| **Method**     | `POST`                                                         |
| **Path**       | `/v2/wallets/transaction/initiate`                             |
| **Sandbox**    | `https://sandbox.simpaisa.com/v2/wallets/transaction/initiate` |
| **Production** | `https://wallets.simpaisa.com/v2/wallets/transaction/initiate` |

### Request body

| Parameter          | Type   | Required | Length | Description                    |
| ------------------ | ------ | -------- | ------ | ------------------------------ |
| `merchantId`       | String | Yes      | 07     | Simpaisa-assigned merchant ID  |
| `operatorId`       | String | Yes      | 06     | `100007` for Easypaisa         |
| `amount`           | String | Yes\*    | —      | Alternative to `productId`     |
| `userKey`          | String | Yes      | —      | Your order reference           |
| `transactionType`  | String | Yes      | 01     | `8` = tokenization             |
| `msisdn`           | String | Yes      | 10     | Customer mobile number         |
| `productReference` | String | Yes      | —      | Product or service description |

### Response body

| Parameter       | Description                 |
| --------------- | --------------------------- |
| `status`        | `0000` = Initiate succeeded |
| `message`       | Human-readable status       |
| `msisdn`        | Customer mobile number      |
| `operatorId`    | `100007`                    |
| `merchantId`    | Your merchant ID            |
| `transactionId` | Simpaisa transaction ID     |

After Initiate, an OTP is sent to the customer. Proceed to [Verify](verify.md).

### cURL

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
    "transactionType": "8",
    "msisdn": "3XXXXXX",
    "productReference": "xxxx"
  }'
```

{% tabs %}
{% tab title="Request" %}
```json
{
  "merchantId": "2000XXX",
  "operatorId": "100007",
  "amount": "100",
  "userKey": "XXXX",
  "transactionType": "8",
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
  "amount": "100",
  "operatorId": "100007",
  "merchantId": "200000x",
  "transactionId": "xxxxxxx"
}
```
{% endtab %}
{% endtabs %}

***

## JazzCash — Hosted page

JazzCash tokenization opens a **hosted page** handled by the payment channel. Pass parameters in a GET URL; the customer enters payment details on the hosted page.

### URL parameters

| Parameter            | Required | Type   | Length | Description                                                          |
| -------------------- | -------- | ------ | ------ | -------------------------------------------------------------------- |
| `merchantId`         | Yes      | String | 07     | Simpaisa-assigned merchant ID                                        |
| `amount`             | Yes      | String | —      | Amount to charge in PKR                                              |
| `SubscriptionPeriod` | No       | —      | —      | Recurrence interval for auto-billing                                 |
| `OrderId`            | Yes      | String | —      | Your order reference                                                 |
| `MobileNo`           | Yes      | String | 10     | Customer MSISDN without country code                                 |
| `transactionType`    | Yes      | String | 01     | `8`  for tokenization flow                                           |
| `ReturnUrl`          | Yes      | —      | —      | URL where JazzCash redirects after authentication                    |
| `platform`           | No       | String | —      | Set to `3` to route charge/refund IPNs to separate webhook endpoints |

### Hosted page URLs

**With `platform` parameter:**

```
GET {{protocol}}://{{url}}/jc/registration?fullAmount=X&MobileNo=X&ReturnUrl=X&OrderId=X&MerchantId=X&transactionType=8&platform=3
```

**Without `platform` parameter:**

```
GET {{protocol}}://{{url}}/jc/registration?fullAmount=X&MobileNo=X&ReturnUrl=X&OrderId=X&MerchantId=X&transactionType=8
```

{% hint style="info" %}
Open the hosted page URL in the customer's browser or WebView. After the customer completes authentication, they are redirected to your `ReturnUrl`. Then call [Finalize](finalize.md).
{% endhint %}

### Hosted page journey

After payment details are entered, the customer receives an OTP on a second screen:

### Example (sandbox)

```bash
# Open in browser — replace placeholders
https://sandbox.simpaisa.com/jc/registration?fullAmount=100&MobileNo=3219200750&ReturnUrl=https://merchant.com/callback&OrderId=order-123&MerchantId=2000XXX&transactionType=8
```

***

## Next steps

| Wallet    | Next API                                              |
| --------- | ----------------------------------------------------- |
| Easypaisa | [Verify](verify.md) with OTP                          |
| JazzCash  | [Finalize](finalize.md) after redirect to `ReturnUrl` |
