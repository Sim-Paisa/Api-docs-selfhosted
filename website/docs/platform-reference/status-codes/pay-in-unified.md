---
sidebar_position: 210
sidebar_label: "Pay-In Unified Status Codes"
---

# Pay-In Status Codes (Unified Regions)

Status codes for **Bangladesh**, **Nepal**, **Egypt**, and **Iraq** unified pay-in APIs.

| Code | Message | Postback? |
|------|---------|-----------|
| `0000` | Success | Yes |
| `0004` | Invalid-Value | No |
| `0005` | Invalid-Call | No |
| `0006` | Channel-Rejected-Transaction | Yes |
| `0010` | Otp-Expired | Yes |
| `0011` | Invalid-Otp | Yes |
| `0012` | Transaction-Failed | Yes |
| `0016` | Threshold-Exceeded | No |
| `0019` | Invalid-Userkey / Invalid-Merchant | No |
| `0020` | Channel-Auth-Failed | Yes |
| `0021` | Channel-Failed-Transaction | Yes |
| `0025` | Invalid-MobileNo | No |
| `0030` | Invalid-Amount | No |
| `0037` | Transaction-Pending | No |
| `0050` | Invalid-Flow | No |
| `0090` | Transaction-Not-Found | No |
| `0093` | Transaction-Initiation-Failed | No |
| `0095` | Invalid-Success-URL | No |
| `0096` | Invalid-Failure-URL | No |
| `0097` | Invalid-Transaction-Id | No |
| `0101` | Invalid-Credential | No |
| `0105` | Invalid-Operator | No |
| `2004` | Account Limit Exhausted | Yes |
| `2005` | Duplicate Transactions | Yes |
| `2007` | Insufficient Balance | Yes |
| `2010` | Refund Initiated | No |
| `2012` | Transaction Expired | Yes |
| `2015` | User did not complete the transaction | Yes |
| `2022` | Failed-Transaction | Yes |
| `2052` | Otp-Not-Entered | Yes |
| `2091` | User did not approve or rejected transaction | No |
| `2221` | Account does not exist | Yes |
| `2421` | Inactive account | Yes |
| `2623` | Otp-Error | Yes |
| `2625` | Otp-attempts-exceeded | Yes |
| `2821` | User account blocked | Yes |
| `9999` | System Failure | Yes |
