# Card Payment

Initiate one-time card payments, tokenization, and direct charges.

---

## Payment process

![Card payment flow](/files/na78esNmL08yJ6ZjQ6Ey)

Request behavior depends on `payment_type`, `source.type`, `3ds.enabled`, and `capture`:

| `payment_type` | Description |
|----------------|-------------|
| `onetime` | Regular card payment |
| `tokenization` | Save a reusable `c_token` |
| `directcharge` | Charge a previously saved `c_token` |

**Rules:**

- For `onetime` and `tokenization`, set `source.type=card`.
- For `directcharge`, set `source.type=c_token`.
- Tokenization must use `3ds.enabled=true`.
- For tokenization, `capture` can be `true` or `false`.
- Direct charge with `c_token` supports `3ds.enabled=false`.
- `capture=true` captures immediately after approval.
- `capture=false` authorizes first — capture later with [Capture](./capture.md).

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/cards/payments` |
| **Sandbox** | `https://sandbox.simpaisa.com/cards/payments` |

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

## Request body

| Parameter | Required | Description |
|-----------|----------|-------------|
| `request.source` | Yes | Payment source details |
| `request.source.type` | Yes | `card` (encrypted card) or `c_token` (saved token) |
| `request.source.card` | Yes | AES-encrypted card value or saved `c_token` |
| `request.amount` | Yes | Transaction amount |
| `request.currency` | Yes | Currency code, e.g. `PKR` |
| `request.payment_type` | Yes | `onetime`, `tokenization`, or `directcharge` |
| `request.reference` | Yes | Unique transaction reference |
| `request.capture` | Yes | `true` to capture immediately; `false` to authorize only |
| `request.description` | Yes | Payment description |
| `request.3ds.enabled` | Yes | `true` or `false` — must be `true` for tokenization |
| `request.success_url` | Yes | Redirect URL after successful 3DS |
| `request.failure_url` | Yes | Redirect URL after failed 3DS |
| `request.customer.email` | Yes | Customer email |
| `request.customer.name` | Yes | Customer full name |
| `request.customer.country` | Yes | ISO 2-letter country, e.g. `PK` |
| `request.customer.phone.number` | Yes | Phone number without country code |
| `request.customer.phone.country_code` | Yes | Country calling code, e.g. `+92` |
| `request.shipping.address` | For tokenization and directcharge | Shipping address object |
| `request.shipping.address.address_line1` | For tokenization and directcharge | First address line |
| `request.shipping.address.city` | For tokenization and directcharge | City |
| `request.shipping.address.state` | For tokenization and directcharge | State or province |
| `request.shipping.address.zip` | For tokenization and directcharge | Postal code |
| `request.shipping.address.country` | For tokenization and directcharge | ISO 2-letter country |
| `request.payment_ip` | Yes | IP address of the user initiating payment |
| `signature` | Yes | RSA signature of the request body |

See [Overview — AES encryption](./overview.md#aes-card-encryption) for card encryption format.

---

## Response body

| Parameter | Description |
|-----------|-------------|
| `response.id` | Unique payment ID |
| `response.action_id` | Unique action ID |
| `response.amount` | Transaction amount |
| `response.currency` | Currency code |
| `response.approved` | Whether the payment is approved |
| `response.status` | e.g. `Pending`, `Authorized`, `Captured`, `Declined` |
| `response.response_code` | Transaction outcome code |
| `response.response_summary` | Human-readable outcome |
| `response.transaction_state` | Authorization and capture status container |
| `response.transaction_state.AUTHORIZATION_STATUS` | `PENDING`, `SUCCESS`, or `FAILED` |
| `response.transaction_state.CAPTURE_STATUS` | `PENDING`, `SUCCESS`, or `FAILED` |
| `response.source.id` | Source ID assigned by Simpaisa |
| `response.source.type` | Source type |
| `response.source.card` | Masked or token-linked card value |
| `response.source.billing_address` | Billing address (tokenization / direct charge) |
| `response.customer` | Customer details object |
| `response.shipping.address` | Shipping address (tokenization / direct charge) |
| `response.processed_on` | ISO processing timestamp |
| `response.reference` | Reference from request |
| `response.redirect` | 3DS redirect URL when applicable |
| `response.transaction_id` | Provider transaction ID |
| `response.c_token` | Saved card token after successful tokenization |
| `response.payment_type` | Payment type processed |
| `signature` | RSA signature of the response body |

---

## Samples

### 3DS enabled, capture false

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: f8QK3al9C2LxR7P4YB5H' \
--header 'Content-Type: application/json' \
--header 'merchantId: 2000012' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--data-raw '{
    "request": {
        "source": {
            "type": "card",
            "card": "kAzNCnNQj7f9ib9J5LRiNrPCNb1d3/wxE0JGfWURnnM="
        },
        "amount": "20.00",
        "currency": "PKR",
        "payment_type": "onetime",
        "reference": "testTrans01",
        "capture": "false",
        "description": "Set of 3 masks",
        "3ds": {
            "enabled": "true"
        },
        "success_url": "https://success.com/",
        "failure_url": "https://failure.com/",
        "customer": {
            "email": "johnsmith@example.com",
            "name": "John Smith",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
            }
        },
        "payment_ip": "0:0:0:0:0:0:0:1"
    },
    "signature": "xxxx"
}'
```

#### Response

```json
{
    "response": {
        "id": "pay_d7ab372b8a8b4a56bc02bee3b7",
        "action_id": "act_dc2d3e4ca3a64798b6878e009d",
        "amount": "20.00",
        "currency": "PKR",
        "approved": "false",
        "status": "Pending",
        "response_code": "20118",
        "response_summary": "Transaction Pending",
        "transaction_state": {
            "AUTHORIZATION_STATUS": "PENDING",
            "CAPTURE_STATUS": "PENDING"
        },
        "customer": {
            "email": "johnsmith@example.com",
            "name": "John Smith",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
            },
            "id": "cus_c2eef66900f411f1bd1b02eb53"
        },
        "processed_on": "2026-02-03T11:37:49Z",
        "reference": "testTrans01",
        "redirect": "https://sandbox.simpaisa.com/mastercard/?transactionId=1288&refId=testTrans01",
        "transaction_id": "1288"
    },
    "signature": "xxx"
}
```

### 3DS enabled, capture true

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: f8QK3aZ9X2LxR7P4YB1H' \
--header 'Content-Type: application/json' \
--header 'merchantId: 2000012' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--data-raw '{
    "request": {
        "source": {
            "type": "card",
            "card": "kAzNCnNQj7f9ib9J5LRiNrPCNb1d3/wxE0JGfWURnnM="
        },
        "amount": "20.00",
        "currency": "PKR",
        "payment_type": "onetime",
        "reference": "testTrans02",
        "capture": "true",
        "description": "Set of 3 masks",
        "3ds": {
            "enabled": "true"
        },
        "success_url": "https://success.com/",
        "failure_url": "https://failure.com/",
        "customer": {
            "email": "johnsmith@example.com",
            "name": "John Smith",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
            }
        },
        "payment_ip": "0:0:0:0:0:0:0:1"
    },
    "signature": "xxxx"
}'
```

