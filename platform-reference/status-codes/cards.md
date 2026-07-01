# Card Payment Response Codes

Use `response_code` in card API responses and postbacks to identify transaction outcomes.

| Simpaisa Code | Message |
| ------------- | ------- |
| 0 | Transaction Refunded Successfully. |
| 0000 | Success |
| 3001 | Transaction failed — required fields are not being validated against the operator. |
| 3002 | Payment processor experienced a system failure. Wait a few minutes and retry the transaction. |
| 3003 | Card is expired or the expiry date does not match issuer records. Customer must use a different card. |
| 3004 | Card declined by the issuing bank with no further detail. Customer should contact their bank or try a different card. |
| 3005 | Insufficient funds — account balance is too low to complete this transaction. |
| 3006 | Card declined — flagged as lost or stolen by the issuing bank. Do not retry. |
| 3007 | Card is not enabled for online (card-not-present) transactions. Customer must contact their bank to enable CNP or use a different card. |
| 3008 | Card has hit its credit or spending limit. Customer must use a different card. |
| 3009 | Card security code (CVV/CVN) is invalid. Customer must re-enter the correct CVV from the back of their card. |
| 3010 | Card number does not match any account at the issuing bank. Customer must verify their card number or use a different card. |
| 3011 | Transaction flagged as unauthorised by the issuing bank. Customer should contact their bank to authorise this transaction. |
| 3013 | Card is locked — too many incorrect PIN attempts. Customer must contact their bank to unlock the card before retrying. |
| 3014 | 3D Secure authentication failed — customer could not be verified by their bank. Ask them to retry or use a different card. |
| 3015 | Transaction blocked by automated fraud screening. Review the order manually before any retry. |
| 3016 | Payment session has expired. Customer must restart checkout and re-enter their payment details. |
| 3017 | Capture failed — original authorization has expired or was already used. Request a fresh authorization before attempting to capture. |
| 3018 | Transaction failed — one or more request fields contain invalid data. Check and correct field formats before retrying. |
| 3019 | Contact the Simpaisa Support team. |
| 3020 | No error information was provided by the processor. |
| 3021 | Connection to the card vault timed out while retrieving saved card. Please retry. |
| 3022 | Card is not enrolled with 3DS. Customer must enroll the card with their bank or use a 3DS-enabled card. |
| 3025 | Saved card not found in the vault — the depositor record is missing. Customer must re-enter their card details. |
| 3026 | Card is permanently blacklisted in the vault and cannot be saved or used. Customer must use a different card. |
| 3027 | Card number is invalid |
| 3028 | CVV entered is the wrong length for a Mastercard (must be 3 digits). Customer must re-enter the correct CVV. |
| 3029 | CVV entered is the wrong length for a Visa card (must be 3 digits). Customer must re-enter the correct CVV. |
| 3030 | CVV is missing. Customer must enter the 3 or 4 digit security code from their card. |
| 3031 | Connection to the card vault timed out while saving the card. Please retry. |
| 3032 | CVV contains invalid characters — only numeric digits are accepted. Customer must re-enter their CVV using numbers only. |
| 3033 | An unexpected error occurred while saving the card to the vault. Please retry. |
| 3034 | Card scheme is not recognised or not supported. Customer must use a Visa, Mastercard, or other supported card type. |
| 3035 | Transaction blocked by the cardholder. They have restricted this transaction type via their bank or banking app. They must contact their bank to lift the block. |
| 3036 | Request reached the processor but timed out waiting for a response. Retry the transaction after a few minutes. |
| 3037 | An unexpected error occurred while retrieving the saved card from the vault. Retry the request. |
| 3039 | Card number is too short — 15 digits entered but 16 expected. Customer must check and re-enter their full card number. |
| 3040 | Card number is invalid — no matching account found at the issuing bank. Customer must verify their card number or use a different card. |
| 3501 | Transaction link expired |
| 10000 | Approved |
| 20118 | Transaction Pending |
| 20151 | Cardholder failed 3DS authentication |
| 40010 | Card tokenization is not enabled for this merchant. |
| 40012 | Token does not belong to this merchant. |
| 40015 | Non-3DS direct charge is not enabled for this merchant. |
| 40016 | customer_id not found. |
| 40025 | Capture is not applicable for zero-amount tokenization. |

Card postbacks also use processor `response_code` values (e.g. `10000` = Approved). See [Webhooks — Card postbacks](../webhooks.md#card-payment-postbacks).
