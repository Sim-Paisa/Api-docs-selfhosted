---
sidebar_position: 410
sidebar_label: "Tokenization Initiate"
---

# Tokenization Initiate

Start a tokenization consent flow. **Easypaisa** uses a REST Initiate call. **JazzCash** opens a hosted registration page via a GET URL.

***

## Easypaisa — REST Initiate

After Initiate succeeds, an OTP is sent to the customer. Proceed to [Verify](../verify/index.md).

Full endpoint, headers, parameters, and a sample request/response: [Tokenization Initiate — Easypaisa](./use-case-easypaisa.md).

***

## JazzCash — Hosted Page

Open the hosted page URL in the customer's browser or WebView. After the customer completes authentication, they are redirected to your `ReturnUrl`. Then call [Finalize](../finalize/index.md).

Full URL parameters and the hosted page flow: [Tokenization Initiate — JazzCash](./use-case-jazzcash.md).

***

## Next Steps

| Wallet    | Next API                                              |
| --------- | ----------------------------------------------------- |
| Easypaisa | [Verify](../verify/index.md) with OTP                          |
| JazzCash  | [Finalize](../finalize/index.md) after redirect to `ReturnUrl` |
