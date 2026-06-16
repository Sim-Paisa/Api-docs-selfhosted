$root = "c:\Users\SyedMohammadOmer\OneDrive - SIMPAISA\Desktop\simpaisa-docs-restructure"
Get-ChildItem $root -Recurse -Include "*-pk.md","*-bd.md","overview-bd.md","initiate-disbursement-pk.md" | 
    Where-Object { $_.Name -ne "banks-reference-pk.md" } |
    Remove-Item -Force -ErrorAction SilentlyContinue
$skip = @("README.md","NEW_HIERARCHY.md","IMAGE_CATALOG.md","PAGE_MIGRATION_MAP.csv")
$files = Get-ChildItem $root -Recurse -Filter "*.md" | Where-Object {
    $_.Name -notin $skip -and $_.DirectoryName -notmatch "unified-pay-in\\README"
} | Sort-Object FullName
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("# Table of contents")
[void]$sb.AppendLine()
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1).Replace("\", "/")
    [void]$sb.AppendLine("* [$($file.BaseName)]($rel)")
}
[System.IO.File]::WriteAllText((Join-Path $root "SUMMARY.md"), $sb.ToString())
Write-Output "Pages: $($files.Count)"
