# Pakistan — E-Billing

E-billing supports both **P2B** and **B2B** payments. You generate a bill and receive a **payment token**. The customer pays using their bank portal or mobile banking app.

**Operator ID (E-Billing):** `100011`

---

## How It Works

- Tokens expire after **15–30 days** by default; you can set a custom expiry per bill.
- E-billing uses an **async flow** — Simpaisa sends an **IPN** once payment completes.
- To initiate, provide the customer mobile number (`msisdn`). You can also use a pre-defined `msisdn` format where Simpaisa provides the `msisdn`.
- Display the returned token/voucher in your UI; the customer pays against that token.
- Set `expiryDuration` using `d` (days) or `h` (hours), e.g. `2d`, `6h`.

---

## Environments

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://sandbox.simpaisa.com` |
| Production | `https://ibft.simpaisa.com` |

---

## APIs At A Glance

| API | Method | Path |
|-----|--------|------|
| Initiate Voucher | `POST` | [`/v2/payment/transaction/initiate`](./initiate.md) |
| Inquire E-Bill Payment | `POST` | [`/ibft/transaction/verify`](./inquire.md) |

---

## Common Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |
