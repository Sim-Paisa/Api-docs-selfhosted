---
sidebar_position: 160
sidebar_label: "Webhooks"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Webhooks & Postbacks

Receive final transaction status asynchronously. Webhooks (postbacks) notify you when a pay-in reaches its final state — use the webhook payload for **final decisioning** rather than relying solely on the immediate API response.

To set up a webhook, configure your payload URL in the dashboard or share it with us so it can be mapped to your merchant details. The payload URL is the server endpoint that receives the webhook `POST` request, delivered as a JSON body (`Content-Type: application/json`).

:::info
Non-OTP wallet payments are asynchronous. The Verify API can return `Transaction-Pending`, then the webhook returns success or failure.
:::

## Why Webhooks

- You get the final status without polling.
- You avoid race conditions on `Transaction-Pending`.
- You can reconcile reliably.

The `signature` field in the webhook payload verifies the authenticity of the notification. Validate the signature against the shared secret or verification algorithm provided by Simpaisa to ensure the notification has not been tampered with.

---

## Sample Callback Notifications

A delivery is considered successful when your server returns HTTP `200`.

<Tabs>
<TabItem value="wallet" label="Wallet">

```json
{
  "status": "0000",
  "message": "Success",
  "msisdn": "3097524704",
  "operatorId": "100007",
  "merchantId": "20000XX",
  "transactionId": "49068982",
  "amount": "1",
  "createdTimestamp": "2023-06-08 16:09:56.0",
  "updatedTimestamp": "2023-06-08 11:10:38.779",
  "userKey": "36937443",
  "transactionType": "0"
}
```

</TabItem>
<TabItem value="refund" label="Refund">

```json
{
  "message": "Success",
  "status": "0000",
  "createdDateTime": "2023-11-17 12:47:48.561",
  "userKey": "test",
  "transactionId": 290325803,
  "merchantID": "20000XX",
  "refundAmount": 1.0,
  "operatorId": 100007,
  "mobileNo": "3336775364",
  "updateDateTime": "2023-11-17 12:47:50.244"
}
```

</TabItem>
<TabItem value="e-billing" label="E-Billing">

```json
{
  "status": "0000",
  "message": "Success",
  "merchantId": "20000XX",
  "operatorId": "100011",
  "paymentToken": "10007714409644242324",
  "transactionId": "95185917",
  "userKey": "778470270550",
  "amount": "5.0",
  "dateCreated": "2024-01-04 21:57:34.0",
  "paymentTokenExpiryDateTime": "2024-01-19 21:57:34.0",
  "datePaid": "2024-01-05 10:29:40.0"
}
```

</TabItem>
</Tabs>

---

## Expected Response From Merchant

Return a `200` so Simpaisa can mark the delivery as successful. Non-200 responses may trigger retries.

```
HTTP/1.1 200 OK
Content-Type: application/json
```

---

## Card Payment Postbacks (3DS + Capture)

Card payments can generate **one** or **two** postbacks depending on `capture`.

### 3ds=true, Capture=false

You receive **two** postbacks:

1. **Interim postback** after the customer completes 3DS authentication — authorization is successful, but capture is still pending.
2. **Capture postback** after you run the Capture API.

<Tabs>
<TabItem value="interim-postback" label="Interim postback">

```json
{
  "response": {
    "id": "pay_ae5953f0d88c4ca2a8d2b56373",
    "action_id": "act_745e1ff37744468088ed7b9024",
    "amount": "20.0",
    "currency": "PKR",
    "approved": "true",
    "status": "Authorized",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS",
      "CAPTURE_STATUS": "PENDING"
    },
    "processed_on": "2026-02-03T11:39:11Z",
    "reference": "testTrans01",
    "transaction_id": "1288"
  },
  "signature": "xxxx"
}
```

</TabItem>
<TabItem value="capture-postback" label="Capture postback">

```json
{
  "response": {
    "id": "pay_23e60ceb92eb489d85d0c0013b",
    "action_id": "act_63f9ce5b5a334feaa1dff0cda4",
    "approved": "true",
    "status": "Captured",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "CAPTURE_STATUS": "SUCCESS"
    },
    "source": {
      "id": "src_441ff29c2b0a4b4b98b74f32eb",
      "type": "CARD"
    },
    "processed_on": "2026-02-03T11:46:12Z",
    "reference": "testTrans01",
    "transaction_id": "1288"
  },
  "signature": "xxxx"
}
```

</TabItem>
</Tabs>

### 3ds=true, Capture=true

You receive **one** postback after the customer completes 3DS authentication. The system captures automatically.

```json
{
  "response": {
    "id": "pay_5b334d89bb8f47288beb6b0db0",
    "action_id": "act_a0b6fe4c5aca4ab9b4a47f764f",
    "amount": "20.0",
    "currency": "PKR",
    "approved": "true",
    "status": "Authorized",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS",
      "CAPTURE_STATUS": "SUCCESS"
    },
    "processed_on": "2026-02-03T11:50:09Z",
    "reference": "testTrans02",
    "transaction_id": "1289"
  },
  "signature": "xxxx"
}
```

### Refund Postback

```json
{
  "response": {
    "apiOperation": "VOID",
    "action_id": "act_3b230a078376498fa28cada6c7",
    "amount": "20",
    "status": "Refunded",
    "response_code": "0",
    "response_summary": "Transaction Refunded Successfully.",
    "reference": "happy2",
    "RefundReferenceNumber": "2026041412381732500069",
    "transaction_id": "1820"
  },
  "signature": "xxxx"
}
```

---

## Handling Webhook Notifications

Upon receiving a webhook, your server should:

- **Verify the signature** — use the provided signature to confirm the payload's authenticity.
- **Acknowledge receipt** — return a `200 OK` response. Non-200 responses may trigger retries.

### Sample Webhook (declined)

```json
{
  "response": {
    "id": "pay_75df1f92167046fa92cf06e38c",
    "action_id": "act_87b229d15aad47e1bb6f231f2b",
    "approved": false,
    "status": "Declined",
    "response_code": "20151",
    "response_summary": "Cardholder failed 3DS authentication",
    "processed_on": "2024-11-07T21:28:04Z",
    "processing": {
      "acquirer_transaction_id": "4935134778",
      "Retrieval_reference_number": "686348034614"
    }
  },
  "signature": "pbPJAcGX+/jmDiuouH/OpAcFX+ =="
}
```
