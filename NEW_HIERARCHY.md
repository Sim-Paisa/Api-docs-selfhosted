# Simpaisa Docs — Proposed API-First Hierarchy

> **Principle:** Top-level navigation is **APIs**, not regions or product flows. Regions, operators, and use cases appear **under** each API as configuration or examples—not as separate doc trees.

---

## Design rules

1. **One page per API** — endpoint, headers, request/response, errors live on the API page.
2. **Use cases are children** — operator-specific flows (Easypaisa OTP, Jazzcash async, Khalti redirect) are nested under the relevant API.
3. **Unify identical endpoints** — BD, NP, EG, IQ share `POST /payins/payments/initiate` and `POST /payins/payments/inquire`; one doc with a regional configuration table.
4. **Deduplicate cross-cutting content** — authentication, webhooks, status codes, signature samples appear once at the platform level (or once per API family).
5. **Retire flow-based navigation** — remove `OTP Flow`, `Async Flow`, `Non OTP Flow` as sidebar parents; fold content into API + use case pages.
6. **Tokenization** — recurring / saved-wallet flows are grouped under a **Tokenization** use-case family (Initiate → Verify/Finalize → Direct Charge → Delink), not under a generic “OTP Flow” parent.

---

## New sidebar tree

```
Simpaisa API Hub
│
├── 1. Getting Started
│   ├── Overview
│   ├── Environments & Base URLs
│   ├── Regional Coverage (summary table)
│   └── Integration Checklist
│
├── 2. Platform Reference
│   ├── Authentication & Security
│   │   ├── API token (unified pay-in regions)
│   │   ├── RSA signatures & mutual SSL (pay-out / remittance)
│   │   └── Card encryption (AES + RSA)
│   ├── Webhooks & Postbacks
│   ├── Idempotency
│   ├── Error Handling
│   ├── Status Codes
│   │   ├── Pay-In (wallet — PK)
│   │   ├── Pay-In (unified regions)
│   │   ├── Cards
│   │   ├── Pay-Out
│   │   └── Remittance
│   └── Sample Code — Signature Generation
│
├── 3. Pay-In APIs
│   │
│   ├── 3.1 Unified Pay-In (BD · NP · EG · IQ)
│   │   ├── Overview & redirect flow
│   │   ├── Regional configuration
│   │   │   └── Operators, headers, currencies (single table)
│   │   ├── Initiate Payment          POST /payins/payments/initiate
│   │   │   ├── Use case: bKash (BD)
│   │   │   ├── Use case: Nagad (BD)
│   │   │   ├── Use case: Khalti (NP)
│   │   │   ├── Use case: Paymob (EG)
│   │   │   └── Use case: Wayl (IQ)
│   │   └── Inquire Payment           POST /payins/payments/inquire
│   │
│   ├── 3.2 Pakistan (`pay-in-apis/pakistan/`)
│   │   ├── Overview
│   │   │
│   │   ├── Wallets (`pakistan/wallets/`)
│   │   │   ├── Overview (operators, base URLs, common headers)
│   │   │   ├── Initiate                  POST /v2/wallets/transaction/initiate
│   │   │   │   ├── Use case: Easypaisa — one-time (OTP)
│   │   │   │   ├── Use case: Jazzcash — one-time (OTP)
│   │   │   │   ├── Use case: HBL Konnect — one-time (OTP)
│   │   │   │   ├── Use case: Alfa — one-time (OTP)
│   │   │   │   ├── Use case: Easypaisa — async (no OTP on initiate)
│   │   │   │   ├── Use case: Jazzcash — async
│   │   │   │   ├── Use case: Alfa — async
│   │   │   │   └── Use case: HBL Konnect — async
│   │   │   ├── Verify                    POST /v2/wallets/transaction/verify
│   │   │   │   ├── Use case: OTP completion (all OTP wallets)
│   │   │   │   ├── Use case: Async completion
│   │   │   │   └── Use case: Non-OTP (merchant-approved)
│   │   │   ├── Inquire                   POST /v2/inquire/wallet/transaction/inquiry
│   │   │   │   └── Use case: Status check when postback missing
│   │   │   ├── Tokenization
│   │   │   │   ├── Overview (Easypaisa & Jazzcash only)
│   │   │   │   ├── Initiate (tokenization)     → same Initiate API, transactionType tokenized
│   │   │   │   │   ├── Use case: Easypaisa
│   │   │   │   │   └── Use case: Jazzcash (API + hosted registration GET)
│   │   │   │   ├── Verify (tokenization)     POST /v2/wallets/transaction/verify
│   │   │   │   │   └── Use case: Easypaisa
│   │   │   │   ├── Finalize                    POST /v2/wallets/transaction/finalize
│   │   │   │   │   └── Use case: Jazzcash (after hosted page return)
│   │   │   │   ├── Direct Charge               POST /v2/wallets/transaction/direct-payment
│   │   │   │   │   └── Use case: Easypaisa & Jazzcash recurring charge
│   │   │   │   └── Delink                      POST /v2/wallets/transaction/delink
│   │   │   │       └── Use case: Easypaisa & Jazzcash unsubscribe
│   │   │   └── Refund                    POST /v3/transaction/refund
│   │   │       ├── Use case: Full refund
│   │   │       └── Use case: Partial refund
│   │   │
│   │   ├── IBFT (`pakistan/ibft/`) — 1-Bill
│   │   │   ├── Initiate                  POST /ibft/transaction/initiate
│   │   │   └── Verify                    POST /ibft/transaction/verify
│   │   │
│   │   ├── E-Billing (`pakistan/e-billing/`)
│   │   │   ├── Initiate Voucher          POST v2/payment/transaction/initiate
│   │   │   └── Inquire E-Bill Payment
│   │   │
│   │   ├── Hosted Page (`pakistan/hosted-page/`) & E-Invoice
│   │   │   ├── Generate hosted page link
│   │   │   ├── Inquire payment status
│   │   │   └── E-Invoice / Link to Pay
│   │   │
│   │   └── Cards (`pakistan/cards/`)
│   │       ├── Overview (flows: onetime · tokenization · directcharge)
│   │       ├── Payment                 POST /cards/payment
│   │       ├── Capture                 POST /cards/capture
│   │       ├── Void                    POST cards-refund/reverse
│   │       ├── Inquiry                 POST /cards/inquiry
│   │       ├── Finalize                POST /cards/finalize
│   │       ├── Refunds
│   │       └── Postbacks & response codes
│
├── 4. Pay-Out APIs
│   ├── Overview & disbursement lifecycle
│   ├── Disbursement states
│   │
│   ├── Register Customer           POST /merchants/{id}/disbursements/register-customer
│   │   └── Region: PK only
│   ├── Update Customer             PUT  …/register-customer
│   │   └── Region: PK only
│   ├── Get Customer                GET  …/register-customer
│   │   └── Region: PK only
│   ├── List Banks                  GET  …/disbursements/banks
│   │   ├── Region: PK
│   │   └── Region: BD (CSV reference — link from page)
│   ├── Fetch Account Title         POST …/disbursements/fetch-account
│   │   └── Region: PK
│   ├── List Transfer Reasons       GET  …/disbursements/reasons
│   │   └── Region: PK
│   ├── Initiate Disbursement       POST …/disbursements/initiate
│   │   ├── Region: PK (registered beneficiary flow)
│   │   └── Region: BD (direct initiate — inline beneficiary)
│   ├── Re-initiate Disbursement    PUT  …/disbursements/initiate
│   │   └── Region: PK
│   ├── Update Disbursement         PUT  …/disbursements/initiate
│   │   └── Region: PK
│   ├── List Disbursements          POST …/disbursements
│   │   └── Region: PK
│   ├── Get Disbursement            GET  …/disbursements?reference= | ?uuid=
│   │   └── Region: PK
│   ├── Inquire Disbursement        (BD transaction inquiry — unified page, regional examples)
│   │   ├── Region: PK
│   │   └── Region: BD
│   ├── Balance Inquiry             GET  …/disbursements/balance-data
│   │   └── Region: PK
│   └── List Banks & Wallets (reference data)
│       └── Region: PK
│
└── 5. Remittance APIs
    ├── Overview & remittance lifecycle
    ├── Remittance states
    ├── List payment reasons (reference)
    │
    ├── List Banks                  GET  /remittance/{id}/banks/listByAccountType
    │   ├── Region: PK
    │   └── Region: BD
    ├── List Banks by Code          GET  /remittance/{id}/banks/list/{bankCode}
    │   ├── Region: PK
    │   └── Region: BD
    ├── List Payment Purposes       GET  /remittance/{id}/reasons/list
    │   ├── Region: PK
    │   └── Region: BD
    ├── Get FX Rate                 POST /remittance/{id}/getFxRate
    │   ├── Region: PK
    │   └── Region: BD
    ├── Verify Account Title        POST /remittance/{id}/fetch-account
    │   └── Region: PK
    ├── Remit Initiate (single)     POST /remittance/{id}/remit-initiate
    │   ├── Region: PK — direct remit
    │   └── Region: BD — direct remit
    ├── Register Remit (double)     POST (register step)
    │   ├── Region: PK
    │   └── Region: BD
    ├── Remit Initiate (double)     POST (initiate step)
    │   ├── Region: PK
    │   └── Region: BD
    ├── Transaction Inquiry
    │   ├── Region: PK
    │   └── Region: BD
    └── Merchant Balance Inquiry
        ├── Region: PK
        └── Region: BD
```

