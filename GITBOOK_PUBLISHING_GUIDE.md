# GitBook Publishing Guide — Simpaisa API Docs

Use this document to publish the complete API documentation package into a **new GitBook space** with the correct API-first hierarchy. Intended for humans **or** another AI agent performing the upload.

---

## Package location

```
c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-restructure\
```

| File | Role |
|------|------|
| `SUMMARY.md` | **Authoritative sidebar order** — publish pages in this exact sequence |
| `GITBOOK_PUBLISHING_GUIDE.md` | This guide |
| `IMAGE_CATALOG.md` | All `/files/{id}` image references |
| `getting-started/`, `platform-reference/`, `pay-in-apis/`, `pay-out-apis/`, `remittance-apis/` | Page content |

**Total pages to publish:** 98 (listed in `SUMMARY.md`)

---

## Hierarchy flow (API-first)

```
Simpaisa API Documentation
│
├── 1. Getting Started
│   ├── Overview
│   ├── Environments & Base URLs
│   ├── Regional Coverage
│   └── Integration Checklist
│
├── 2. Platform Reference
│   ├── Authentication
│   │   ├── API Token (unified pay-in regions)
│   │   ├── RSA & Mutual SSL (pay-out / remittance)
│   │   └── Card Encryption (AES + RSA)
│   ├── Webhooks & Postbacks
│   ├── Idempotency
│   ├── Error Handling
│   ├── Signature Samples
│   └── Status Codes
│       ├── Pay-In — Unified (BD · NP · EG · IQ)
│       ├── Pay-In — Pakistan Wallets
│       ├── Cards
│       ├── Pay-Out
│       └── Remittance
│
├── 3. Pay-In APIs
│   │
│   ├── 3.1 Unified Pay-In (BD · NP · EG · IQ)
│   │   ├── Overview
│   │   ├── Initiate Payment          POST /payins/payments/initiate
│   │   ├── Inquire Payment           POST /payins/payments/inquire
│   │   └── Use cases
│   │       ├── bKash · Nagad · Khalti · Paymob · Wayl
│   │
│   ├── 3.2 Pakistan
│   │   ├── Overview
│   │   ├── Wallets
│   │   │   ├── Overview
│   │   │   ├── Initiate                  POST /v2/wallets/transaction/initiate
│   │   │   │   └── Use cases (OTP / async per operator)
│   │   │   ├── Verify                    POST /v2/wallets/transaction/verify
│   │   │   │   └── Use cases (OTP / async / non-OTP)
│   │   │   ├── Inquire                   POST /v2/inquire/wallet/transaction/inquiry
│   │   │   ├── Tokenization
│   │   │   │   ├── Overview
│   │   │   │   ├── Initiate · Verify · Finalize
│   │   │   │   ├── Direct Charge · Delink
│   │   │   │   └── Use cases (Easypaisa · Jazzcash)
│   │   │   └── Refund (+ partial refund use case)
│   │   │
│   │   ├── IBFT (1-Bill)
│   │   │   ├── Overview · Initiate · Verify
│   │   │
│   │   ├── E-Billing
│   │   │   ├── Initiate · Inquire
│   │   │
│   │   ├── Hosted Page & E-Invoice
│   │   │   ├── Overview · Inquire · E-Invoice
│   │   │
│   │   └── Cards
│   │       ├── Overview · Payment · Capture · Void
│   │       ├── Inquiry · Finalize · Refunds · Postbacks
│
├── 4. Pay-Out APIs
│   ├── Overview · Disbursement States
│   ├── Register / Update / Get Customer     (Pakistan)
│   ├── List Banks · Initiate / Re-initiate / Update Disbursement
│   ├── Balance · Fetch Account Title · Transfer Reasons
│   ├── List / Get Disbursement · Inquire      (PK + BD sections)
│   └── Banks Reference (Pakistan)
│
└── 5. Remittance APIs
    ├── Overview · Remittance States · Payment Reasons
    ├── List Banks · List Banks by Code · FX Rate
    ├── Payment Purposes · Verify Account Title (PK)
    ├── Remit Initiate (single + double flow) · Register Remit
    └── Transaction Inquiry · Merchant Balance Inquiry
```

**Design principle:** Navigation is by **API endpoint**, not by country. Regions appear as configuration tables, tabs, or use-case child pages — not as top-level country trees.

---

## Procedure A — New GitBook space (manual paste) — RECOMMENDED

### Phase 1 — Create the space

