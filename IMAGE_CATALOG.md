# Image & Flow Diagram Catalog

All diagrams and images from the live GitBook docs, preserved using GitBook-native `/files/{id}` references. **Paste these blocks directly into GitBook** — assets stay linked to your existing space.

## How To Use

```markdown
<figure>
  <img src="/files/FILE_ID" alt="Description">
  <figcaption>Caption</figcaption>
</figure>
```

---

## Unified Pay-In (BD · NP · EG · IQ)

**No flow diagrams** existed on the legacy country pay-in pages. The [overview](./pay-in-apis/unified-pay-in/overview.md) uses a Mermaid sequence diagram instead. Upload a custom diagram in GitBook if needed.

---

## API Hub & General

| File ID | Original location | New location (planned) | Description |
|---------|-------------------|------------------------|-------------|
| `lMtz0oKSwoEiv1A1wcVC` | Simpaisa API Hub | Getting Started → Overview | Hub hero / overview graphic |

```markdown
<figure><img src="/files/lMtz0oKSwoEiv1A1wcVC" alt="Simpaisa API Hub overview"><figcaption></figcaption></figure>
```

---

## Pakistan — Wallet Pay-in

| File ID | Original location | New location (planned) | Description |
|---------|-------------------|------------------------|-------------|
| `5LKxs85WguuQyHhG1rTZ` | Mobile Wallets → Easypaisa user journey | Initiate → Use case: Easypaisa OTP | Easypaisa one-time user journey |
| `TlwVSDWkcsw4Z8CLANGq` | Mobile Wallets → Jazzcash user journey | Initiate → Use case: Jazzcash OTP | JazzCash one-time user journey |
| `GgXvnXhIaAALLguIOvCH` | Wallet APIs (One Time Payment) | Initiate → Overview | One-time payment flow |
| `3Ho2Lnac1H5Hkj7w5c4r` | Async Flow | Initiate/Verify → Async use cases | Async wallet flow |
| `X848SJ0nntirynMM1FWi` | Wallet APIs (Tokenisation) | Tokenization → Overview | Tokenization overview |
| `pXULfbEJavfldHqg8989` | Jazzcash tokenization initiate | Tokenization → Jazzcash hosted page | Jazzcash registration hosted page |
| `Gy8GWpcsdOTip7Pgx97s` | Jazzcash tokenization | Tokenization → Jazzcash OTP screen | Jazzcash OTP approval screen |
| `OFElV98cpxX1jW1IkFVD` | Non OTP Flow | Verify → Use case: Non-OTP | Non-OTP user journey (1) |
| `YOgEDS65VEgq8jwzRUxk` | Non OTP Flow | Verify → Use case: Non-OTP | Non-OTP user journey (2) |

---

## Pakistan — IBFT, E-Billing, Hosted Page

| File ID | Original location | New location (planned) | Description |
|---------|-------------------|------------------------|-------------|
| `9RIH39UvzHUbQuoc62Co` | 1-Bill / Pull IBFT | IBFT → Initiate | Pull IBFT user journey |
| `YKmHGxpwbQRY7eIHdehO` | Hosted Page | Hosted Page → Generate link | Hosted checkout page |
| `pQIjNzRGISk4H9HnvymW` | E-Invoice | E-Invoice → Dashboard step 1 | E-invoice dashboard |
| `4GYy8JMm1MwNbWgTmr5y` | E-Invoice | E-Invoice → Generate link | Generate payment link |
| `rMz19T36Bkn7uZxW8fzc` | E-Invoice | E-Invoice → Customer form | Customer details form |
| `5xiweLgauW9W1BmObemQ` | E-Invoice | E-Invoice → Payment options | Payment channel selection |
| `YWAk8osr5Df2ahp0YBeJ` | E-Invoice / Webhooks | E-Invoice → Completion | Payment completion |

---

## Pakistan — Cards

| File ID | Original location | New location (planned) | Description |
|---------|-------------------|------------------------|-------------|
| `na78esNmL08yJ6ZjQ6Ey` | Cards → Payment | Cards → Payment | Card payment process |
| `WcOigQo1inzv6gXeNXre` | Cards → Refunds | Cards → Refunds | Card refund process |

---

## Pakistan — Pay-Outs

