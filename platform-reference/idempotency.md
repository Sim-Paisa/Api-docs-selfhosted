# Idempotency

Simpaisa supports idempotency at the API level to prevent duplicate deductions against the same request and to ensure repetitive or similar requests receive consistent responses.

---

## Implementation

Pass a **UUID** in the `Request-Id` header. Idempotency is implemented on the **Verify** call when the customer enters the OTP received via SMS.

The UUID must be a **36-character** alphanumeric string (standard UUID format).

### Sample request

```bash
curl --location --request POST 'https://sandbox.simpaisa.com/v2/wallets/transaction/verify' \
--header 'Content-Type: application/json' \
--header 'Request-Id: 123e4567-e89b-12d3-a456-426655440010' \
--data-raw '{
    "merchantId": "xxxxxxx",
    "operatorId": "xxxxxxx",
    "amount": "xxx",
    "userKey": "xxxxx",
    "transactionType": "x",
    "msisdn": "xxxxxxxxxx"
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
Generate a **new** `Request-Id` for each distinct payment attempt. Reuse the same UUID only when retrying the **same** verify operation.
{% endhint %}
