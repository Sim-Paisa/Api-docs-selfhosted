# Pay-Outs

The Simpaisa Disbursement API lets you transfer funds to end beneficiaries directly from your app or web platform, covering mobile wallets and bank accounts with a strict KYC and screening system.

## Key Features

- **Extensive reach** — covers all the major banks and mobile wallets in your region, ensuring widespread accessibility for your beneficiaries.
- **Pre-funded model** — merchants pre-fund their accounts with Simpaisa, enabling swift and secure transactions for both merchants and beneficiaries.
- **API-based solution** — real-time, secure fund transfers that integrate into your existing platform.
- **Bulk disbursement via CSV** — for larger-scale operations, the system supports bulk disbursement through CSV files for efficient management of multiple transactions.
- **Centralized dashboard** — monitor success rates, review transactions, and access detailed reporting from a single dashboard.

## Getting Started

To begin the integration, refer to the following sections in this documentation:

- **2-way mutual SSL handshake** — establish the SSL handshake between servers to make API calls.
- **Endpoints and methods** — the API endpoints and methods available for initiating and managing disbursement transactions.
- **Request and response formats** — the expected request formats and corresponding response structures.
- **Error handling** — handle errors and exceptions to create a robust, reliable integration.
- **Bulk disbursement guidelines** — if using bulk disbursement through CSV, refer to the dedicated section for guidelines and best practices.

If you have any questions or require assistance during integration, our support team is ready to help.

> **Applies to:** Both

---

## Pakistan

### Base URLs

| Environment | URL |
|-------------|-----|
| Sandbox / Staging | `https://sandbox.simpaisa.com` |
| Production / Live | `https://disb.simpaisa.com` |

### Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |
| `mode` | `payout` |
| `region` | `PK` |
| `version` | `3.0` |

### Disbursement Flow

Before integrating, understand how the flow works and which calls need to be made.

1. **Pre-fund your account** with Simpaisa. To test disbursement APIs, you must pre-fund your account to provide testing credit. On sandbox, pre-funding is done by Simpaisa, since transactions only run against restricted or whitelisted accounts.
2. **Receive your Merchant ID (MID)** from the Simpaisa integration team.
3. **Check the list of available banks and wallets** on which disbursement can be made — useful for building a dropdown for the sender.
4. **Generate an RSA key pair** for signature generation and verification (2048-bit, PKCS8 padding, SHA-256). You sign API requests with the RSA private key; Simpaisa verifies them with your RSA public key.
5. **Establish 2-way (mutual) SSL authentication.**
6. **Register the customer or beneficiary** by passing their details to Simpaisa. The details are mapped against a reference number (customer reference ID) used to fetch details or initiate disbursement.
7. **Initiate the disbursement** against the registered reference number, for the desired amount and payment reason.
8. **Handle the postback** (Instant Payment Notification) for every payment request to finalize the transaction status.

---

## Bangladesh

### Base URLs

| Environment | URL |
|-------------|-----|
| Sandbox | `https://sandbox.simpaisa.com` |
| Production | `https://payout.simpaisa.com` |

### Headers

| Header | Value |
|--------|-------|
| `Accept` | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json` |
| `mode` | `payout` |
| `region` | `BD` |
| `version` | `3.0` |

### Disbursement Flow

1. **Pre-fund your account** with Simpaisa. To test disbursement APIs, you must pre-fund your account to provide testing credit. On sandbox, pre-funding is done by Simpaisa, since transactions only run against restricted or whitelisted accounts.
2. **Receive your Merchant ID (MID)** from the Simpaisa integration team.
3. **Receive a CSV** listing all banks and branches available for disbursement, along with their respective bank IDs.
4. **Generate an RSA key pair** for signature generation and verification (2048-bit, PKCS8 padding, SHA-256). You sign API requests with the RSA private key; Simpaisa verifies them with your RSA public key.
5. **Establish 2-way (mutual) SSL authentication.**
6. **Initiate the disbursement** by passing the relevant details in the API.
7. **Handle the postback** (Instant Payment Notification) for every payment request to finalize the transaction status.
