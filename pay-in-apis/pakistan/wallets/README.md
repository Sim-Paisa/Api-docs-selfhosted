# Pakistan Wallet Pay-In — Draft Index

GitBook-ready markdown for **Pakistan Wallet Pay-In APIs**.

## Pages

| File | GitBook page title |
|------|-------------------|
| [overview.md](./overview.md) | Pakistan Wallets — Overview |
| [initiate.md](./initiate.md) | Initiate Payment |
| [verify.md](./verify.md) | Verify Payment |
| [inquire.md](./inquire.md) | Inquire Payment |
| [refund.md](./refund.md) | Refund |
| [tokenization/overview.md](./tokenization/overview.md) | Tokenization — Overview |
| [tokenization/initiate.md](./tokenization/initiate.md) | Tokenization — Initiate |
| [tokenization/verify.md](./tokenization/verify.md) | Tokenization — Verify (Easypaisa) |
| [tokenization/finalize.md](./tokenization/finalize.md) | Tokenization — Finalize (JazzCash) |
| [tokenization/direct-charge.md](./tokenization/direct-charge.md) | Tokenization — Direct Charge |
| [tokenization/delink.md](./tokenization/delink.md) | Tokenization — Delink |

## Images (all `/files/{id}` Preserved)

| ID | Used in |
|----|---------|
| `5LKxs85WguuQyHhG1rTZ` | overview — Easypaisa journey |
| `TlwVSDWkcsw4Z8CLANGq` | overview — JazzCash journey |
| `GgXvnXhIaAALLguIOvCH` | overview — one-time payment |
| `3Ho2Lnac1H5Hkj7w5c4r` | overview, initiate — async flow |
| `X848SJ0nntirynMM1FWi` | tokenization/overview |
| `pXULfbEJavfldHqg8989` | tokenization/initiate — JazzCash hosted |
| `Gy8GWpcsdOTip7Pgx97s` | tokenization/initiate — JazzCash OTP |
| `OFElV98cpxX1jW1IkFVD` | verify — non-OTP step 1 |
| `YOgEDS65VEgq8jwzRUxk` | verify — non-OTP step 2 |

## Publishing In GitBook

1. Create folder **Pay-In APIs → Pakistan Wallets**
2. Paste each `.md` file as a page (tokenization as sub-pages)
3. Set sidebar order per table above
4. Add redirects from old URLs under `/reference/pakistan/pay-ins/mobile-wallets/`
