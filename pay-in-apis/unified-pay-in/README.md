# Unified Pay-In — Draft Index

GitBook-ready markdown for section **3.1 Unified Pay-In (BD · NP · EG · IQ)**.

## Pages

| File | GitBook page title |
|------|-------------------|
| [overview.md](./overview.md) | Unified Pay-In — Overview |
| [initiate.md](./initiate.md) | Initiate Payment |
| [inquire.md](./inquire.md) | Inquire Payment |
| [use-cases/bkash.md](./use-cases/bkash.md) | Use case: bKash |
| [use-cases/nagad.md](./use-cases/nagad.md) | Use case: Nagad |
| [use-cases/khalti.md](./use-cases/khalti.md) | Use case: Khalti |
| [use-cases/paymob.md](./use-cases/paymob.md) | Use case: Paymob |
| [use-cases/wayl.md](./use-cases/wayl.md) | Use case: Wayl |

## Platform Reference (linked)

| File | Purpose |
|------|---------|
| [../platform-reference/status-codes/pay-in-unified.md](../platform-reference/status-codes/pay-in-unified.md) | Status codes |
| [../platform-reference/webhooks.md](../platform-reference/webhooks.md) | Webhooks stub |

## Images

- Unified regions had **no legacy flow diagrams** — overview uses Mermaid.
- All other site images are in [IMAGE_CATALOG.md](../IMAGE_CATALOG.md) with `/files/{id}` blocks for Pakistan and remittance sections (next drafts).

## Publishing In GitBook

1. Create folder **Pay-In APIs → Unified Pay-In**
2. Paste each `.md` file as a page
3. Set sidebar order per table above
4. Add redirects from old URLs (`/reference/bangladesh/pay-ins`, etc.)

## Next Draft

**Pakistan Wallet APIs** (Initiate, Verify, Inquire, Tokenization) — includes all wallet journey diagrams from `IMAGE_CATALOG.md`.
