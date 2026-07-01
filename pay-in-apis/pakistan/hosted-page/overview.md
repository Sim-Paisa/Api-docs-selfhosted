# Hosted Page

Simpaisa-hosted checkout link that shows enabled payment channels and redirects back to your site.

Use the Hosted Page when you want Simpaisa to handle the checkout UI. You generate a link and send the customer to it. Simpaisa collects payment details and processes the transaction.

* Show **all channels** enabled for your merchant, or restrict to one method using the optional `operator` parameter.
* When the flow completes, the customer is redirected to your `redirectUrl`.
* Use the [Inquiry API](inquire.md) to confirm final status and display the outcome.

***

## Generating the hosted page link

Build a **GET** URL with the query parameters below.

| Parameter     | Required    | Type      | Length | Description                                              |
| ------------- | ----------- | --------- | ------ | -------------------------------------------------------- |
| `merchantId`  | Yes         | Int       | 07     | Unique merchant ID                                       |
| `key`         | Yes         | String    | N/A    | Simpaisa security key for authenticating link generation |
| `amount`      | Conditional | Int/Float | N/A    | Amount in PKR — required if no `productId`               |
| `productId`   | Conditional | Int       | N/A    | Configured plan ID — required if no `amount`             |
| `redirectUrl` | Yes         | String    | N/A    | URL where the user is redirected after payment           |
| `orderId`     | Yes         | String    | N/A    | Your unique order reference (correlation / idempotency)  |
| `operator`    | No          | Int       | 06     | Restrict to one operator (e.g. Easypaisa, Jazzcash)      |

### Sample URL

```
https://{{url}}/checkout?merchantId=xxxxxxxx&key=xxxxxxx&orderId=xxxxxxx&amount=xxxxxx&redirectUrl=xxxxxxxxxxxxxxxxxxxx&operator=xxxxx
```

{% hint style="info" %}
The `operator` parameter is optional. When omitted, all enabled payment channels are shown. When provided, only that channel is available.
{% endhint %}

***

## Environments

| Environment | Base URL                             |
| ----------- | ------------------------------------ |
| Sandbox     | `https://stg-widgetapi.simpaisa.com` |
| Production  | `https://widgetapi.simpaisa.com`     |

***

## Integration flow

1. Build the checkout URL with `merchantId`, `key`, `orderId`, `amount` or `productId`, and `redirectUrl`.
2. Redirect the customer's browser to the checkout URL.
3. Customer completes payment on the Simpaisa-hosted page.
4. Customer lands on your `redirectUrl`.
5. Call [Inquire](inquire.md) with `merchantId` and `orderId` to show the final result.

***

## APIs at a glance

| Action                 | Method | Path            |
| ---------------------- | ------ | --------------- |
| Generate checkout link | `GET`  | `/checkout?...` |
| Inquire payment status | `POST` | `/inquire`      |

For a no-code payment link option, see [E-Invoice / Link to Pay](e-invoice.md).
