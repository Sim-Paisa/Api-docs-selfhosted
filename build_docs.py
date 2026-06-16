#!/usr/bin/env python3
"""Generate complete GitBook doc package from source exports."""
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC1 = Path(r"c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-full.txt")
SRC2 = Path(r"c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-full-page2.txt")


def load(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def split_h1_list(text: str) -> list[tuple[str, str]]:
    """Return ordered list of (title, body) for each h1 section."""
    sections: list[tuple[str, str]] = []
    current_title = None
    buf: list[str] = []
    for line in text.splitlines(keepends=True):
        if re.match(r"^# [^#]", line):
            if current_title is not None:
                sections.append((current_title, "".join(buf)))
            current_title = line[2:].strip()
            current_title = current_title.replace("&#x20;", "").strip()
            buf = [line]
        elif current_title is not None:
            buf.append(line)
    if current_title is not None:
        sections.append((current_title, "".join(buf)))
    return sections


def sections_dict_ordered(sections: list[tuple[str, str]]) -> dict[str, str]:
    """Last occurrence wins (for unique lookup)."""
    d = {}
    for t, b in sections:
        d[t] = b
    return d


def find_section(sections: list[tuple[str, str]], *titles: str) -> str:
    for t in titles:
        for title, body in sections:
            if title.strip() == t.strip() or t in title:
                return body
    return ""


def find_all_sections(sections: list[tuple[str, str]], substr: str) -> list[str]:
    return [b for t, b in sections if substr in t]


def write(rel: str, body: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    body = body.replace("&#x20;", " ").replace("&#x65;", "e")
    if not body.strip():
        body = f"# {path.stem.replace('-', ' ').title()}\n\n_Content sourced from Simpaisa API documentation._\n"
    path.write_text(body.strip() + "\n", encoding="utf-8")


def combine(*chunks: str, title: str | None = None) -> str:
    parts = []
    if title:
        parts.append(f"# {title}\n")
    for c in chunks:
        c = (c or "").strip()
        if not c:
            continue
        if c.startswith("# "):
            c = "\n".join(c.splitlines()[1:]).strip()
        parts.append(c)
    return "\n\n".join(parts).strip() + "\n"


def main():
    s1_list = split_h1_list(load(SRC1))
    s2_list = split_h1_list(load(SRC2))
    s1 = sections_dict_ordered(s1_list)
    s2 = sections_dict_ordered(s2_list)
    created: list[str] = []

    def w(rel, body):
        write(rel, body)
        created.append(rel)

    # Getting Started
    w("getting-started/overview.md", find_section(s1_list, "Simpaisa API Hub"))
    w("getting-started/environments.md", """# Environments & Base URLs

## Pakistan Pay-In

| Payment Method | Sandbox | Production |
| --- | --- | --- |
| Wallet | sandbox.simpaisa.com | wallets.simpaisa.com |
| Card (local) | sandbox.simpaisa.com | payment.simpaisa.com |
| IBFT | sandbox.simpaisa.com | ibft.simpaisa.com |
| Hosted Page | stg-widgetapi.simpaisa.com | widgetapi.simpaisa.com |
| Refund | sandbox.simpaisa.com | refund.simpaisa.com |

## Unified Pay-In (BD · NP · EG · IQ)

| Environment | Base URL |
| --- | --- |
| Sandbox | https://sandbox.simpaisa.com |
| Production | https://payin.simpaisa.com |

## Pakistan Pay-Out

| Environment | Base URL |
| --- | --- |
| Sandbox / Staging | https://sandbox.simpaisa.com |
| Production / Live | https://disb.simpaisa.com |

## Bangladesh Pay-Out

| Environment | Base URL |
| --- | --- |
| Sandbox | http://sandbox.simpaisa.com/ |
| Production | https://payout.simpaisa.com/ |

## Remittance (PK & BD)

| Environment | Base URL |
| --- | --- |
| Sandbox | https://sandbox.simpaisa.com |
""")
    w("getting-started/regional-coverage.md", """# Regional Coverage

| Country | Pay-Ins | Pay-Outs | Remittances |
| --- | --- | --- | --- |
| Pakistan | Wallets, Cards, IBFT, E-Billing, Hosted Page | Full disbursement | Full remittance |
| Bangladesh | bKash, Nagad (unified API) | Direct disbursement | Remittance APIs |
| Nepal | Khalti (unified API) | — | — |
| Egypt | Paymob (unified API) | — | — |
| Iraq | Wayl (unified API) | — | — |

## Operator codes

| Region | Operator | Code |
| --- | --- | --- |
| PK | Easypaisa | 100007 |
| PK | Jazzcash | 100008 |
| PK | HBL Konnect | 100014 |
| PK | Alfa | 100012 |
| PK | E-Billing | 100011 |
| BD | bKash | 10001 |
| BD | Nagad | 10002 |
| NP | Khalti | 100025 |
| EG | Paymob | 100026 |
| IQ | Wayl | 100027 |
""")
    w("getting-started/integration-checklist.md", """# Integration Checklist

## All integrations

1. Obtain sandbox credentials and merchant ID from Simpaisa.
2. Configure postback / webhook URL.
3. Implement product flow (Initiate → Verify/Inquire as applicable).
4. Handle postbacks; reconcile with inquiry APIs.
5. Review status codes for your product.
6. Complete sandbox UAT before production.

## Unified Pay-In (BD · NP · EG · IQ)

- [ ] `api-token` header configured
- [ ] Initiate + redirect to `payment_url`
- [ ] Inquire on success/failure landing pages
- [ ] Postback returns `{"status":"success"}`

## Pakistan Wallets

- [ ] Headers: mode payin, region PK, operatorId, version 3.0
- [ ] Initiate + Verify (OTP/async) or Non-OTP
- [ ] Tokenization + Direct Charge if recurring

## Cards

- [ ] RSA 2048 + mutual SSL + AES card encryption
- [ ] PCI DSS certificate shared with InfoSec
""")

    # Platform reference
    w("platform-reference/authentication/api-token.md", """# API Token Authentication

Used for unified pay-in: Bangladesh, Nepal, Egypt, Iraq.

| Header | Description |
| --- | --- |
| api-token | Token issued by Simpaisa |

Required on `POST /payins/payments/initiate` and `POST /payins/payments/inquire`.
""")
    cards_body = find_section(s1_list, "Cards")
    enc_start = cards_body.find("### Encryption and Authentication")
    enc_end = cards_body.find("### APIs", enc_start)
    card_enc = cards_body[enc_start:enc_end] if enc_start >= 0 else cards_body[:4000]
    w("platform-reference/authentication/card-encryption.md", "# Card Encryption (AES + RSA)\n\n" + card_enc)

    w("platform-reference/authentication/rsa-mutual-ssl.md", combine(
        find_section(s1_list, "Encryption and Authentication "),
        find_section(s1_list, "Encryption and Authentication"),
        find_section(s2_list, "Encryption and Authentication"),
        title="RSA Signatures & Mutual SSL",
    ))
    w("platform-reference/webhooks.md", combine(
        find_section(s1_list, "Webhooks"),
        find_section(s1_list, "Creating Webhook(s)"),
        find_section(s1_list, "Postbacks"),
        find_section(s2_list, "Creating webhook(s)"),
        find_section(s2_list, " Creating webhook(s)"),
        title="Webhooks & Postbacks",
    ))
    w("platform-reference/idempotency.md", find_section(s1_list, "Idempotency"))
    w("platform-reference/error-handling.md", find_section(s1_list, "Error handling"))
    w("platform-reference/signature-samples.md", combine(
        find_section(s1_list, "Sample Code(s) for Generating a Signature"),
        find_section(s2_list, "Sample Code(s) for Generating a Signature"),
        title="Sample Code — Signature Generation",
    ))

    # Status codes - pick by position in s1_list
    status_sections = [(t, b) for t, b in s1_list if "Status Codes" in t]
    if len(status_sections) >= 1:
        w("platform-reference/status-codes/pay-in-pk-wallet.md", status_sections[0][1])
    w("platform-reference/status-codes/cards.md", find_section(s1_list, "Response codes"))
    if len(status_sections) >= 2:
        w("platform-reference/status-codes/pay-out.md", "# Pay-Out Status Codes\n\n" + "\n".join(status_sections[1][1].splitlines()[1:]))
    if len(status_sections) >= 3:
        w("platform-reference/status-codes/remittance.md", "# Remittance Status Codes\n\n" + "\n".join(status_sections[2][1].splitlines()[1:]))
    bd_status = find_section(s2_list, "Status Codes Mapping")
    if bd_status and "pay-in-unified" not in bd_status:
        pass  # unified already exists

    # Pakistan wallets
    w("pay-in-apis/pakistan/wallets/overview.md", combine(
        find_section(s1_list, "Pay-Ins"),
        find_section(s1_list, "Mobile Wallets"),
        title="Pakistan — Wallet APIs",
    ))
    w("pay-in-apis/pakistan/wallets/initiate.md", combine(
        "# Initiate Payment\n\n`POST /v2/wallets/transaction/initiate`\n\n",
        find_section(s1_list, "Wallet APIs(One Time Payment)"),
        find_section(s1_list, "Async Flow"),
    ))
    use_initiate = [
        ("use-case-easypaisa-jazzcash-otp.md", "Initiating a Payment on EasyPaisa and Jazzcash"),
        ("use-case-hbl-konnect-otp.md", "Initiating a Payment on HBL Konnect"),
        ("use-case-alfa-otp.md", "Initiating Payment on Alfa"),
        ("use-case-easypaisa-jazzcash-async.md", "EasyPaisa and Jazzcash Initiate"),
        ("use-case-alfa-async.md", "Alfa Initiate"),
        ("use-case-hbl-konnect-async.md", "HBL Konnect Initiate"),
    ]
    for fname, key in use_initiate:
        w(f"pay-in-apis/pakistan/wallets/initiate/{fname}", find_section(s1_list, key))

    w("pay-in-apis/pakistan/wallets/verify.md", combine(
        "# Verify Payment\n\n`POST /v2/wallets/transaction/verify`\n\n",
        find_section(s1_list, "Verify API"),
    ))
    use_verify = [
        ("use-case-easypaisa-jazzcash-otp.md", "Verifying Payment on Easypaisa and Jazzcash "),
        ("use-case-hbl-konnect-otp.md", "Verifying Payment on HBL Konnect"),
        ("use-case-alfa-otp.md", "Verifying Payment on Alfa"),
        ("use-case-easypaisa-jazzcash-async.md", "EasyPaisa JazzCash Veirfy"),
        ("use-case-alfa-async.md", "Alfa Verify"),
        ("use-case-hbl-konnect-async.md", "HBL Konnect Verify"),
        ("use-case-non-otp.md", "Non OTP Flow"),
    ]
    for fname, key in use_verify:
        body = find_section(s1_list, key)
        if fname == "use-case-non-otp.md":
            body = combine(body, find_section(s1_list, "Verify API"))
        w(f"pay-in-apis/pakistan/wallets/verify/{fname}", body)

    w("pay-in-apis/pakistan/wallets/inquire.md", combine(
        find_section(s1_list, "Inquiry API"),
        find_section(s1_list, "Payment Status Inquiry"),
        find_section(s1_list, "Simpaisa Payment Status Inquiry"),
        title="Inquire",
    ))
    w("pay-in-apis/pakistan/wallets/tokenization/overview.md", combine(
        find_section(s1_list, "OTP Flow"),
        find_section(s1_list, "Wallet APIs(Tokenisation)"),
        title="Tokenization",
    ))
    w("pay-in-apis/pakistan/wallets/tokenization/initiate/use-case-easypaisa.md",
      find_section(s1_list, "Initiating Tokenization Payment on Easypaisa"))
    w("pay-in-apis/pakistan/wallets/tokenization/initiate/use-case-jazzcash.md",
      find_section(s1_list, "Initiating Tokenisation Payment on Jazzcash"))
    w("pay-in-apis/pakistan/wallets/tokenization/verify/use-case-easypaisa.md",
      find_section(s1_list, "Verifying Tokenization Payment on Easypaisa"))
    w("pay-in-apis/pakistan/wallets/tokenization/finalize/use-case-jazzcash.md",
      find_section(s1_list, "Finalizing or Verifying Tokenization Payment on Jazzcash"))
    w("pay-in-apis/pakistan/wallets/tokenization/direct-charge.md",
      find_section(s1_list, "Direct Charge API for Easypaisa & Jazzcash"))
    w("pay-in-apis/pakistan/wallets/tokenization/delink.md",
      find_section(s1_list, "Delink Account API for Easypaisa & Jazzcash "))
    w("pay-in-apis/pakistan/wallets/refund.md", combine(
        find_section(s1_list, "Refund"),
        find_section(s1_list, "Simpaisa Refund API for Wallets"),
        title="Refund",
    ))
    w("pay-in-apis/pakistan/wallets/refund/use-case-partial.md", find_section(s1_list, "Partial Refund"))

    # IBFT, E-Billing, Hosted, Cards
    w("pay-in-apis/pakistan/ibft/overview.md", find_section(s1_list, "1 Bill Service"))
    w("pay-in-apis/pakistan/ibft/initiate.md", find_section(s1_list, "Initiating Pull Request on Bank Account"))
    w("pay-in-apis/pakistan/ibft/verify.md", find_section(s1_list, "Verifying Pull Request on Bank Account"))
    w("pay-in-apis/pakistan/e-billing/initiate.md", find_section(s1_list, "E-Billing or Payment via Voucher"))
    w("pay-in-apis/pakistan/e-billing/inquire.md", find_section(s1_list, "Inquire the E-Bill Payment "))
    w("pay-in-apis/pakistan/hosted-page/overview.md", find_section(s1_list, "Hosted Page"))
    w("pay-in-apis/pakistan/hosted-page/inquire.md", find_section(s1_list, "Inquiring the Payment Status"))
    w("pay-in-apis/pakistan/hosted-page/e-invoice.md", find_section(s1_list, "E Invoice or Link to Pay"))

    # Cards - inquiry is second "Inquiry API" in file
    inquiry_cards = ""
    for t, b in s1_list:
        if t.strip() == "Inquiry API" and "/cards/inquiry" in b:
            inquiry_cards = b
    if not inquiry_cards:
        inquiry_cards = [b for t, b in s1_list if t.strip() == "Inquiry API"][-1]

    w("pay-in-apis/pakistan/cards/overview.md", find_section(s1_list, "Cards"))
    w("pay-in-apis/pakistan/cards/payment.md", find_section(s1_list, "Payments"))
    w("pay-in-apis/pakistan/cards/capture.md", find_section(s1_list, "Capture API"))
    w("pay-in-apis/pakistan/cards/void.md", find_section(s1_list, "Void API"))
    w("pay-in-apis/pakistan/cards/inquiry.md", inquiry_cards)
    w("pay-in-apis/pakistan/cards/finalize.md", find_section(s1_list, "Finalize API"))
    w("pay-in-apis/pakistan/cards/refunds.md", find_section(s1_list, "Refunds"))
    w("pay-in-apis/pakistan/cards/postbacks.md", find_section(s1_list, "Postbacks"))

    # Pay-out
    w("pay-out-apis/overview.md", combine(find_section(s1_list, "Pay-Outs"), find_section(s2_list, "Pay-Outs"), title="Pay-Out APIs"))
    w("pay-out-apis/disbursement-states.md", combine(
        find_section(s1_list, "States of Disbursment"),
        find_section(s2_list, "Disbursement States"),
        title="Disbursement States",
    ))
    w("pay-out-apis/register-customer.md", find_section(s1_list, "Registering the beneficiary or customer"))
    w("pay-out-apis/update-customer.md", find_section(s1_list, "Updating the customer details"))
    w("pay-out-apis/get-customer.md", find_section(s1_list, "Fetching the customer details"))
    w("pay-out-apis/list-banks.md", combine(
        find_section(s1_list, "Fetching Bank List"),
        title="List Banks",
    ))
    w("pay-out-apis/initiate-disbursement.md", combine(
        find_section(s1_list, "Initiating the disbursement request"),
        find_section(s2_list, "Initiate Disbursement"),
        title="Initiate Disbursement",
    ))
    w("pay-out-apis/re-initiate-disbursement.md", find_section(s1_list, "Re-initiating the disbursement request"))
    w("pay-out-apis/update-disbursement.md", find_section(s1_list, "Updating the disbursement request"))
    w("pay-out-apis/balance-inquiry.md", find_section(s1_list, "Fetching the balance data"))
    w("pay-out-apis/fetch-account-title.md", find_section(s1_list, "Fetching the customer account title"))
    w("pay-out-apis/list-transfer-reasons.md", find_section(s1_list, "Fetching payment or transfer reasons code"))
    w("pay-out-apis/list-disbursements.md", find_section(s1_list, "Getting the list of available disbursements"))
    w("pay-out-apis/get-disbursement.md", combine(
        find_section(s1_list, "Getting the disbursement details through reference"),
        find_section(s1_list, "Getting disbursement details via UUID"),
        title="Get Disbursement",
    ))
    w("pay-out-apis/inquire-disbursement.md", combine(
        find_section(s2_list, "Transaction Inquiry API"),
        title="Inquire Disbursement",
    ))
    w("pay-out-apis/banks-reference-pk.md", find_section(s1_list, "List of Banks and Mobile Wallets"))
    bd_payout_status = find_all_sections(s2_list, "Status Codes Mapping")
    if bd_payout_status:
        w("pay-out-apis/status-codes-bd.md", bd_payout_status[0])

    # Remittance
    w("remittance-apis/overview.md", combine(
        find_section(s1_list, "Remittances"),
        find_section(s1_list, "Remittance Steps or Flow"),
        find_section(s2_list, "Remittance Steps or Flow"),
        title="Remittances",
    ))
    w("remittance-apis/remittance-states.md", combine(
        find_section(s1_list, "Remittance States"),
        find_section(s2_list, "Remittance States"),
        title="Remittance States",
    ))
    w("remittance-apis/payment-reasons-reference.md", combine(
        find_section(s1_list, "List of Payment Reasons"),
        find_section(s2_list, "List of Payment Reasons"),
        title="Payment Reasons Reference",
    ))
    w("remittance-apis/list-banks.md", combine(
        find_section(s1_list, "Fetching the Banks List (Pakistan):"),
        find_section(s2_list, "Fetching the Banks List (Bangladesh)"),
        title="List Banks",
    ))
    w("remittance-apis/list-banks-by-code.md", combine(
        find_section(s1_list, "Fetching the Bank List by Code"),
        find_section(s2_list, "Fetching the Bank List by Code"),
        title="List Banks by Code",
    ))
    w("remittance-apis/get-fx-rate.md", combine(
        find_section(s1_list, "FX Rate API"),
        find_section(s2_list, "FX Rate API"),
        title="Get FX Rate",
    ))
    w("remittance-apis/list-payment-purposes.md", combine(
        find_section(s1_list, "Fetching The List of Payment Purposes or Reasons"),
        find_section(s2_list, "Fetching The List of Payment Purposes or Reasons"),
        title="List Payment Purposes",
    ))
    w("remittance-apis/verify-account-title.md",
      find_section(s1_list, "Beneficiary’s Account Title Verification API (Pakistan)"))
    w("remittance-apis/remit-initiate-single.md", combine(
        find_section(s1_list, "Direct Remit Call (Single API Flow)"),
        find_section(s2_list, "Direct Remit Call(Single API Flow)"),
        title="Remit Initiate — Single API Flow",
    ))
    w("remittance-apis/register-remit.md", combine(
        find_section(s1_list, "Register Remit (Double API Flow)"),
        find_section(s2_list, "Register Remit(Double API Flow)"),
        title="Register Remit",
    ))
    w("remittance-apis/remit-initiate-double.md", combine(
        find_section(s1_list, "Remit Initiate (Double API Flow)"),
        find_section(s2_list, "Remit Initiate(Double API Flow)"),
        title="Remit Initiate — Double API Flow",
    ))
    # Transaction inquiry - first in remittance context from s1 (after remittances section)
    remit_inquiry_s1 = ""
    remit_inquiry_s2 = ""
    seen_remit = False
    for t, b in s1_list:
        if "Remittances" in t:
            seen_remit = True
        if seen_remit and t.strip() == "Transaction Inquiry API":
            remit_inquiry_s1 = b
            break
    seen_remit = False
    for t, b in s2_list:
        if "Remittances" in t:
            seen_remit = True
        if seen_remit and "Transaction Inquiry" in t:
            remit_inquiry_s2 = b
            break
    w("remittance-apis/transaction-inquiry.md", combine(remit_inquiry_s1, remit_inquiry_s2, title="Transaction Inquiry"))
    w("remittance-apis/merchant-balance-inquiry.md", combine(
        find_section(s1_list, "Merchant Balance Inquiry API"),
        find_section(s2_list, "Merchant Balance Inquiry API"),
        title="Merchant Balance Inquiry",
    ))
    remit_status_s2 = find_all_sections(s2_list, "Status Codes Mapping")
    if len(remit_status_s2) >= 2:
        w("remittance-apis/status-codes-bd.md", remit_status_s2[-1])

    generate_summary()
    generate_readme(len(created))
    print(f"Generated {len(created)} files")


def generate_summary():
    skip = {"NEW_HIERARCHY.md", "IMAGE_CATALOG.md", "PAGE_MIGRATION_MAP.csv", "build_docs.py"}
    order = [
        "getting-started/overview.md",
        "getting-started/environments.md",
        "getting-started/regional-coverage.md",
        "getting-started/integration-checklist.md",
    ]
    lines = ["# Table of contents\n\n"]
    for rel in order:
        if (ROOT / rel).exists():
            lines.append(f"* [{Path(rel).stem}]({rel})\n")
    lines.append("\n## Platform Reference\n\n")
    for p in sorted((ROOT / "platform-reference").rglob("*.md")):
        rel = p.relative_to(ROOT).as_posix()
        lines.append(f"* [{p.stem}]({rel})\n")
    for section in ["pay-in-apis/unified-pay-in", "pay-in-apis/pakistan/wallets", "pay-in-apis/pakistan/ibft",
                    "pay-in-apis/pakistan/e-billing", "pay-in-apis/pakistan/hosted-page", "pay-in-apis/pakistan/cards",
                    "pay-out-apis", "remittance-apis"]:
        d = ROOT / section
        if not d.exists():
            continue
        lines.append(f"\n## {section.split('/')[-1].replace('-', ' ').title()}\n\n")
        for p in sorted(d.rglob("*.md")):
            if p.name == "README.md":
                continue
            rel = p.relative_to(ROOT).as_posix()
            lines.append(f"* [{p.stem}]({rel})\n")
    (ROOT / "SUMMARY.md").write_text("".join(lines), encoding="utf-8")


def generate_readme(n_files: int):
    readme = f"""# Simpaisa API Documentation (GitBook Package)

Complete API-first documentation rebuild. **{n_files}+ pages**, fully populated from official GitBook export.

## Publish from scratch (no redirects)

1. Log in to [GitBook](https://app.gitbook.com) → your **simpaisa-docs** space.
2. Create a **new space** or clear the existing sidebar (your choice — fresh start).
3. For each folder below, create a **page group** and **import** or paste markdown files.

### Import options

**Option A — Paste (simplest)**  
Open each `.md` file → copy all → paste into GitBook page (Markdown mode).

**Option B — Git Sync**  
Push this folder to a GitHub repo → connect GitBook Git Sync → map `SUMMARY.md` as navigation.

## Folder structure

```
getting-started/          Overview, environments, checklist
platform-reference/       Auth, webhooks, status codes, signatures
pay-in-apis/
  unified-pay-in/         BD, NP, EG, IQ
  pakistan/
    wallets/              Initiate, Verify, Inquire, Tokenization, Refund
    ibft/                 IBFT pull
    e-billing/            Voucher billing
    hosted-page/          Widget + E-Invoice
    cards/                Card payments
pay-out-apis/             Disbursements PK + BD
remittance-apis/          Remittances PK + BD
```

## Images

All `<figure><img src="/files/...">` blocks are preserved. GitBook resolves `/files/` IDs in the **same space** — images appear automatically when pasted into your existing space.

See `IMAGE_CATALOG.md` for the full asset index.

## Regenerate

```bash
python build_docs.py
```

## Navigation

Use `SUMMARY.md` as the GitBook table of contents / sidebar order.
"""
    (ROOT / "README.md").write_text(readme, encoding="utf-8")


if __name__ == "__main__":
    main()
