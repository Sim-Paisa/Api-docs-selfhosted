# tokenization initiate

Start a tokenization consent flow. **Easypaisa** uses a REST Initiate call. **JazzCash** opens a hosted registration page via a GET URL.

***

## Easypaisa — REST Initiate

After Initiate succeeds, an OTP is sent to the customer. Proceed to [Verify](verify.md).

Full endpoint, headers, parameters, and a sample request/response: [Tokenization Initiate — Easypaisa](initiate/use-case-easypaisa.md).

***

## JazzCash — Hosted page

Open the hosted page URL in the customer's browser or WebView. After the customer completes authentication, they are redirected to your `ReturnUrl`. Then call [Finalize](finalize.md).

Full URL parameters and the hosted page flow: [Tokenization Initiate — JazzCash](initiate/use-case-jazzcash.md).

***

## Next steps

| Wallet    | Next API                                              |
| --------- | ----------------------------------------------------- |
| Easypaisa | [Verify](verify.md) with OTP                          |
| JazzCash  | [Finalize](finalize.md) after redirect to `ReturnUrl` |
