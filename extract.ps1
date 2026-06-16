# Extract sections from source exports into restructure folder
$root = "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-restructure"
$src1 = "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-full.txt"
$src2 = "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-full-page2.txt"

function Get-Lines { param($path) Get-Content $path -Encoding UTF8 }
function Get-Section {
    param([string[]]$lines, [int]$start, [int]$end)
    if ($end -le 0) { $end = $lines.Count }
  $lines[($start-1)..($end-2)] -join "`n"
}

$l1 = Get-Lines $src1
$l2 = Get-Lines $src2

# Line numbers from grep (1-based start, exclusive end = next section start)
$map1 = @{
  "pay-in-apis/pakistan/wallets/initiate/use-case-easypaisa-jazzcash-otp.md" = @(241, 301)
  "pay-in-apis/pakistan/wallets/initiate/use-case-hbl-konnect-otp.md" = @(359, 422)
  "pay-in-apis/pakistan/wallets/initiate/use-case-alfa-otp.md" = @(489, 552)
  "pay-in-apis/pakistan/wallets/initiate/use-case-easypaisa-jazzcash-async.md" = @(635, 695)
  "pay-in-apis/pakistan/wallets/initiate/use-case-alfa-async.md" = @(833, 892)
  "pay-in-apis/pakistan/wallets/initiate/use-case-hbl-konnect-async.md" = @(954, 1013)
  "pay-in-apis/pakistan/wallets/verify/use-case-easypaisa-jazzcash-otp.md" = @(301, 359)
  "pay-in-apis/pakistan/wallets/verify/use-case-hbl-konnect-otp.md" = @(422, 489)
  "pay-in-apis/pakistan/wallets/verify/use-case-alfa-otp.md" = @(552, 614)
  "pay-in-apis/pakistan/wallets/verify/use-case-easypaisa-jazzcash-async.md" = @(695, 755)
  "pay-in-apis/pakistan/wallets/verify/use-case-alfa-async.md" = @(892, 954)
  "pay-in-apis/pakistan/wallets/verify/use-case-hbl-konnect-async.md" = @(1013, 1078)
  "pay-in-apis/pakistan/wallets/verify/use-case-non-otp.md" = @(1653, 1707)
  "pay-in-apis/pakistan/wallets/tokenization/initiate/use-case-easypaisa.md" = @(1162, 1221)
  "pay-in-apis/pakistan/wallets/tokenization/verify/use-case-easypaisa.md" = @(1221, 1281)
  "pay-in-apis/pakistan/wallets/tokenization/initiate/use-case-jazzcash.md" = @(1281, 1326)
  "pay-in-apis/pakistan/wallets/tokenization/finalize/use-case-jazzcash.md" = @(1326, 1384)
  "pay-in-apis/pakistan/wallets/refund/use-case-partial.md" = @(1594, 1653)
  "pay-out-apis/overview.md" = @(4096, 4184)
  "pay-out-apis/disbursement-states.md" = @(4303, 4314)
  "pay-out-apis/register-customer.md" = @(4314, 4395)
  "pay-out-apis/update-customer.md" = @(4395, 4474)
  "pay-out-apis/get-customer.md" = @(4474, 4536)
  "pay-out-apis/list-banks.md" = @(4536, 4607)
  "pay-out-apis/initiate-disbursement-pk.md" = @(4607, 4680)
  "pay-out-apis/re-initiate-disbursement.md" = @(4680, 4741)
  "pay-out-apis/update-disbursement.md" = @(4741, 4805)
  "pay-out-apis/balance-inquiry.md" = @(4805, 4855)
  "pay-out-apis/fetch-account-title.md" = @(4855, 4925)
  "pay-out-apis/list-transfer-reasons.md" = @(4925, 4981)
  "pay-out-apis/list-disbursements.md" = @(4981, 5064)
  "pay-out-apis/get-disbursement.md" = @(5064, 5201)
  "pay-out-apis/banks-reference-pk.md" = @(5281, 5370)
  "remittance-apis/overview.md" = @(5370, 5414)
  "remittance-apis/payment-reasons-reference.md" = @(5451, 5458)
  "remittance-apis/remittance-states.md" = @(5579, 5590)
  "remittance-apis/list-banks-pk.md" = @(5590, 5671)
  "remittance-apis/list-banks-by-code-pk.md" = @(5671, 5728)
  "remittance-apis/get-fx-rate-pk.md" = @(5728, 5815)
  "remittance-apis/list-payment-purposes-pk.md" = @(5815, 5890)
  "remittance-apis/verify-account-title.md" = @(5890, 5960)
  "remittance-apis/remit-initiate-single-pk.md" = @(5960, 6039)
  "remittance-apis/register-remit-pk.md" = @(6039, 6115)
  "remittance-apis/remit-initiate-double-pk.md" = @(6115, 6180)
  "remittance-apis/transaction-inquiry-pk.md" = @(6180, 6250)
  "remittance-apis/merchant-balance-inquiry-pk.md" = @(6250, 6379)
  "platform-reference/status-codes/pay-out.md" = @(5238, 5281)
  "platform-reference/status-codes/remittance-pk.md" = @(6313, 6379)
  "getting-started/regional-coverage.md" = @(0, 0)
}