#### Response

```json
{
    "response": {
        "id": "pay_a6a1c5581e3e45d28f40b3ea86",
        "action_id": "act_fb6c13f4e5cc416188255a2379",
        "amount": "20.00",
        "currency": "PKR",
        "approved": "false",
        "status": "Pending",
        "response_code": "20118",
        "response_summary": "Transaction Pending",
        "transaction_state": {
            "AUTHORIZATION_STATUS": "PENDING",
            "CAPTURE_STATUS": "PENDING"
        },
        "customer": {
            "email": "johnsmith@example.com",
            "name": "John Smith",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
            },
            "id": "cus_6aa0eff800f611f1bd1b02eb53"
        },
        "processed_on": "2026-02-03T11:49:41Z",
        "reference": "testTrans02",
        "redirect": "https://sandbox.simpaisa.com/mastercard/?transactionId=1289&refId=testTrans02",
        "transaction_id": "1289"
    },
    "signature": "xxxx"
}
```

### Tokenization

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: f8QK3aZ9M2LxR7P4YB5H' \
--header 'merchantId: 700001' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request": {
        "source": {
            "type": "card",
            "card": "O89wfTO5m4OHdqW9qE1fEkeXp8WPlGY6DWcbxxYLUqQ="
        },
        "amount": "100",
        "currency": "PKR",
        "payment_type": "tokenization",
        "reference": "tokenizationtest",
        "capture": "true",
        "description": "simpaisa.com",
        "3ds": {
            "enabled": "true"
        },
        "success_url": "https://simpaisa.com",
        "failure_url": "https://simpaisa.com",
        "customer": {
            "email": "john.doe@gmail.com",
            "name": "john.doe",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
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
        "payment_ip": "127.0.0.1"
    },
    "signature": "xxxx"
}'
```

#### Response

```json
{
    "response": {
        "id": "pay_e406115ef52f410ea7e02992ec",
        "action_id": "act_adc73dea899640898e45d8122b",
        "amount": "100",
        "currency": "PKR",
        "approved": "false",
        "status": "Pending",
        "response_code": "20118",
        "response_summary": "Transaction Pending",
        "transaction_state": {
            "AUTHORIZATION_STATUS": "PENDING",
            "CAPTURE_STATUS": "PENDING"
        },
        "source": {
            "id": "src_5866376a7cd5493ca962947098",
            "type": "CARD",
            "billing_address": {
                "address_line1": "123 Main Street",
                "city": "Karachi",
                "state": "SD",
                "zip": "75500",
                "country": "PK"
            }
        },
        "customer": {
            "email": "johndoe@gmail.com",
            "name": "jhon.doe",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
            },
            "id": "cus_fb603c88214e11f18b1702eb53"
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
        "processed_on": "2026-03-16T15:44:15Z",
        "reference": "tokenizationtest",
        "redirect": "https://sandbox.simpaisa.com/card/?transactionId=1393&refId=tokenizationtest",
        "transaction_id": "1393"
    },
    "signature": "xxxx"
}
```

### Direct charge with c_token

#### Request

```bash
curl --location 'https://sandbox.simpaisa.com/cards/payments' \
--header 'client-id: f8QK3aZ9M2LxR7P4YB5H' \
--header 'merchantId: 700001' \
--header 'mode: cards' \
--header 'region: PK' \
--header 'version: V5' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request": {
        "source": {
            "type": "c_token",
            "card": "ct_88941865-9831-50e8-9679-052069733f3c"
        },
        "amount": "100",
        "currency": "PKR",
        "payment_type": "directcharge",
        "reference": "tokenizationtest1",
        "capture": "true",
        "description": "simpaisa.com",
        "3ds": {
            "enabled": "false"
        },
        "success_url": "https://simpaisa.com",
        "failure_url": "https://simpaisa.com",
        "customer": {
            "email": "john.doe@gmail.com",
            "name": "john.doe",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
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
        "payment_ip": "127.0.0.1"
    },
    "signature": "xxxx"
}'
```

#### Response

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
        "customer": {
            "email": "johndoe@gmail.com",
            "name": "john.doe",
            "country": "PK",
            "phone": {
                "number": "3336777777",
                "country_code": "+92"
            },
            "id": "cus_6517b516214f11f18b1702eb53"
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