| File ID | Original location | New location (planned) | Description |
|---------|-------------------|------------------------|-------------|
| `HHk7tlx8te0ZPUXPcuMZ` | Register customer | Register Customer API | Register beneficiary flow |
| `3JDfEjcliDrKUXpXWdRP` | Update customer | Update Customer API | Update beneficiary flow |
| `73pbcFJnn5FIhZM8ucPC` | Get customer | Get Customer API | Fetch beneficiary flow |
| `PrDXVaI5Y77n7UCkWd8E` | Fetch bank list | List Banks API | Bank list flow |
| `9U2unEq2qIKmjd7PFqpT` | Initiate disbursement | Initiate Disbursement API | Disbursement initiate flow |
| `0DtalhnURvSaU9B4WbnW` | Re-initiate disbursement | Re-initiate Disbursement API | Re-initiate flow |
| `2dDfubb7gUQTDb3WLIi3` | Update disbursement | Update Disbursement API | Update disbursement flow |
| `q6UKvHYhaFpg5IfgiZ0e` | Balance data | Balance Inquiry API | Balance inquiry flow |
| `qRSofHLDvt7BaqVqkNa9` | Fetch account title | Fetch Account Title API | Account title verification |
| `rnxUvLJ8w8zNL19Y0cXA` | Transfer reasons | List Transfer Reasons API | Reasons list flow |
| `dqX8B1NaDQYnjaFW4idm` | List disbursements | List Disbursements API | List disbursements flow |
| `b7Fegv6hDhrnFGbANxDP` | Get by reference | Get Disbursement API | Get by reference flow |
| `aOztDBm6Zu2RPwuqbFku` | Get by UUID | Get Disbursement API | Get by UUID flow |

---

## Pakistan — Remittances

| File ID | Original location | New location (planned) | Description |
|---------|-------------------|------------------------|-------------|
| `kqJyigbpRXiWHTwrpEMN` | Banks list (PK) | List Banks API → PK tab | Banks list flow |
| `QkCDTfS0s5VdC2Q6BmaI` | Bank list by code | List Banks by Code API | Bank branches flow |
| `RMCpW4S07WFUhc22QVdh` | Payment purposes | List Payment Purposes API | Purposes list flow |
| `IuGRN9zGtbtT5TcE0QFz` | Account title verify | Verify Account Title API | Beneficiary verification |
| `bG9hLjYZmGc4cMckAoAi` | Direct remit (single) | Remit Initiate → Single flow | Single API remittance |
| `PoGjwwarNtAvoXRek5lX` | Register remit (double) | Register Remit API | Double flow — register |
| `Ry9gVAjaH5eS7ML1x5b9` | Remit initiate (double) | Remit Initiate → Double flow | Double flow — initiate |
| `mLFRckTIgiDsbhDeAZAi` | Transaction inquiry | Transaction Inquiry API | Remittance inquiry flow |
| `54d8W8t4AZY9ug1DfP6Z` | Merchant balance | Merchant Balance Inquiry API | Balance inquiry flow |

---

## Bangladesh — Remittances (page 2 Export)

| File ID | Original location | New location (planned) | Description |
|---------|-------------------|------------------------|-------------|
| `kp7mDNg9yEH6SdUn4SHV` | Banks list (BD) | List Banks API → BD tab | BD banks list |
| `3HFfOLbOh6AZuPRHB52E` | Bank list by code (BD) | List Banks by Code → BD tab | BD bank branches |
| `F4bjGK1JuCxqGPkjGX4d` | FX Rate (BD) | Get FX Rate → BD tab | FX rate flow |
| `pp8WHd8EivY7nrKpbT0t` | Payment purposes (BD) | List Payment Purposes → BD tab | BD purposes |
| `hp7SAS2AMOf0D66PzI8a` | Direct remit (BD) | Remit Initiate → BD single | BD single remit |
| `5eRqjphF1HFCrWNzAVbC` | Register remit (BD) | Register Remit → BD tab | BD register remit |
| `8eTO8i1kGrxhFpDw8PAD` | Remit initiate (BD) | Remit Initiate → BD double | BD remit initiate |
| `fE1avbdYWKQUauXEccqG` | Merchant balance (BD) | Merchant Balance → BD tab | BD balance inquiry |

---

## External Images (CDN)

| URL | Location | Description |
|-----|----------|-------------|
| `https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/pk.svg` | Regional coverage table | Pakistan flag |
| `https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/bd.svg` | Regional coverage table | Bangladesh flag |
| `https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/np.svg` | Regional coverage table | Nepal flag |
| `https://static.simpaisa.com/banks/*.png` | Remittance bank list responses | Bank logos in API samples |

---

## Copy-paste Template (all Wallet Journey Images)

<details>
<summary>Pakistan wallet journey diagrams</summary>

**Easypaisa journey**
```markdown
<figure><img src="/files/5LKxs85WguuQyHhG1rTZ" alt="Easypaisa one-time payment user journey"><figcaption>Easypaisa one-time payment user journey</figcaption></figure>
```

**JazzCash journey**
```markdown
<figure><img src="/files/TlwVSDWkcsw4Z8CLANGq" alt="JazzCash one-time payment user journey"><figcaption>JazzCash one-time payment user journey</figcaption></figure>
```

**Async flow**
```markdown
<figure><img src="/files/3Ho2Lnac1H5Hkj7w5c4r" alt="Async wallet payment flow"><figcaption>Async wallet payment flow</figcaption></figure>
```

**Tokenization overview**
```markdown
<figure><img src="/files/X848SJ0nntirynMM1FWi" alt="Wallet tokenization flow"><figcaption>Wallet tokenization flow</figcaption></figure>
```

</details>