---

## Unified regional pay-in — configuration table

Single source of truth on **3.1 Unified Pay-In → Regional configuration**:

| Region | `region` header | Currency | Operators (`operatorId`) | Production base URL | Auth |
|--------|-----------------|----------|--------------------------|---------------------|------|
| Bangladesh | `BD` | BDT | bKash `10001`, Nagad `10002` | `payin.simpaisa.com` | `api-token` |
| Nepal | `NP` | NPR | Khalti `100025` | `payin.simpaisa.com` | `api-token` |
| Egypt | `EG` | EGP | Paymob `100026` | `payin.simpaisa.com` | `api-token` |
| Iraq | `IQ` | IQD | Wayl `100027` | `payin.simpaisa.com` | `api-token` |

**Shared endpoints (all four):**

| API | Method | Path |
|-----|--------|------|
| Initiate | POST | `/payins/payments/initiate` |
| Inquire | POST | `/payins/payments/inquire` |

**Shared flow:** Initiate → redirect customer to `payment_url` → customer returns to success/failure URL → merchant calls Inquire for final status → optional postback.

---

## Pakistan wallet — API → use case map

| API | Endpoint | Former doc location(s) |
|-----|----------|------------------------|
| **Initiate** | `POST /v2/wallets/transaction/initiate` | OTP: Easypaisa/Jazzcash, HBL, Alfa initiate pages; Async: all initiate pages; Tokenization: Easypaisa/Jazzcash initiate |
| **Verify** | `POST /v2/wallets/transaction/verify` | OTP verify pages; Async verify pages; Non-OTP Verify API; Tokenization Easypaisa verify |
| **Inquire** | `POST /v2/inquire/wallet/transaction/inquiry` | Payment Status Inquiry; Simpaisa Payment Status Inquiry; Non-OTP Inquiry API |
| **Finalize** | `POST /v2/wallets/transaction/finalize` | Jazzcash tokenization finalize |
| **Direct Charge** | `POST /v2/wallets/transaction/direct-payment` | Direct Charge API |
| **Delink** | `POST /v2/wallets/transaction/delink` | Delink Account API |
| **Refund** | `POST /v3/transaction/refund` | Simpaisa Refund API; Partial Refund |

