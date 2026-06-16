$root = "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-restructure"
$l1 = Get-Content "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-full.txt" -Encoding UTF8
$l2 = Get-Content "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-full-page2.txt" -Encoding UTF8
function Get-Sec($lines, $a, $b) { ($lines[($a-1)..($b-2)] -join "`n") }

$pk = Get-Sec $l1 5960 6039
$bd = Get-Sec $l2 951 1034
@"
# Remit Initiate - Single API Flow

## Pakistan

$pk

---

## Bangladesh

$bd
"@ | Set-Content "$root\remittance-apis\remit-initiate-single.md" -Encoding UTF8

Set-Content "$root\pay-out-apis\banks-reference-pk.md" (Get-Sec $l1 5281 5370) -Encoding UTF8

# BD pay-out status codes
$bdPayoutSc = Get-Sec $l2 380 446
Add-Content "$root\platform-reference\status-codes\pay-out.md" "`n---`n`n## Bangladesh`n`n$bdPayoutSc" -Encoding UTF8

$bdRemitSc = Get-Sec $l2 1320 1386
Add-Content "$root\platform-reference\status-codes\remittance.md" "`n---`n`n## Bangladesh`n`n$bdRemitSc" -Encoding UTF8

Write-Output "Fixed remit-initiate-single and banks-reference-pk"
