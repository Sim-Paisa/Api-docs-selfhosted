# Idempotency

Simpaisa supports idempotency at the API level to prevent duplicate deductions against the same request and to ensure repetitive or similar requests receive consistent responses.

---

## Scope

Idempotency applies to **all pay-in APIs** in:

| Product | Regions | Example APIs |
|---------|---------|--------------|
| **Pay-In — Pakistan** | Pakistan | Wallet Initiate, Verify, Inquire, Refund, Tokenization, Direct Charge, Delink, and related wallet endpoints |
| **Pay-In — Bangladesh** | Bangladesh (unified pay-in) | Initiate, Inquire, and other `/payins/payments/*` calls |

Pass the idempotency header on **every** request in these flows—not only on Verify. Use the same UUID when retrying the **same** operation; generate a new UUID for each distinct payment attempt.

---

## Headers by region

| Region | Header name | Value format |
|--------|-------------|--------------|
| Pakistan (`PK`) | `Request-Id` | 36-character UUID (standard format) |
| Bangladesh (`BD`) | `RequestID` | 36-character UUID (standard format) |

{% hint style="info" %}
The header names differ by region: **`Request-Id`** for Pakistan and **`RequestID`** for Bangladesh. Other unified pay-in regions (NP, EG, IQ) are outside this idempotency scope unless documented separately.
{% endhint %}

---

## Pakistan — sample request

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/v2/wallets/transaction/initiate' \
  --header 'Content-Type: application/json' \
  --header 'mode: payin' \
  --header 'region: PK' \
  --header 'operatorId: 100007' \
  --header 'version: 3.0' \
  --header 'Request-Id: 123e4567-e89b-12d3-a456-426655440010' \
  --data-raw '{
    "merchantId": "xxxxxxx",
    "operatorId": "100007",
    "amount": "100",
    "userKey": "order-12345",
    "transactionType": "0",
    "msisdn": "3001234567",
    "productReference": "test-payment"
  }'
```

---

## Bangladesh — sample request

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/payins/payments/initiate' \
  --header 'Content-Type: application/json' \
  --header 'api-token: YOUR_API_TOKEN' \
  --header 'mode: payin' \
  --header 'region: BD' \
  --header 'operatorId: 10001' \
  --header 'version: 3.0' \
  --header 'RequestID: 123e4567-e89b-12d3-a456-426655440010' \
  --data-raw '{
    "merchantId": "4000006",
    "userKey": "order-12345",
    "msisdn": "1712345678",
    "amount": "100",
    "operator": "10001",
    "successUrl": "https://merchant.example/success",
    "failureUrl": "https://merchant.example/failure",
    "productReference": "test-payment",
    "currencyCode": "BDT"
  }'
```

---

## Generate a UUID (Java)

```java
import java.util.UUID;

public class UUIDGenerator {
    public static void main(String[] args) {
        UUID uuid = UUID.randomUUID();
        System.out.println("Generated UUID: " + uuid.toString());
    }
}
```

{% hint style="warning" %}
Generate a **new** idempotency key for each distinct payment attempt. Reuse the same UUID only when retrying the **same** API call (for example, after a timeout or network error).

- Pakistan: reuse `Request-Id`
- Bangladesh: reuse `RequestID`
{% endhint %}
