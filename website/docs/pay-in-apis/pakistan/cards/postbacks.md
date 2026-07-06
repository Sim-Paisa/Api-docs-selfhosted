---
sidebar_position: 760
sidebar_label: "Postbacks"
---

# Postbacks

Receive asynchronous updates on card pay-in transaction status. Once a payment is initiated, the final state (success or failure) is communicated via webhook. Make business decisions based on the **final postback**, not only the immediate API response.

The `signature` field verifies payload authenticity. Validate it using Simpaisa's RSA public key before updating order state.

---

## Webhook Setup

Configure your postback URL in the Simpaisa dashboard or share it with your integration contact. Simpaisa delivers `application/json` payloads via HTTP `POST`. Delivery is considered successful when your server returns **HTTP 200**.

---

## Card Payment Postbacks (3DS + Capture Behavior)

Card payments generate **one** or **two** postbacks depending on `capture`.

### 3DS Enabled, Capture False — Two Postbacks

1. **Interim postback** after the customer completes 3DS (authorization approved, capture pending).
2. **Capture postback** after you run the [Capture API](./capture.md).

#### Interim Postback (authorization Approved, Capture Pending)

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

#### Capture Postback (capture Successful)

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

### 3DS Enabled, Capture True — One Postback

One postback after the customer completes 3DS. The system captures automatically.

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

---

## Refund Postback

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

Upon receiving a webhook:

1. **Verify the signature** — confirm payload authenticity using Simpaisa's public key.
2. **Respond with HTTP 200** — acknowledge receipt. Non-200 responses may trigger retries.

If no postback arrives within **40 minutes**, call the [Inquiry API](./inquiry.md) to verify status.

---

## Sample Webhook (declined — 3DS Failure)

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
