---
sidebar_position: 220
sidebar_label: "Pay-In PK Wallet Status Codes"
---

# Pay-In Status Codes — Pakistan Wallets

Response codes returned by Pakistan wallet pay-in APIs (`/v2/wallets/...`).

| Status Code | Message |
| ----------- | ------- |
| 0000 | Success |
| 0001 | Invalid-Operator |
| 0002 | Invalid-Product/Amount |
| 0003 | Invalid-Merchant |
| 0004 | Invalid-Value |
| 0005 | Invalid-Call |
| 0006 | Channel-Rejected-Transaction |
| 0007 | No-Response-From-Operator |
| 0008 | Invalid-Account |
| 0009 | Not-Enough-Balance |
| 0010 | OTP-Expired |
| 0011 | Invalid-OTP |
| 0012 | Transaction-Failed |
| 0015 | Invalid-Flow |
| 0016 | Threshold-Exceeded |
| 0018 | Request-In-Progress |
| 0019 | Invalid-UserKey |
| 0021 | Channel-Failed-Transaction |
| 0023 | Method-Not-Allowed |
| 0025 | Invalid-Mobile-No |
| 0026 | Operator-Disabled |
| 0027 | Amount-Beyond-Limit |
| 0028 | Token-Expired |
| 0033 | Channel-Invalid-Call |
| 0034 | Invalid-Token |
| 0036 | Token-Not-Found |
| 0037 | Transaction-Pending |
| 0039 | Invalid-CNIC |
| 0041 | Invalid-Account-Number |
| 0042 | Record-Not-Found |
| 0043 | Invalid-Account-Number |
| 0087 | No-Active-Subscription-Found |
| 0091 | User-didn't-approve-or-rejected-transaction |
| 0095 | Otp-Not-Entered |
| 0098 | Otp-Threshold-Exceeded |
| 9999 | System-Failure |

:::info
`0037` (Transaction-Pending) is common in async wallet flows. Use [webhooks](../webhooks.md) or [Inquire](../../pay-in-apis/pakistan/wallets/inquire.md) for the final status.
:::
