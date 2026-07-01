# Simpaisa API Documentation — Complete GitBook Package

**98 pages** — API-first structure, fully populated from official Simpaisa GitBook export. Paste into GitBook from scratch (no redirects needed).

## Quick Publish

1. Open GitBook → your **simpaisa-docs** space.
2. Create page groups matching the folders below (or import via Git Sync).
3. For each `.md` file: create page → Markdown mode → paste entire file → save.
4. Follow **SUMMARY.md** for sidebar order.
5. Images using `/files/...` resolve automatically in the same GitBook space.

## Folder Structure

```
getting-started/           Overview, environments, regional coverage, checklist
platform-reference/        Auth, webhooks, idempotency, errors, status codes, signatures
pay-in-apis/
  unified-pay-in/          BD, NP, EG, IQ (shared APIs)
  pakistan/                Pakistan pay-in (all methods)
    overview.md            Landing page — links to all PK methods
    wallets/               Initiate, Verify, Inquire, Tokenization, Refund + use cases
    ibft/                  IBFT pull payments
    e-billing/             Voucher billing
    hosted-page/           Widget checkout + E-Invoice
    cards/                 Card payments
pay-out-apis/              Disbursements (Pakistan + Bangladesh sections)
remittance-apis/           Remittances (Pakistan + Bangladesh sections)
```

## Supporting Files

| File | Purpose |
|------|---------|
| `SUMMARY.md` | GitBook sidebar / table of contents |
| `IMAGE_CATALOG.md` | All preserved `/files/{id}` diagram references |
| `NEW_HIERARCHY.md` | Architecture design notes |
| `PAGE_MIGRATION_MAP.csv` | Old URL → new path mapping (reference only) |

## Regenerate From Source Exports

If source docs update, re-run:

```powershell
powershell -ExecutionPolicy Bypass -File extract.ps1
powershell -ExecutionPolicy Bypass -File merge.ps1
powershell -ExecutionPolicy Bypass -File fix-missing.ps1
powershell -ExecutionPolicy Bypass -File cleanup.ps1
```

Source files required on Desktop:
- `simpaisa-docs-full.txt`
- `simpaisa-docs-full-page2.txt`
