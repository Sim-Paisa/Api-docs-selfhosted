---
sidebar_position: 350
sidebar_label: "Webhooks"
---

# Webhooks

When a transaction reaches a final state, Simpaisa sends an HTTP `POST` to your configured callback URL.

Postbacks are sent when:

- A transaction completes (success or failure)
- An async payment cycle completes

## Sample Success Postback

```json
{
  "status": "0000",
  "message": "Success",
  "transactionId": "1423487",
  "merchantId": "4000006",
  "amount": "365.0",
  "msisdn": "1632332883",
  "userKey": "BDTb95a870f04403992d5034a2d201d2",
  "operator": "10001",
  "transactionType": "0",
  "createdTimestamp": "2025-09-19 16:15:53.0",
  "updatedTimestamp": "2025-09-19 16:17:07.187",
  "currencyCode": "BDT"
}
```

## Sample Failure Postback

```json
{
  "status": "0021",
  "message": "Channel-Failed-Transaction",
  "transactionId": "1423024",
  "merchantId": "4000006",
  "amount": "150.00",
  "msisdn": "1632332883",
  "operator": "10001",
  "userKey": "BDT8a4d2e2e248558adf9c5da0e7ceaa",
  "transactionType": "0",
  "createdTimestamp": "2025-09-19 15:59:59.0",
  "updatedTimestamp": "2025-09-19 16:00:00.0",
  "currencyCode": "BDT"
}
```

:::info
Use postbacks together with [Inquire](./inquire.md)—treat Inquire as the source of truth when reconciling orders.

Postback field name for the operator is region-specific: **`operator` for Bangladesh**; **`operatorId` for Nepal, Egypt, and Iraq**. Samples above are Bangladesh (`BDT`).

For general webhook setup and security, see [Platform webhooks reference](../../platform-reference/webhooks.md).
:::
