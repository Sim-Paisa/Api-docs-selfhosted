# Inquiry

Fetch the latest status of a card payment by `reference`.

Useful for:

- Checking a pending 3DS payment
- Confirming the final state of a tokenization request
- Retrieving the generated `c_token` after successful tokenization
- Checking a direct charge made with `source.type=c_token`

If a payment was initiated with `capture=false`, the transaction is authorized and capture-pending until you call [Capture](./capture.md).

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/cards/inquiry` |
| **Sandbox** | `https://sandbox.simpaisa.com/cards/inquiry` |

---

## Headers

| Header | Value |
|--------|-------|
| `client-id` | Your Client ID |
| `Content-Type` | `application/json` |
| `merchantId` | Your merchant ID |
| `mode` | `cards` |
| `region` | `PK` |
| `version` | `V5` |

---

## Request body

| Parameter | Required | Description |
|-----------|----------|-------------|
| `request.reference` | Yes | Reference from the payment request |
| `signature` | Yes | RSA signature of the request body |

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `response.id` | Unique payment ID |
| `response.action_id` | Unique action ID |
| `response.amount` | Transaction amount |
| `response.currency` | Currency code |
| `response.approved` | Whether the transaction was approved |
| `response.status` | Latest transaction status |
| `response.response_code` | API response code |
| `response.response_summary` | Human-readable message |
| `response.transaction_state` | Authorization and capture states |
| `response.source` | Source details when returned |
| `response.source.billing_address` | Billing address (token flows) |
| `response.shipping.address` | Shipping address (token flows) |
| `response.processed_on` | ISO processing timestamp |
| `response.reference` | Transaction reference |
| `response.transaction_id` | Provider transaction ID |
| `response.c_token` | Saved card token (tokenization / direct charge) |
| `response.payment_type` | Payment type |
| `signature` | RSA signature of the response body |

---

## Sample request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/inquiry' \
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
  "signature": "xxx"
}'
```

---

## Sample responses

### Authorization successful, capture pending

Typical when the payment was initiated with `capture=false`.

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
  "signature": "xxx"
}
```

### Capture successful

After [Capture](./capture.md), or when payment was initiated with `capture=true`.

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
      "CAPTURE_STATUS": "SUCCESS"
    },
    "processed_on": "2026-02-03T11:39:11Z",
    "reference": "testTrans01",
    "transaction_id": "1288"
  },
  "signature": "xxxx"
}
```

### Successful tokenization inquiry

Retrieve the saved `c_token` after tokenization completes.

```json
{
    "response": {
        "id": "pay_26e80d0c55fe4fa18b49ba8c35",
        "action_id": "act_ca17faa957ac40e8af1496dee0",
        "amount": "100.0",
        "currency": "PKR",
        "approved": "true",
        "status": "Captured",
        "response_code": "10000",
        "response_summary": "Approved",
        "transaction_state": {
            "AUTHORIZATION_STATUS": "SUCCESS",
            "CAPTURE_STATUS": "SUCCESS"
        },
        "processed_on": "2026-03-16T15:44:54Z",
        "reference": "tokenizationtest",
        "transaction_id": "1393",
        "c_token": "ct_88941865-9831-50e8-9679-052069733f3c",
        "payment_type": "tokenization"
    },
    "signature": "xxxx"
}
```

### Direct charge inquiry (c_token)

```json
{
    "response": {
        "id": "pay_19b2ff968f17435187fcbf8664",
        "action_id": "act_b95e328a4afd4acf85f9989713",
        "amount": "100",
        "currency": "PKR",
        "approved": "true",
        "status": "Captured",
        "response_code": "10000",
        "response_summary": "Approved",
        "source": {
            "id": "src_7db1817957e34496ae1749922d",
            "type": "c_token",
            "billing_address": {
                "address_line1": "123 Main Street",
                "city": "Karachi",
                "state": "SD",
                "zip": "75500",
                "country": "PK"
            }
        },
        "shipping": {
            "address": {
                "address_line1": "123 Main Street",
                "city": "Karachi",
                "state": "SD",
                "zip": "75500",
                "country": "PK"
            }
        },
        "processed_on": "2026-03-16T15:47:13Z",
        "reference": "tokenizationtest1",
        "transaction_id": "1394",
        "c_token": "ct_88941865-9831-50e8-9679-052069733f3c",
        "payment_type": "directcharge"
    },
    "signature": "xxxx"
}
```