$map2 = @{
  "pay-out-apis/overview-bd.md" = @(1, 85)
  "pay-out-apis/initiate-disbursement-bd.md" = @(204, 283)
  "pay-out-apis/inquire-disbursement-bd.md" = @(283, 351)
  "pay-out-apis/disbursement-states-bd.md" = @(369, 380)
  "pay-out-apis/status-codes-bd.md" = @(380, 446)
  "remittance-apis/overview-bd.md" = @(446, 492)
  "remittance-apis/payment-reasons-bd.md" = @(538, 545)
  "remittance-apis/remittance-states-bd.md" = @(664, 675)
  "remittance-apis/list-banks-bd.md" = @(675, 744)
  "remittance-apis/list-banks-by-code-bd.md" = @(744, 801)
  "remittance-apis/get-fx-rate-bd.md" = @(801, 876)
  "remittance-apis/list-payment-purposes-bd.md" = @(876, 951)
  "remittance-apis/remit-initiate-single-bd.md" = @(951, 1034)
  "remittance-apis/register-remit-bd.md" = @(1034, 1110)
  "remittance-apis/remit-initiate-double-bd.md" = @(1110, 1175)
  "remittance-apis/transaction-inquiry-bd.md" = @(1175, 1251)
  "remittance-apis/merchant-balance-inquiry-bd.md" = @(1251, 1386)
  "remittance-apis/status-codes-bd.md" = @(1320, 1386)
}

$count = 0
foreach ($kv in $map1.GetEnumerator()) {
  if ($kv.Value[0] -eq 0) { continue }
  $dest = Join-Path $root $kv.Key
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  $content = Get-Section $l1 $kv.Value[0] $kv.Value[1]
  Set-Content -Path $dest -Value $content -Encoding UTF8
  $count++
}
foreach ($kv in $map2.GetEnumerator()) {
  $dest = Join-Path $root $kv.Key
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  $content = Get-Section $l2 $kv.Value[0] $kv.Value[1]
  Set-Content -Path $dest -Value $content -Encoding UTF8
  $count++
}

# Merge PK+BD payout initiate
$pk = Get-Content (Join-Path $root "pay-out-apis/initiate-disbursement-pk.md") -Raw -Encoding UTF8
$bd = Get-Content (Join-Path $root "pay-out-apis/initiate-disbursement-bd.md") -Raw -Encoding UTF8
$merged = "# Initiate Disbursement`n`n## Pakistan`n`n$pk`n`n---`n`n## Bangladesh`n`n$bd"
Set-Content (Join-Path $root "pay-out-apis/initiate-disbursement.md") -Value $merged -Encoding UTF8

# Merge overview
$pkO = Get-Content (Join-Path $root "pay-out-apis/overview.md") -Raw -Encoding UTF8
$bdO = Get-Content (Join-Path $root "pay-out-apis/overview-bd.md") -Raw -Encoding UTF8
Set-Content (Join-Path $root "pay-out-apis/overview.md") -Value "# Pay-Out APIs`n`n## Pakistan`n`n$pkO`n`n---`n`n## Bangladesh`n`n$bdO" -Encoding UTF8

Write-Output "Extracted $count sections"
