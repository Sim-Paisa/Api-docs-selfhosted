$root = "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-restructure"

function Merge-Pages {
    param($out, $title, $paths)
    $parts = @("# $title`n")
    foreach ($p in $paths) {
        $full = Join-Path $root $p
        if (Test-Path $full) {
            $c = Get-Content $full -Raw -Encoding UTF8
            $parts += "---`n`n$c"
        }
    }
    $dest = Join-Path $root $out
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    Set-Content $dest ($parts -join "`n") -Encoding UTF8
}

Merge-Pages "remittance-apis/list-banks.md" "List Banks" @("remittance-apis/list-banks-pk.md", "remittance-apis/list-banks-bd.md")
Merge-Pages "remittance-apis/list-banks-by-code.md" "List Banks by Code" @("remittance-apis/list-banks-by-code-pk.md", "remittance-apis/list-banks-by-code-bd.md")
Merge-Pages "remittance-apis/get-fx-rate.md" "Get FX Rate" @("remittance-apis/get-fx-rate-pk.md", "remittance-apis/get-fx-rate-bd.md")
Merge-Pages "remittance-apis/list-payment-purposes.md" "List Payment Purposes" @("remittance-apis/list-payment-purposes-pk.md", "remittance-apis/list-payment-purposes-bd.md")
Merge-Pages "remittance-apis/remit-initiate-single.md" "Remit Initiate — Single API Flow" @("remittance-apis/remit-initiate-single-pk.md", "remittance-apis/remit-initiate-single-bd.md")
Merge-Pages "remittance-apis/register-remit.md" "Register Remit" @("remittance-apis/register-remit-pk.md", "remittance-apis/register-remit-bd.md")
Merge-Pages "remittance-apis/remit-initiate-double.md" "Remit Initiate — Double API Flow" @("remittance-apis/remit-initiate-double-pk.md", "remittance-apis/remit-initiate-double-bd.md")
Merge-Pages "remittance-apis/transaction-inquiry.md" "Transaction Inquiry" @("remittance-apis/transaction-inquiry-pk.md", "remittance-apis/transaction-inquiry-bd.md")
Merge-Pages "remittance-apis/merchant-balance-inquiry.md" "Merchant Balance Inquiry" @("remittance-apis/merchant-balance-inquiry-pk.md", "remittance-apis/merchant-balance-inquiry-bd.md")
Merge-Pages "remittance-apis/overview.md" "Remittances" @("remittance-apis/overview.md", "remittance-apis/overview-bd.md")
Merge-Pages "remittance-apis/payment-reasons-reference.md" "Payment Reasons Reference" @("remittance-apis/payment-reasons-reference.md", "remittance-apis/payment-reasons-bd.md")
Merge-Pages "remittance-apis/remittance-states.md" "Remittance States" @("remittance-apis/remittance-states.md", "remittance-apis/remittance-states-bd.md")
Merge-Pages "pay-out-apis/disbursement-states.md" "Disbursement States" @("pay-out-apis/disbursement-states.md", "pay-out-apis/disbursement-states-bd.md")
Merge-Pages "pay-out-apis/inquire-disbursement.md" "Inquire Disbursement" @("pay-out-apis/inquire-disbursement-bd.md")

# Platform auth from source
$src1 = Get-Content "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-full.txt" -Encoding UTF8
$rsa = $src1[4183..4301] -join "`n"
New-Item -Force -ItemType Directory -Path "$root\platform-reference\authentication" | Out-Null
Set-Content "$root\platform-reference\authentication\rsa-mutual-ssl.md" $rsa -Encoding UTF8
Set-Content "$root\platform-reference\authentication\api-token.md" @"
# API Token Authentication

Used for unified pay-in regions: Bangladesh, Nepal, Egypt, Iraq.

| Header | Description |
| --- | --- |
| api-token | Token issued by Simpaisa during onboarding |

Required on every ``POST /payins/payments/initiate`` and ``POST /payins/payments/inquire`` request.
"@ -Encoding UTF8

$cards = $src1[2494..2704] -join "`n"
$encStart = $cards.IndexOf("### Encryption and Authentication")
$encEnd = $cards.IndexOf("### APIs", $encStart)
if ($encStart -ge 0) {
  Set-Content "$root\platform-reference\authentication\card-encryption.md" ("# Card Encryption (AES + RSA)`n`n" + $cards.Substring($encStart, $encEnd - $encStart)) -Encoding UTF8
}

# Regional coverage
Set-Content "$root\getting-started\regional-coverage.md" @"
# Regional Coverage

| Country | Pay-Ins | Pay-Outs | Remittances |
| --- | --- | --- | --- |
| Pakistan | Wallets, Cards, IBFT, E-Billing, Hosted Page | Full disbursement | Full remittance |
| Bangladesh | bKash, Nagad | Direct disbursement | Remittance APIs |
| Nepal | Khalti | — | — |
| Egypt | Paymob | — | — |
| Iraq | Wayl | — | — |

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
"@ -Encoding UTF8

# Expand webhooks from source
$wh = ($src1[1925..1970] -join "`n") + "`n`n" + ($src1[2443..2452] -join "`n") + "`n`n" + ($src1[3892..4044] -join "`n")
Set-Content "$root\platform-reference\webhooks.md" ("# Webhooks & Postbacks`n`n" + ($wh -replace '^# .*','')) -Encoding UTF8

# SUMMARY
$skip = @('README.md','NEW_HIERARCHY.md','IMAGE_CATALOG.md','PAGE_MIGRATION_MAP.csv','build_docs.py','extract.ps1','merge.ps1')
$files = Get-ChildItem $root -Recurse -Filter *.md | Where-Object {
  ($_.Name -notin $skip) -and ($_.FullName -notmatch '\\_(gen|generate)') -and ($_.Name -notmatch '^-')
  -and ($_.Name -notmatch '-pk\.md$') -and ($_.Name -notmatch '-bd\.md$') -and ($_.Name -notmatch 'overview-bd')
  -and ($_.FullName -notmatch 'unified-pay-in\\README')
}

$summary = "# Table of contents`n`n"
foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length + 1).Replace('\','/')
  $summary += "* [$($f.BaseName)]($rel)`n"
}
Set-Content "$root\SUMMARY.md" $summary -Encoding UTF8

$readme = @"
# Simpaisa API Documentation — Complete GitBook Package

$n pages — API-first structure, fully populated from official docs. Paste into GitBook from scratch (no redirects).

## Quick publish

1. Open GitBook, your space, create new page groups matching folders below.
2. For each .md file: create page, switch to Markdown, paste entire file, save.
3. Use SUMMARY.md for sidebar order.
4. Images using /files/... resolve automatically in the same GitBook space.

## Structure

- getting-started/ — Overview, environments, regional coverage, checklist
- platform-reference/ — Auth, webhooks, idempotency, errors, status codes, signatures
- pay-in-apis/unified-pay-in/ — BD, NP, EG, IQ
- pay-in-apis/pakistan/wallets/ — Initiate, Verify, Inquire, Tokenization, Refund
- pay-in-apis/pakistan/ibft, e-billing, hosted-page, cards/
- pay-out-apis/ — Disbursements PK + BD
- remittance-apis/ — Remittances PK + BD

## Images

See IMAGE_CATALOG.md for all preserved /files diagram references.

## Regenerate

Run extract.ps1 then merge.ps1 in PowerShell.
"@
Set-Content "$root\README.md" $readme -Encoding UTF8

Write-Output "Done. Total pages: $n"