---

## What gets removed or merged

| Retire as nav item | Absorbed into |
|--------------------|---------------|
| `Pakistan → Pay-Ins → Mobile Wallets` (parent) | `pay-in-apis/pakistan/wallets/` |
| `OTP Flow` | Use cases under **Initiate** / **Verify** |
| `Async Flow` | Use cases under **Initiate** / **Verify** / **Inquire** |
| `Non OTP Flow` | Use case under **Verify** + **Inquire** |
| `Wallet APIs (One Time Payment)` | Use cases under **Initiate** / **Verify** |
| `Wallet APIs (Tokenisation)` | **Tokenization** subtree |
| `Bangladesh / Nepal / Egypt / Iraq` (top-level) | **3.1 Unified Pay-In** + regional config |
| Duplicate `Encryption and Authentication` (×3) | **Platform Reference → Authentication** |
| Duplicate `Creating Webhook(s)` (×4) | **Platform Reference → Webhooks** |
| Duplicate `Status Codes Mapping` (×6+) | **Platform Reference → Status Codes** (tabbed by product) |
| Duplicate remittance APIs (PK + BD separate pages) | One API page, regional examples as tabs |

---

## GitBook implementation order

1. Create **Platform Reference** section; move shared content.
2. Create **3.1 Unified Pay-In**; merge BD/NP/EG/IQ pay-in pages.
3. Create **3.2 Pakistan** master folder (`pay-in-apis/pakistan/`) with subfolders for wallets, IBFT, e-billing, hosted page, and cards; move operator pages to use-case children.
4. Rebuild **Tokenization** subtree under wallet APIs.
5. Flatten **Cards** (already mostly API-named — minor reorder only).
6. Rebuild **Pay-Out** and **Remittance** sections API-first; add regional tabs.
7. Update **API Hub** landing page to link to APIs, not countries.
8. Set up redirects from old URLs (GitBook redirects or keep stub pages with “moved to…”).

---

## Open decisions (confirm with team)

1. **Egypt** — docs show `operatorId: 100025` in headers but operator table lists Paymob `100026`. Standardize in unified config table.
2. **“OTP Flow” → “Tokenization”** — current docs separate one-time OTP from tokenization. This plan keeps **tokenization** for saved-wallet/recurring only; one-time OTP becomes use cases under Initiate/Verify. Confirm this matches intent.
3. **Bangladesh pay-in** — include BD in unified section even though it also has pay-out/remittance (only pay-in merges).
4. **Hosted Page / E-Invoice** — keep as integration method group under pay-in, or promote to first-class APIs if distinct endpoints exist.
