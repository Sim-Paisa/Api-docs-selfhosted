# Tokenization

Save a customer's wallet credentials as a **source ID** (SP token) and charge them on a schedule without re-authentication. Tokenization is available on **Easypaisa** and **JazzCash** only.

***

## Tokenization Flow

Tokenization makes scheduled payments more robust and gives merchants more control over package design and recurring charges. The `sourceId` (SP token) maps to the customer's wallet account details in encrypted form, enabling future charges per your defined schedule.

***

## APIs

| Step                  | API                                            | Easypaisa                               | JazzCash                |
| --------------------- | ---------------------------------------------- | --------------------------------------- | ----------------------- |
| 1. Start tokenization | [Initiate](initiate.md)                        | REST Initiate (`transactionType` = `8`) | Hosted page (GET URL)   |
| 2. Verify / complete  | [Verify](verify.md) or [Finalize](finalize.md) | REST Verify with OTP                    | Finalize after redirect |
| 3. Recurring charge   | [Direct Charge](direct-charge.md)              | ✅                                       | ✅                       |
| 4. Remove token       | [Delink](delink.md)                            | ✅                                       | ✅                       |

***

## Transaction Type

| Value | Meaning                          |
| ----- | -------------------------------- |
| `8`   | Tokenization / recurring consent |

***

## SourceId (SP Token)

After successful tokenization, the Verify or Finalize response includes a `sourceId`:

```json
"sourceId": "sp_xxxxxxxxxxxxxxxx"
```

Store this securely. Use it for:

* [Direct Charge](direct-charge.md) — charge the customer without OTP
* [Delink](delink.md) — revoke the saved credentials

{% hint style="warning" %}
Direct Charge cannot run without a valid `sourceId`. The customer must complete the initial tokenization consent flow first.
{% endhint %}

***

## Wallet Comparison

|              | Easypaisa                           | JazzCash                     |
| ------------ | ----------------------------------- | ---------------------------- |
| `operatorId` | `100007`                            | `100008`                     |
| Initial flow | REST Initiate → Verify (OTP + MPIN) | Hosted page → OTP → Finalize |
| `amount`     | Required                            | Uses `amount` on hosted page |
| Finalize API | Not required                        | Required after redirect      |

***

## Related Guides

| Guide                             | Description                     |
| --------------------------------- | ------------------------------- |
| [Initiate](initiate.md)           | Start Easypaisa tokenization    |
| [Verify](verify.md)               | Complete Easypaisa tokenization |
| [Finalize](finalize.md)           | Complete JazzCash tokenization  |
| [Direct Charge](direct-charge.md) | Charge a saved wallet           |
| [Delink](delink.md)               | Remove saved credentials        |
