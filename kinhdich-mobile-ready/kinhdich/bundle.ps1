param(
    [string]$OutFile = "dist\kinh-dich-ngu-linh.html"
)

$root = $PSScriptRoot
if ([string]::IsNullOrEmpty($root)) { $root = (Get-Location).Path }

$slugs = @(
    'luan8que', 'luan64que', 'luan10sao', 'bienkhi', 'luan9sao', 'khiclndd',
    'dothu', 'nguling', 'maphuong', 'cungsinh', 'tieuvan', 'tamtuyet', 'tamy', 'dichtu', 'chanlinh'
)

$cssFiles = @('css/core/kd.css')
foreach ($s in $slugs) {
    $cssFiles += "css/modules/$s.css"
}

$htmlPath = Join-Path $root 'app.dc.html'
$html = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)

# 1. Inline CSS as Base64
foreach ($cssRel in $cssFiles) {
    $fullCssPath = Join-Path $root $cssRel
    if (Test-Path $fullCssPath) {
        $bytes = [System.IO.File]::ReadAllBytes($fullCssPath)
        $b64 = [Convert]::ToBase64String($bytes)
        $src = "href=""$cssRel"""
        $dst = "href=""data:text/css;base64,$b64"""
        $html = $html.Replace($src, $dst)
    }
}

# 2. Manifest: remove local manifest
$html = [System.Text.RegularExpressions.Regex]::Replace($html, '\n?<link rel="manifest"[^>]*>', '')

# 3. Inline all core scripts (auth.js, util.js, data.js, grid.js, flyingstar.js, interpret.js)
$coreFiles = @('auth.js', 'util.js', 'data.js', 'grid.js', 'flyingstar.js', 'interpret.js')
foreach ($cf in $coreFiles) {
    $cPath = Join-Path $root "js/core/$cf"
    if (Test-Path $cPath) {
        $cJs = [System.IO.File]::ReadAllText($cPath, [System.Text.Encoding]::UTF8)
        $srcTag = "<script src=""js/core/$cf""></script>"
        $dstTag = "<script>`n$cJs`n</script>"
        $html = $html.Replace($srcTag, $dstTag)
    }
}

# 4. Inline modules & data into KD_INLINE
$inlineEntries = @{}
foreach ($s in $slugs) {
    $fragPath = Join-Path $root "html/modules/$s.frag.html"
    $jsPath   = Join-Path $root "js/modules/$s.js"
    if (Test-Path $fragPath) {
        $inlineEntries["html/modules/$s.frag.html"] = [System.IO.File]::ReadAllText($fragPath, [System.Text.Encoding]::UTF8)
    }
    if (Test-Path $jsPath) {
        $inlineEntries["js/modules/$s.js"] = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)
    }
}
$inlineEntries['data/luan64.json'] = [System.IO.File]::ReadAllText((Join-Path $root 'data/luan64.json'), [System.Text.Encoding]::UTF8)
$inlineEntries['data/khi_clndd.json'] = [System.IO.File]::ReadAllText((Join-Path $root 'data/khi_clndd.json'), [System.Text.Encoding]::UTF8)
$inlineEntries['data/bienkhi.json'] = [System.IO.File]::ReadAllText((Join-Path $root 'data/bienkhi.json'), [System.Text.Encoding]::UTF8)

$sb = New-Object System.Text.StringBuilder
[void]$sb.Append('{')
$first = $true
foreach ($k in $inlineEntries.Keys) {
    if (-not $first) { [void]$sb.Append(',') }
    $first = $false
    $kJson = $k | ConvertTo-Json
    $vJson = ($inlineEntries[$k] | ConvertTo-Json) -replace '</', '<\/' -replace '<!--', '<\!--'
    [void]$sb.Append("`n  " + $kJson + ": " + $vJson)
}
[void]$sb.Append("`n}")

$supportPath = Join-Path $root 'js/runtime/support.js'
$supportJs = [System.IO.File]::ReadAllText($supportPath, [System.Text.Encoding]::UTF8)

$headInjection = @"
<script>
/* noi dung module nhung san — sinh boi bundle.ps1 */
window.KD_INLINE = $($sb.ToString());
</script>
<script>
$supportJs
</script>
"@

$supportTag = '<script src="./js/runtime/support.js"></script>'
$html = $html.Replace($supportTag, $headInjection)

$outFullPath = Join-Path $root $OutFile
$outDir = Split-Path -Parent $outFullPath
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outFullPath, $html, $utf8NoBom)

$sizeMb = (Get-Item $outFullPath).Length / 1MB
Write-Host "Da tao bundle thanh cong: $outFullPath ($([Math]::Round($sizeMb, 2)) MB)" -ForegroundColor Green
