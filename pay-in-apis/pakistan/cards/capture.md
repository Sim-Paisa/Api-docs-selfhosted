# Capture

Capture an authorized card payment to finalize the charge and settle funds.

Use this API when the original payment was initiated with `3ds.enabled=true` and `capture=false`. The payment is first authorized (capture pending); this call settles it.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/cards/capture` |
| **Sandbox** | `https://sandbox.simpaisa.com/cards/capture` |

---

## Headers

| Header | Value |
|--------|-------|
| `client-id` | Your Client ID (e.g. `55f840e6afoc9853`) |
| `Content-Type` | `application/json` |
| `merchantId` | Your unique merchant ID (e.g. `2000123`) |
| `mode` | `cards` |
| `region` | `PK` |
| `version` | `V5` |

---

## Request Body

| Parameter | Required | Description |
|-----------|----------|-------------|
| `request.reference` | Yes | Reference of the authorized transaction to capture |
| `signature` | Yes | RSA signature of the request body |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `response.id` | Unique payment ID |
| `response.action_id` | Unique action ID for the capture |
| `response.approved` | Whether capture succeeded |
| `response.status` | e.g. `Captured`, `Already Captured` |
| `response.response_code` | Outcome code (e.g. `10000`) |
| `response.response_summary` | Outcome summary (e.g. `Approved`) |
| `response.transaction_state` | Transaction state container |
| `response.transaction_state.CAPTURE_STATUS` | e.g. `SUCCESS` |
| `response.source` | Source info for the captured payment |
| `response.processed_on` | ISO capture timestamp |
| `response.reference` | Reference from the original payment |
| `response.transaction_id` | Provider transaction ID |
| `signature` | RSA signature of the response body |

---

## Sample Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/capture' \
--header 'client-id: f8QK3aZ9M2LxR7P4YB5H' \
--header 'Content-Type: application/json' \
--header 'merchantId: 2000012' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--data '{
  "request": {
    "reference": "testTrans01"
  },
  "signature": "xxxx"
}'
```

## Sample Response

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

---

## Postback After Capture

If you initiated the payment with `3ds.enabled=true` and `capture=false`, you receive:

1. An **authorization postback** after the customer completes 3DS (capture pending).
2. A **capture postback** after you run this Capture API.

See [Postbacks](./postbacks.md) for exact postback payloads.
