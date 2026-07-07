---
sidebar_position: 110
sidebar_label: "Integration Checklist"
---

# Integration-checklist

Use this checklist before going live with any Simpaisa API family.

***

## 1. Onboarding

* [ ] Request sandbox credentials from the Simpaisa integration team
* [ ] Receive your **Merchant ID (MID)**
* [ ] Confirm which products and regions are enabled for your account
* [ ] Configure your **postback / webhook URL** (dashboard or share with integration team)

***

## 2. Authentication

| API family                         | Action                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Unified pay-in (BD · NP · EG · IQ) | Obtain `api-token`; set `mode`, `region`, `operatorId`, `version` headers       |
| PK wallet pay-in                   | Use merchant credentials per wallet API                                         |
| Pay-out / remittance               | Generate **RSA 2048-bit PKCS#8** key pair; exchange public key with Simpaisa    |
| Cards (PK)                         | Obtain `secretKey` for AES card encryption; RSA for request/response signatures |

See [API Token Authentication](../platform-reference/authentication/api-token.md), [RSA Signatures & Mutual SSL](../platform-reference/authentication/rsa-mutual-ssl.md), and [Signature samples](../platform-reference/signature-samples.md).

***

## 3. Mutual SSL (pay-out & Remittance — Production)

* [ ] Generate client certificate and keystore
* [ ] Share certificate with Simpaisa integration team
* [ ] Verify TLS 1.2+ and mutual SSL handshake in staging
* [ ] Confirm IP whitelisting if required

***

## 4. Pay-In Integration

* [ ] Implement Initiate → customer flow → Inquire (or Verify for PK wallets)
* [ ] Handle [webhooks](../platform-reference/webhooks.md) for async final status
* [ ] Map status codes for your product

***

## 5. Pay-Out Integration (PK)

* [ ] Prefund sandbox account (Simpaisa handles sandbox prefunding)
* [ ] [List banks](../pay-out-apis/pakistan/list-banks.md) and map `destinationBank` codes
* [ ] [Register customers](../pay-out-apis/pakistan/customer/register-customer.md) before disbursement
* [ ] [Initiate disbursement](../pay-out-apis/pakistan/disbursements/initiate-disbursement.md) with transfer reason code
* [ ] Handle disbursement postbacks; reconcile with [Get Disbursement](../pay-out-apis/pakistan/disbursements/get-disbursement.md)
* [ ] Monitor balance via [Balance Inquiry](../pay-out-apis/pakistan/balance-inquiry.md)

***

## 6. Pay-Out Integration (BD)

* [ ] Obtain bank/branch CSV from integration team
* [ ] [Initiate disbursement](../pay-out-apis/pakistan/disbursements/initiate-disbursement.md) with inline beneficiary details
* [ ] [Inquire disbursement](../pay-out-apis/pakistan/disbursements/inquire-disbursement.md) for status reconciliation

***

## 7. Remittance Integration

* [ ] Confirm single-API vs double-API flow with your integration POC
* [ ] Refresh [bank list](../remittance-apis/pakistan/list-banks.md) periodically (weekly/monthly)
* [ ] (PK) Optionally [verify account title](../remittance-apis/pakistan/verify-account-title.md) before remitting
* [ ] (BD) Obtain the Bank List CSV from your integration POC. You can obtain relevant BankIDs from this CSV
* [ ] Map [payment purpose codes](../remittance-apis/payment-reasons-reference.md)
* [ ] Handle remittance postbacks; use [Transaction Inquiry](../remittance-apis/transaction-inquiry.md) as backup
* [ ] Check [merchant balance](../remittance-apis/merchant-balance-inquiry.md) before large batches

***

## 8. Pre-production Validation

* [ ] End-to-end sandbox test for each enabled operator/channel
* [ ] Webhook endpoint returns HTTP `200`
* [ ] Error handling and retry logic for pending/async states
* [ ] Sign-off with Simpaisa integration team before production credentials and fill in the pre-production checklist here: [https://simpaisa.atlassian.net/servicedesk/customer/portal/114/create/304](https://simpaisa.atlassian.net/servicedesk/customer/portal/114/create/304)
