# Finalize

Confirm and finalize an authorized card transaction using its reference.

Use when you need to close an authorized transaction on your side after 3DS completion.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/mastercard/finalize` |
| **Sandbox** | `https://sandbox.simpaisa.com/mastercard/finalize` |

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
| `request.reference` | Yes | Reference of the authorized transaction to finalize |
| `signature` | Yes | RSA signature of the request body |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `response.id` | Unique payment ID |
| `response.action_id` | Unique action ID for the finalize request |
| `response.amount` | Authorized amount (may be null if unchanged) |
| `response.currency` | Currency code, e.g. `PKR` |
| `response.approved` | Whether finalization succeeded |
| `response.status` | Status after finalization, e.g. `Authorized` |
| `response.response_code` | Outcome code, e.g. `10000` |
| `response.response_summary` | Outcome summary, e.g. `Approved` |
| `response.source.id` | Payment source ID |
| `response.source.type` | Source type, e.g. `CARD` |
| `response.source.expiry_month` | Card expiry month |
| `response.source.expiry_year` | Card expiry year |
| `response.source.scheme` | Card scheme, e.g. `VISA` |
| `response.source.last4` | Last 4 digits of the card |
| `response.source.bin` | Card BIN |
| `response.source.card_type` | Card type, e.g. `DEBIT` |
| `response.processed_on` | ISO processing timestamp |
| `response.reference` | Reference from the authorization request |
| `response.processing.acquirer_transaction_id` | Acquirer transaction ID |
| `response.processing.retrieval_reference_number` | Retrieval reference number |
| `signature` | RSA signature of the response body |

---

## Sample Request

```bash
curl --location 'https://sandbox.simpaisa.com/mastercard/finalize' \
--header 'client-id: 55f840e6afoc9853' \
--header 'merchantId: 20000123' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request": {
        "reference": "haf26"
    },
    "signature": "aH2IUIRT49O9nyRC07YCC0zikXmQs/bG1Zs10p+7JiFVYGcwvT63xM+SmhrTau+ko8WpwZ0XgmC5Pi/WN8zRwJEXnfP/iFYh2SW3VEe7bXailX1PSRxRCawDy9zl22UKLEbgqA/11MFM0OLacGRzWp9JDavbL/jdmFtuuYB7OH0Jfnj84hskHEyAnXVolEQSeRjdaPmu1M3qklO4BD440Pb79sSRgj6MQUoqpQyK0w2kBpDy0tj6Z34I2KEtWxBu14WPqPTa/1xFJdxY97TFAqWWTi+V1fPh5vab2CBhZpF5DUMT7ceVQv/OLEvuHhinX+IgeA/4HNxGf2YwAajlTA=="
}'
```

## Sample Response

```json
{
  "response": {
    "id": "pay_0c2dfc7d3e374b0eb2f9f0d34b",
    "action_id": "act_fd1a8110de6c431682b97d619d",
    "amount": 20,
    "currency": "PKR",
    "approved": true,
    "status": "Authorized",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "AUTHORIZATION_STATUS": "SUCCESS",
      "CAPTURE_STATUS": "SUCCESS"
    },
    "source": {
      "id": "src_9cdcab964f744baf9ef06a6b05",
      "type": "CARD",
      "card": "be9a483152e64708b0ac "
    },
    "processed_on": "2025-01-08T05:33:42Z",
    "reference": "haf26"
  },
  "signature": "M5zek6q3DRtWxxs0p/3X9M3iUxrK3cPwlpKYhKMmjjpkfqKYWN4hbqzoL7U8XunpGY0O7qmqnbw1GeaREMmQQ1BqJrEqb+OrK48KPsVls6nZkcXtk3Iko6QKVPfctCxPMUGvmH7WwobQhjbWaLltKgjCixZjP80Ilr0GklcVxIBOdhMZbdyFhDJZO9vBQf7v4x8J7FvYx+7KPnv3CpP3SnQnDG17pjFfmI7sc/kk2fcpH7emFDnwKjvUuez6ikGjj0KFcoOThKuRt3+sz2mMILgPlP6tREhzJL0MrokVWt6IGrAZiMoAgxJN84kkiB8Ab5Mmd9WQMGHyfRIS3FEjQQ=="
}
```
