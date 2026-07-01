# Capture

Capture an authorized card payment to finalize the charge and settle funds.

Use this API when a payment was initiated with `capture: "false"` (onetime, tokenization, or direct charge) and is currently `Authorized`.

---

## Endpoint

|             |                                              |
| ----------- | -------------------------------------------- |
| **Method**  | `POST`                                       |
| **Path**    | `/cards/capture`                             |
| **Sandbox** | `https://sandbox.simpaisa.com/cards/capture` |

---

## Headers

| Header         | Value                                    |
| -------------- | ---------------------------------------- |
| `client-id`    | Your Client ID (e.g. `f8QK3aZ9M2LxR7P4YB5H`) |
| `Content-Type` | `application/json`                       |
| `merchantId`   | Your unique merchant ID (e.g. `700001`)  |
| `mode`         | `cards`                                  |
| `region`       | `PK`                                     |
| `version`      | `V5`                                     |

---

## Request Body

| Parameter          | Required | Description                                  |
| -------------------- | -------- | --------------------------------------------- |
| `request.reference`  | Yes      | Reference of the authorized transaction to capture |
| `signature`           | Yes      | RSA signature of the `request` object         |

---

## Response Body

| Parameter                   | Description                                    |
| ----------------------------- | ------------------------------------------------ |
| `response.id`                  | Unique payment ID                                |
| `response.action_id`           | Unique action ID for the capture                 |
| `response.approved`            | Whether the capture is approved                  |
| `response.status`              | `Captured` on success; `Declined` on rejection   |
| `response.response_code`       | Outcome code — `10000` on success. `40025` if the reference belongs to a zero-amount tokenization transaction |
| `response.response_summary`    | Human-readable outcome                           |
| `response.transaction_state.CAPTURE_STATUS` | `SUCCESS` on success — absent on decline |
| `response.source`              | Source ID/type                                    |
| `response.reference`           | Reference from the request                        |
| `response.transaction_id`      | Simpaisa transaction ID                            |
| `signature`                    | RSA signature of the response body                |

---

## Samples

{% tabs %}
{% tab title="Successful Capture" %}

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/capture' \
--header 'client-id: f8QK3aZ9M2LxR7P4YB5H' \
--header 'merchantId: 700001' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": { "reference": "h388-1782917244521" },
  "signature": "BquF7IBUJbNbMLmVXYde3jA8awtJ/QAAgeV+G5ZFKiqndwyvmKWdLkuRqYZMoHJdCnMzjXRx+/OiarMOUJcEYcuBMFtX9GR+elpRAOxQfEt0ovuwAd7WTF4vk2mAxou4EMP5VozZM8L8CxhrINzEmxp7U8WCk7UbWDdgmhuOJZkKDvQLAz2nbJNAXZnrukSBZ9aFCvO4N++QDiyq/lbZ0sUoQImSvZVC8RgW4HAX0pQ1w5MVCtKfWVJ4sS6MWQ/q4u/zXW2Z//j/uoslzV/2sIOBxNPZ9Lm1hZlVEBhfafA0RKS/PqQ3fXrNqMTcNZXKMyb53+qyi2w84XsNVW+1Hg=="
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_28f3d06b5e2445858994eaa032",
    "action_id": "act_7f56443d348048c0a1989ab39a",
    "approved": "true",
    "status": "Captured",
    "response_code": "10000",
    "response_summary": "Approved",
    "transaction_state": {
      "CAPTURE_STATUS": "SUCCESS"
    },
    "source": {
      "id": "src_841d885af66f47a3b0ec69bf63",
      "type": "CARD"
    },
    "processed_on": "2026-07-01T14:49:17Z",
    "reference": "h388-1782917244521",
    "transaction_id": "3282"
  },
  "signature": "dqFwN6K8FlhmlZ8uKbsG+B0dxzYs3nGtN7NoPUUBfTWEAw8XJ8w1olko/atoxi+Ge/sXdXS41xHcTo/4bTSy15z5qvQj9OTYqNVcJ8EGNUPzK4/7HvVWwJSfIltViRF6LMya/tI2IbGoIX9WB2fo/V33KRqODDkYNL6DenX31GTQsQqsNyaU2t2CvK/sksE/vtdnKIUkfdyaGzDSWer62Gd4UE6/am3l0wF3+uH3SwOHgSY3N3gY9EXG0FoPPR79LqmydZh3HMT27EDpSLzF3y1lrgrwxOUf1oMuOUpy4YdOEi/OvtKmtleQXmhwBN4rERivon9RJFpQkMssH2iHXw=="
}
```

This behavior is unchanged for [Tokenization](payment.md#tokenization--pay--save-non-zero-amount) (non-zero amount) transactions authorized with `capture: "false"` — capturing them succeeds the same way, and `c_token` remains retrievable via [Inquiry](inquiry.md) afterward.

{% endtab %}

{% tab title="Zero-Amount Tokenization (Rejected)" %}

Calling Capture against a reference created via zero-amount tokenization (`payment_type: "tokenization"`, `amount: "0.00"`) is rejected:

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/capture' \
--header 'client-id: f8QK3aZ9M2LxR7P4YB5H' \
--header 'merchantId: 700001' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": { "reference": "tok-c2-1782917563029" },
  "signature": "xxxx"
}'
```

#### Response

```json
{
  "response": {
    "id": "pay_e6a31de6ef6e4bd28d5d84b4db",
    "action_id": "act_defa854af940486cb079196f4b",
    "approved": "false",
    "status": "Declined",
    "response_code": "40025",
    "response_summary": "Capture is not applicable for zero-amount tokenization.",
    "processed_on": "2026-07-01T14:54:02Z",
    "reference": "tok-c2-1782917563029",
    "transaction_id": "3284"
  },
  "signature": "mlQYs1nN6r2HPDmzEjjdyH0EHeBJNK9sPMosEG0zllGm9MsmMztlLAKUk6MZ6QgdGlobCXA1HjpY1IoeAxy5zbFRIoV+/fN5YsawfIunf7y1+MywPajcqhItVKZT0Fttpl6fV1oMRPOmASowFiNTZQNBlqJCqGfLt9mOtlIawTjYDlIdjttmjWWzKFldAE6gwF5XTlYLdswe6TD9BXCPOyGP+igQGtTAasrwQ588cjBPmEZ+Ean+dsm85k4VOulIw6dSP3c1T1ysSeJAd4WhlMvfsEESmzqw+h71MsLW181wp7zonV/FVTnxqTq8K+qegS+9BoTV+LiPEKqNqibSQw=="
}
```

{% endtab %}
{% endtabs %}

## Postback After Capture

See [Postbacks](postbacks.md) for the asynchronous notification sent after capture, or use [Inquiry](inquiry.md) to confirm status directly.
