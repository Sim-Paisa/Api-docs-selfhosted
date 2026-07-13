---
sidebar_position: 750
sidebar_label: "Refunds"
---

# Refunds

Process refunds for previously captured card transactions.

***

## Endpoint

|             |                                                     |
| ----------- | --------------------------------------------------- |
| **Method**  | `POST`                                              |
| **Path**    | `/cards-refund/reverse`                             |
| **Sandbox** | `https://sandbox.simpaisa.com/cards-refund/reverse` |

***

## Headers

| Header         | Value                                    |
| -------------- | ---------------------------------------- |
| `client-id`    | Your Client ID (e.g. `YOUR_CLIENT_ID`) |
| `Content-Type` | `application/json`                       |
| `merchantId`   | Your unique merchant ID (e.g. `YOUR_MERCHANT_ID`) |
| `mode`         | `cards`                                  |
| `region`       | `PK`                                     |
| `version`      | `V5`                                     |

***

## Request Body

| Parameter                                        | Required | Description                                     |
| ------------------------------------------------ | -------- | ----------------------------------------------- |
| `request.apiOperation`                           | Yes      | `REFUND`                                        |
| `request.reference`                              | Yes      | Reference of the captured transaction to refund |
| `request.amount`                                 | No       | Amount to refund                                |
| `request.transactionDate`                        | Yes      | Original transaction date (`YYYY-MM-DD`)        |
| `request.additionalParameter.additionalString1`  | No       | Additional string parameter                     |
| `request.additionalParameter.additionalString2`  | No       | Additional string parameter                     |
| `request.additionalParameter.additionalString3`  | No       | Additional string parameter                     |
| `request.additionalParameter.additionalInteger1` | No       | Additional integer parameter                    |
| `request.additionalParameter.additionalInteger2` | No       | Additional integer parameter                    |
| `request.additionalParameter.additionalDate`     | No       | Date parameter (`YYYY-MM-DD`)                   |
| `signature`                                      | Yes      | RSA signature of the request body               |

***

## Response Body

| Parameter                   | Description                               |
| --------------------------- | ----------------------------------------- |
| `response.action_id`        | Unique action ID for the refund           |
| `response.status`           | e.g. `Refunded` or `Declined`             |
| `response.response_code`    | Outcome code (e.g. `0` for success)       |
| `response.response_summary` | e.g. `Transaction Refunded Successfully.` |
| `response.reference`        | Reference of the original transaction     |
| `signature`                 | RSA signature of the response body        |

***

## Sample Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards-refund/reverse' \
--header 'client-id: YOUR_CLIENT_ID' \
--header 'merchantId: YOUR_MERCHANT_ID' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request": {
        "apiOperation": "REFUND",
        "reference": "haf1",
        "amount": "20",
        "transactionDate": "2024-12-30",
        "additionalParameter": {
            "additionalString1": "drhehxnndngtdtdhthjjy",
            "additionalString2": "string_value_2",
            "additionalString3": "string_value_3",
            "additionalInteger1": 12345,
            "additionalInteger2": 67890,
            "additionalDate": "2024-09-13"
        }
    },
    "signature": "YOUR_SIGNATURE"
}'
```

## Sample Response

```json
{
  "response": {
    "apiOperation": "REFUND",
    "action_id": "act_032eb6fce0cc444fa7b787ee40",
    "status": "Refunded",
    "response_code": "0",
    "response_summary": "Transaction Refunded Successfully.",
    "reference": "haf1",
    "additionalParameter": {
      "additionalString1": "drhehxnndngtdtdhthjjy",
      "additionalString2": "string_value_2",
      "additionalString3": "string_value_3",
      "additionalInteger1": 12345,
      "additionalInteger2": 67890,
      "additionalDate": "2024-09-13"
    }
  }
}
```

See [Postbacks](postbacks.md#refund-postback) for the asynchronous notification sent after a refund.
