# Pakistan — IBFT (Pull)

Simpaisa lets merchants collect payments by **pulling funds directly from a customer's bank account** (Pull IBFT). Once initiated, the customer receives an OTP via SMS; after entering the OTP, the amount is deducted from their bank account.

**Operator ID (Pull IBFT):** `100018`

---

## Payment flow

1. Call [Initiate](./initiate.md) with bank account details (`accNo`, `cnic`, `bankId`).
2. Customer receives an OTP on their registered mobile number.
3. Call [Verify](./verify.md) with the OTP to complete the debit.
4. Use postbacks or inquiry to confirm final status.

![User Journey for Pull IBFT](/files/9RIH39UvzHUbQuoc62Co)

---

## Environments

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://sandbox.simpaisa.com` |
| Production | `https://ibft.simpaisa.com` |

---

## APIs at a glance

| API | Method | Path |
|-----|--------|------|
| Initiate Pull Request | `POST` | `/ibft/transaction/initiate` |
| Verify Pull Request | `POST` | `/ibft/transaction/verify` |

---

## Common headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |
