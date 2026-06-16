# Integration Checklist

Use this checklist before going live with any Simpaisa API family.

---

## 1. Onboarding

- [ ] Request sandbox credentials from the Simpaisa integration team
- [ ] Receive your **Merchant ID (MID)**
- [ ] Confirm which products and regions are enabled for your account
- [ ] Configure your **postback / webhook URL** (dashboard or share with integration team)

---

## 2. Authentication

| API family | Action |
|------------|--------|
| Unified pay-in (BD · NP · EG · IQ) | Obtain `api-token`; set `mode`, `region`, `operatorId`, `version` headers |
| PK wallet pay-in | Use merchant credentials per wallet API |
| Pay-out / remittance | Generate **RSA 2048-bit PKCS#8** key pair; exchange public key with Simpaisa |
| Cards (PK) | Obtain `secretKey` for AES card encryption; RSA for request/response signatures |

See [API Token Authentication](../platform-reference/authentication/api-token.md), [RSA Signatures & Mutual SSL](../platform-reference/authentication/rsa-mutual-ssl.md), and [Signature samples](../platform-reference/signature-samples.md).

---

## 3. Mutual SSL (pay-out & remittance — production)

- [ ] Generate client certificate and keystore
- [ ] Share certificate with Simpaisa integration team
- [ ] Verify TLS 1.2+ and mutual SSL handshake in staging
- [ ] Confirm IP whitelisting if required

---

## 4. Pay-In integration

- [ ] Implement Initiate → customer flow → Inquire (or Verify for PK wallets)
- [ ] Handle [webhooks](../platform-reference/webhooks.md) for async final status
- [ ] Map [status codes](../platform-reference/status-codes/) for your product
- [ ] For PK wallet Verify: implement idempotency with `Request-Id` header (UUID)

---

## 5. Pay-Out integration (PK)

- [ ] Prefund sandbox account (Simpaisa handles sandbox prefunding)
- [ ] [List banks](../pay-out-apis/list-banks.md) and map `destinationBank` codes
- [ ] [Register customers](../pay-out-apis/register-customer.md) before disbursement
- [ ] [Initiate disbursement](../pay-out-apis/initiate-disbursement.md) with transfer reason code
- [ ] Handle disbursement postbacks; reconcile with [Get Disbursement](../pay-out-apis/get-disbursement.md)
- [ ] Monitor balance via [Balance Inquiry](../pay-out-apis/balance-inquiry.md)

---

## 6. Pay-Out integration (BD)

- [ ] Obtain bank/branch CSV from integration team
- [ ] [Initiate disbursement](../pay-out-apis/initiate-disbursement.md) with inline beneficiary details
- [ ] [Inquire disbursement](../pay-out-apis/inquire-disbursement.md) for status reconciliation

---

## 7. Remittance integration

- [ ] Confirm single-API vs double-API flow with your integration POC
- [ ] Refresh [bank list](../remittance-apis/list-banks.md) periodically (weekly/monthly)
- [ ] (PK) Optionally [verify account title](../remittance-apis/verify-account-title.md) before remitting
- [ ] (BD) Resolve `beneficiaryBankId` via list → list-by-code flow
- [ ] Map [payment purpose codes](../remittance-apis/payment-reasons-reference.md)
- [ ] Handle remittance postbacks; use [Transaction Inquiry](../remittance-apis/transaction-inquiry.md) as backup
- [ ] Check [merchant balance](../remittance-apis/merchant-balance-inquiry.md) before large batches

---

## 8. Pre-production validation

- [ ] End-to-end sandbox test for each enabled operator/channel
- [ ] Webhook endpoint returns HTTP `200` with `{ "status": "success" }` (or plain `200` where documented)
- [ ] Verify RSA response signatures on signed APIs
- [ ] Error handling and retry logic for pending/async states
- [ ] Sign-off with Simpaisa integration team before production credentials
