# Void

Cancel a card transaction before it has been settled.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/cards-refund/reverse` |
| **Sandbox** | `https://sandbox.simpaisa.com/cards-refund/reverse` |

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
| `request.apiOperation` | Yes | `VOID` to cancel the transaction |
| `request.reference` | Yes | Reference of the transaction to void |
| `request.transactionDate` | Yes | Original transaction date (`YYYY-MM-DD`) |
| `request.amount` | No | Amount to void |
| `request.additionalParameter.additionalString1` | No | Additional string parameter |
| `request.additionalParameter.additionalString2` | No | Additional string parameter |
| `request.additionalParameter.additionalString3` | No | Additional string parameter |
| `request.additionalParameter.additionalInteger1` | No | Additional integer parameter |
| `request.additionalParameter.additionalInteger2` | No | Additional integer parameter |
| `request.additionalParameter.additionalDate` | No | Date parameter (`YYYY-MM-DD`) |
| `signature` | Yes | RSA signature of the request body |

---

## Response Body

| Parameter | Description |
|-----------|-------------|
| `response.action_id` | Unique action ID for the void request |
| `response.status` | e.g. `Declined`, `Refunded` |
| `response.response_code` | Outcome code (e.g. `0` for success) |
| `response.response_summary` | e.g. `Transaction Refunded Successfully.` |
| `response.reference` | Reference of the original transaction |
| `response.RefundReferenceNumber` | Reference number for the voided transaction |
| `signature` | RSA signature of the response body |

---

## Sample Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards-refund/reverse' \
--header 'client-id: 55f840e6afoc9853' \
--header 'merchantId: 20000123' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request": {
        "apiOperation": "VOID",
        "reference": "haf261",
        "amount": "9",
        "transactionDate": "2025-02-06",
        "additionalParameter": {
            "additionalString1": "drhehxnndngtdtdhthjjy",
            "additionalString2": "string_value_2",
            "additionalString3": "string_value_3",
            "additionalInteger1": 12345,
            "additionalInteger2": 67890,
            "additionalDate": "2024-09-13"
        }
    },
    "signature": "hXTESmFSyDlOqU8xFktC3hN1UJ8QsigX9sJI8222TudhaN+x+nYJ/ZmaYJTp4F2ksOsHopeh7e5yER5o+dtptjTU4hAyOznoM6JEQI6GkbVnANzsoTbk4Hg7o7hdBbovbnhrczM5qH4Q74TqVV3FKFFMCkNWxQ7BpE+I5PAkhzauhqd6DKSFuEW9uVw5SaB5aM/xPnxcDOmm8uWwEHhvnT+pZrUGq/WemgmN6abIfA1/UytWJxAyYWzC7Ur7UrPM+tZqeViVBGgmJl4h0HefWCBpC71r9XtWLnYEpk0DZuWMLPMy+SqV47LxNtfb/iN8IsphEuXP/iiB/VqL1hLGxg=="
}'
```

## Sample Response

```json
{
  "response": {
    "apiOperation": "VOID",
    "action_id": "act_59f6fe8ab8264bb4a5cc2390ba",
    "status": "Refunded",
    "response_code": "0",
    "response_summary": "Transaction Refunded Successfully.",
    "reference": "haf261",
    "RefundReferenceNumber": "2025020611273607100030",
    "additionalParameter": {
      "additionalString1": "drhehxnndngtdtdhthjjy",
      "additionalString2": "string_value_2",
      "additionalString3": "string_value_3",
      "additionalInteger1": 12345,
      "additionalInteger2": 67890,
      "additionalDate": "2024-09-13"
    }
  },
  "signature": "qKDEt3ICZtahnc7mC9Iacoshd3DoByhLk8YbnYnzUb4+M2SMCWkiKRisXAZ+VQovQkyf2aSm2BdYm6eG5FTvS7HxqiL4/Pk7d6Hh7qx+1J3EeLrtmdFp5mqq2qzK04GTP0BKshF2g2xllEfT1ObVqa5IhYzVe/cK5DB/9xwmcJJ400Tl5BnOpVH4wb+OboVQfVYglNrK4DwVV8s1pHGEiO3HJg9in4+fIjdmMRYpbnxE++JMViawSQ6fLJYUf8zyUj9/RwhrKiTrxwNKKanHZtXf+JEtRvDDf0AOXytMZnkhzIHpl7Xv84t8BlKOj27v7HYA79u77rYVC8nyjBpsOg=="
}
```
