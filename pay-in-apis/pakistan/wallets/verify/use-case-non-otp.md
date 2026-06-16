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

## User journey

<figure><img src="/files/OFElV98cpxX1jW1IkFVD" alt=""><figcaption></figcaption></figure>

<figure><img src="/files/YOgEDS65VEgq8jwzRUxk" alt=""><figcaption></figcaption></figure>

---

## Related

- [Verify Payment](../verify.md)
- [Inquire Payment](../inquire.md)
- [Webhooks](../../../../platform-reference/webhooks.md)
- [Error handling](../../../../platform-reference/error-handling.md)
