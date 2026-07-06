---
sidebar_position: 1050
sidebar_label: "Overview"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Overview

The Simpaisa Remittance API lets you integrate cross-border remittances into your platform. Merchants can send funds to beneficiaries across Pakistan, Bangladesh and Egypt through major banks and mobile wallets.

## Key Features

* **Extensive reach** — covers all the major banks and mobile wallets in Pakistan, Bangladesh and Egypt ensuring widespread accessibility for your beneficiaries.
* **Pre-funded model** — merchants pre-fund their accounts with Simpaisa, enabling swift and secure transactions for both merchants and beneficiaries.
* **API-based solution** — real-time, secure fund transfers that integrate into your existing platform for quick and efficient transactions.

## Getting Started

To begin the integration, refer to the following sections in this documentation:

* **Security** — establish the SSL handshake between servers, IP whitelisting, and RSA encryption.
* **Endpoints and methods** — the API endpoints and methods available for initiating and managing remittance transactions.
* **Request and response formats** — the expected request formats and corresponding response structures.
* **Error handling** — handle errors and exceptions to create a robust, reliable integration.

If you have any questions or require assistance during integration, our support team is ready to help.

> **Applies to:** All

***

## Base URLs

| Region     | Environment | URL                              |
| ---------- | ----------- | -------------------------------- |
| Pakistan   | Sandbox     | `https://sandbox.simpaisa.com`   |
| Pakistan   | Production  | `https://remit.commerceplex.com` |
| Bangladesh | Sandbox     | `https://sandbox.simpaisa.com`   |
| Bangladesh | Production  | `https://bd.commerceplex.com`    |
| Egypt      | Sandbox     | `https://sandbox.simpaisa.com`   |

***

## Headers

<Tabs>
<TabItem value="all-reigons" label="All Reigons">

| Header         | Value                                              |
| -------------- | -------------------------------------------------- |
| `Accept`       | `text/plain, application/json, application/*+json` |
| `Content-Type` | `application/json`                                 |
| `mode`         | `remittance`                                       |
| `region`       | `'PK' OR 'BD' OR 'EG'`                             |
| `version`      | `3.0`                                              |

</TabItem>
</Tabs>

***

## Remittance Flow

Before integrating, it is essential to understand how the flow works and which calls need to be made.

### Pakistan

1. **Obtain a Sandbox Merchant ID** from the integration team. These credentials authenticate your connection to the Remittance system.
2. **Provide a Sandbox Postback URL** and generate an RSA key pair (2048-bit, PKCS8 padding, SHA-256). You sign API requests with the RSA private key; Simpaisa verifies them with your RSA public key. The integration team configures this against your Merchant ID.
3. **Establish mutual SSL authentication** (only required for production).
4. **Retrieve bank IDs** using the Bank List API(s) for a wide range of banks and wallets. Keeping an updated list is essential for facilitating remittance — schedule this weekly, monthly, or quarterly. Alternatively, Simpaisa can provide a CSV list of bank and wallet IDs.
5. **Verify the exchange rate** using the FX APIs as needed. (Contact your integration POC to confirm if this is available.)
6. **Validate the beneficiary account** using the Bank Account Validation API to reduce failures caused by incorrect account information. Optional, but highly recommended.
7. **Initiate a remittance request** by passing the sender and beneficiary details. Consult your integration POC to confirm whether you are on the single or double API flow.
8. **Handle postback notifications** for every payment request so the final decision — rejected or successfully remitted — is properly recorded.

### Bangladesh

1. **Obtain a Sandbox Merchant ID** from the integration team. These credentials authenticate your connection to the Remittance system.
2. **Provide a Sandbox Postback URL** and generate an RSA key pair (2048-bit, PKCS8 padding, SHA-256). You sign API requests with the RSA private key; Simpaisa verifies them with your RSA public key. The integration team configures this against your Merchant ID.
3. **Establish mutual SSL authentication** (only required for production).
4. **Resolve the beneficiary bank ID:**
   * Call the [List Banks](pakistan/list-banks.md) API with only your Merchant ID (MID) in the GET request. The response returns a list of banks with their bank codes.
   * Pick the bank code of the bank you want to send money to.
   * Call the [List Banks by Code](list-banks-by-code.md) API, passing your Merchant ID, the bank code from the previous step, and the routing number of the target branch. This returns multiple fields including a `bankId`.
   * When calling `POST /remit-initiate`, pass this `bankId` as the `beneficiaryBankId` parameter.
5. **Verify the exchange rate** using the FX APIs as needed. (Contact your integration POC to confirm if this is available.)
6. **Initiate a remittance request** by passing the sender and beneficiary details. Consult your integration POC to confirm whether you are on the single or double API flow.
7. **Handle postback notifications** for every payment request so the final decision — rejected or successfully remitted — is properly recorded.