1. Go to [https://app.gitbook.com](https://app.gitbook.com) and sign in.
2. Click **+ New** → **Space**.
3. Choose **Documentation** (or blank).
4. Name: **Simpaisa API Docs** (or keep `simpaisa-docs` if replacing).
5. Set visibility (Private while building, Public when ready).
6. **Do not** import the old space structure — this is a fresh API-first layout.

### Phase 2 — Create page groups (sidebar folders)

In the GitBook editor left sidebar, create **groups** (not pages yet) in this order:

1. `Getting Started`
2. `Platform Reference`
3. `Pay-In APIs`
   - Sub-groups (nested under Pay-In APIs):
     - `Unified Pay-In (BD · NP · EG · IQ)`
     - `Pakistan`
       - `Wallets`
       - `IBFT`
       - `E-Billing`
       - `Hosted Page`
       - `Cards`
4. `Pay-Out APIs`
5. `Remittance APIs`

Under **Platform Reference**, create sub-groups:

- `Authentication` (for api-token, rsa-mutual-ssl, card-encryption)
- `Status Codes` (for the five status-code pages)

Under **Pakistan → Wallets**, create sub-groups as needed:

- `Initiate` (parent page + use-case children)
- `Verify` (parent page + use-case children)
- `Tokenization` (overview, initiate, verify, finalize, direct-charge, delink + use-case children)
- `Refund` (parent + partial refund child)

### Phase 3 — Create pages and paste content

For **each line** in `SUMMARY.md` (top to bottom):

1. Create a new page in the correct group.
2. Set the **page title** from the link text in `SUMMARY.md` (e.g. `Initiate Payment`, not the filename).
3. Open the matching `.md` file from the package folder.
4. In GitBook: switch to **Markdown** view (or paste into block editor).
5. Paste the **entire file contents** unchanged.
6. Save.
7. Nest child pages under their parent (use cases under Initiate/Verify, etc.).

**Mapping `SUMMARY.md` paths → GitBook groups:**

| SUMMARY section | GitBook group |
|-----------------|---------------|
| `getting-started/*` | Getting Started |
| `platform-reference/authentication/*` | Platform Reference → Authentication |
| `platform-reference/webhooks.md` etc. | Platform Reference (root of group) |
| `platform-reference/status-codes/*` | Platform Reference → Status Codes |
| `pay-in-apis/unified-pay-in/*` | Pay-In APIs → Unified Pay-In |
| `pay-in-apis/pakistan/overview.md` | Pay-In APIs → Pakistan |
| `pay-in-apis/pakistan/wallets/*` | Pay-In APIs → Pakistan → Wallets |
| `pay-in-apis/pakistan/ibft/*` | Pay-In APIs → Pakistan → IBFT |
| `pay-in-apis/pakistan/e-billing/*` | Pay-In APIs → Pakistan → E-Billing |
| `pay-in-apis/pakistan/hosted-page/*` | Pay-In APIs → Pakistan → Hosted Page |
| `pay-in-apis/pakistan/cards/*` | Pay-In APIs → Pakistan → Cards |
| `pay-out-apis/*` | Pay-Out APIs |
| `remittance-apis/*` | Remittance APIs |

### Phase 4 — Images

- Content uses GitBook asset paths: `<img src="/files/FILE_ID" ...>`
- These resolve **only if** you publish into the **same GitBook organization/space** that already owns those uploaded files.
- **If new space in same org as old simpaisa-docs:** images should work automatically.
- **If completely new org with no assets:** re-upload images from `IMAGE_CATALOG.md` or duplicate the old space’s file library first.

### Phase 5 — Verify GitBook blocks

After pasting, preview pages that use:

- `{% tabs %}` / `{% tab title="..." %}`
- `{% hint style="info" %}` / `{% hint style="warning" %}`
- ` ```mermaid ` code blocks

Fix any blocks that render as raw text (re-insert via GitBook’s Tab/Hint/Mermaid blocks if needed).

### Phase 6 — Internal links

Markdown links like `./initiate.md` are for the repo. In GitBook:

- Replace with **internal page links** (GitBook link picker), or
- Leave as-is and fix broken links after publish using GitBook’s link tool.

### Phase 7 — Publish

1. Review in **Preview**.
2. Click **Publish** / **Merge to main** (wording depends on GitBook plan).
3. Set public URL (e.g. `simpaisa.gitbook.io/simpaisa-docs`).
4. Optionally unpublish or archive the **old** space once the new one is verified.

---

## Procedure B — Git Sync (GitHub/GitLab)

Use if you prefer automated sync instead of manual paste.

1. Create a **new Git repository** (e.g. `simpaisa-api-docs`).
2. Copy the entire `simpaisa-docs-restructure` folder into the repo root (include `SUMMARY.md`).
3. In GitBook: **Integrations → GitHub/GitLab** → connect repo.
4. Enable **Git Sync** for the new space.
5. GitBook imports `SUMMARY.md` as sidebar structure.
6. Commit and push; GitBook syncs on each push.

**Note:** Confirm your GitBook plan supports Git Sync. Folder paths in `SUMMARY.md` must match repo paths exactly.

---

## Procedure C — Duplicate old space, then replace content

If you need to **keep existing `/files/` images** without re-uploading:

1. **Duplicate** the current `simpaisa-docs` space in GitBook.
2. Delete old page tree (country-first structure).
3. Create new groups per Phase 2 above.
4. Paste new content from this package.
5. Images in markdown should still resolve.

---

## AI agent instructions (copy-paste prompt)

Give another AI the following prompt and point it at this folder:

```
You are publishing Simpaisa API documentation to GitBook.

WORKING DIRECTORY:
c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-restructure\

RULES:
1. Read SUMMARY.md — publish pages in EXACT order listed (98 pages).
2. For each entry: open the linked .md file, create the GitBook page in the correct group (see GITBOOK_PUBLISHING_GUIDE.md hierarchy), paste FULL file content without editing API details.
3. Page titles: use human-readable titles from SUMMARY link text, NOT filenames.
4. Nest children: wallet use-cases under Initiate/Verify; tokenization pages under Tokenization group; unified use-cases under Unified Pay-In.
5. Do NOT create country-top-level sections (Bangladesh, Nepal, etc.) — content is API-first.
6. Do NOT add redirects from old URLs unless explicitly asked.
7. Preserve all <figure><img src="/files/..."> blocks exactly.
8. Preserve all {% tabs %}, {% hint %}, and mermaid blocks.
9. After all pages: verify Platform Reference → Authentication has 3 pages, Status Codes has 5 pages.
10. Publish the space when complete.

GROUP ORDER:
Getting Started → Platform Reference → Pay-In APIs (Unified + Pakistan with 5 sub-groups) → Pay-Out APIs → Remittance APIs

CHECKLIST:
[ ] 4 getting-started pages
[ ] 13 platform-reference pages (3 auth + 5 status + 5 other)
[ ] 8 unified pay-in pages
[ ] 1 pakistan overview page
[ ] 35 pakistan wallet pages (including tokenization + use cases)
[ ] 3 ibft + 2 e-billing + 3 hosted + 8 cards = 16
[ ] 16 pay-out pages
[ ] 13 remittance pages
[ ] Total = 98

If using GitBook UI automation is not available, output a CSV: group, page_title, source_file_path, parent_page_title for manual upload.
```

---

## Post-publish checklist

- [ ] Homepage / Getting Started → Overview is the landing page
- [ ] Mermaid diagram renders on Unified Pay-In overview
- [ ] At least one wallet diagram renders (e.g. Easypaisa journey `/files/5LKxs85WguuQyHhG1rTZ`)
- [ ] Tab blocks render on Initiate/Inquire samples
- [ ] Pay-Out and Remittance PK/BD tabs render
- [ ] No empty pages
- [ ] Search works for key terms: `initiate`, `disbursement`, `remittance`, `bKash`
- [ ] Old space archived or replaced when satisfied

---

## What NOT to do

- Do **not** rebuild the old hierarchy (Country → Pay-Ins → OTP Flow).
- Do **not** split BD/NP/EG/IQ into separate top-level country sections.
- Do **not** strip curl samples or status code tables.
- Do **not** replace `/files/` image paths with external URLs unless assets are missing.

---

## Quick reference — API endpoints by section

| Section | Key endpoints |
|---------|----------------|
| Unified Pay-In | `POST /payins/payments/initiate`, `POST /payins/payments/inquire` |
| PK Wallets | `POST /v2/wallets/transaction/initiate`, `verify`, `finalize`, `direct-payment`, `delink` |
| PK Wallets Refund | `POST /v3/transaction/refund` |
| PK IBFT | `POST /ibft/transaction/initiate`, `verify` |
| PK Cards | `POST /cards/payment`, `capture`, `inquiry`, `finalize` |
| Pay-Out | `POST /merchants/{id}/disbursements/*` |
| Remittance | `POST /remittance/{id}/remit-initiate`, `GET .../banks/listByAccountType` |

---

## Support files in this package

| File | When to use |
|------|-------------|
| `NEW_HIERARCHY.md` | Architecture rationale |
| `PAGE_MIGRATION_MAP.csv` | Old URL → new path (reference only; no redirects required) |
| `IMAGE_CATALOG.md` | Image ID → new page mapping |
