# Reorganize 14 modules from html_css_modules into kinhdich-mobile-ready/kinhdich
param(
    [string]$SourceDir = "D:\huong\antigravity\iching\html_css_modules",
    [string]$TargetDir = "D:\huong\antigravity\iching\kinhdich-mobile-ready\kinhdich"
)

$ErrorActionPreference = "Stop"

$MODULE_MAP = @(
    @{ file = '00-luan8que.html';              slug = 'luan8que';   name = 'Luan 8 que';           type = 'lookup' },
    @{ file = '00-luan64que.html';             slug = 'luan64que';  name = 'Luan 64 que';          type = 'lookup' },
    @{ file = '00-luan10sao.html';             slug = 'luan10sao';  name = 'Luan 10 sao';          type = 'lookup' },
    @{ file = '00-bien_khi.html';              slug = 'bienkhi';    name = 'Bien khi';             type = 'lookup' },
    @{ file = '00-luan9sao_clndd.html';        slug = 'luan9sao';   name = 'Luan 9 sao (CLNDD)';   type = 'lookup' },
    @{ file = '00-khi_clndd.html';             slug = 'khiclndd';   name = 'Khi CLNDD';            type = 'lookup' },
    @{ file = '01-que_do_thu.html';            slug = 'dothu';      name = 'Do thu phi ban don';   type = 'calc'   },
    @{ file = '01-que_ngu_linh.html';          slug = 'nguling';    name = 'Ngu linh';             type = 'calc'   },
    @{ file = '02-ma_phuong.html';             slug = 'maphuong';   name = 'Ma phuong';            type = 'calc'   },
    @{ file = '02-cung_sinh_cung_phi.html';    slug = 'cungsinh';   name = 'Cung sinh - cung phi'; type = 'calc'   },
    @{ file = '02-que_tieu_van.html';          slug = 'tieuvan';    name = 'Que tieu van';         type = 'calc'   },
    @{ file = '02-tam_tuyet_phap.html';        slug = 'tamtuyet';   name = 'Tam tuyet phap';       type = 'calc'   },
    @{ file = '02-tam_y_tam_sinh.html';        slug = 'tamy';       name = 'Tam y tam sinh';       type = 'calc'   },
    @{ file = '03-chan_linh_nhan_do_don.html'; slug = 'chanlinh';   name = 'Chan linh nhan don';   type = 'calc'   }
)

function Scope-CSS([string]$css, [string]$slug) {
    $scope = '.kd-mod[data-mod="' + $slug + '"]'

    # Remove global body / html rules
    $css = [regex]::Replace($css, '(?s):root\[data-theme=["'']?dark["'']?\]', $scope)
    $css = [regex]::Replace($css, '(?s):root\[data-theme=["'']?light["'']?\]', '[data-theme="light"] ' + $scope)
    $css = [regex]::Replace($css, '(?s)\[data-theme=["'']?light["'']?\]', '[data-theme="light"] ' + $scope)
    $css = [regex]::Replace($css, '(?s):root\b[^{]*\{', $scope + ' {')
    $css = [regex]::Replace($css, '(?s)\b(html,\s*body|html|body)\s*\{[^\}]*\}', '')
    $css = [regex]::Replace($css, '(?s)\*\{box-sizing:[^}]*\}', '')

    # Now parse rules line by line or block by block
    $sb = New-Object System.Text.StringBuilder
    $len = $css.Length
    $i = 0

    while ($i -lt $len) {
        while ($i -lt $len -and [char]::IsWhiteSpace($css[$i])) { $i++ }
        if ($i -ge $len) { break }

        # Check comment
        if ($css[$i] -eq '/' -and $i + 1 -lt $len -and $css[$i+1] -eq '*') {
            $endC = $css.IndexOf('*/', $i + 2)
            if ($endC -eq -1) { $endC = $len - 2 }
            [void]$sb.Append($css.Substring($i, $endC - $i + 2))
            $i = $endC + 2
            continue
        }

        # Check @media
        if ($css[$i] -eq '@') {
            $brace = $css.IndexOf('{', $i)
            if ($brace -eq -1) { break }
            $atH = $css.Substring($i, $brace - $i).Trim()

            # Find matching closing brace
            $depth = 1
            $j = $brace + 1
            while ($j -lt $len -and $depth -gt 0) {
                if ($css[$j] -eq '{') { $depth++ }
                elseif ($css[$j] -eq '}') { $depth-- }
                $j++
            }
            $inner = $css.Substring($brace + 1, $j - $brace - 2)

            if ($atH -match '^@media') {
                $scopedInner = Scope-CSS $inner $slug
                [void]$sb.AppendLine($atH + " {`n" + $scopedInner + "`n}")
            } else {
                [void]$sb.AppendLine($css.Substring($i, $j - $i))
            }
            $i = $j
            continue
        }

        # Regular selector block
        $brace = $css.IndexOf('{', $i)
        if ($brace -eq -1) { break }

        $selectors = $css.Substring($i, $brace - $i).Trim()
        $depth = 1
        $j = $brace + 1
        while ($j -lt $len -and $depth -gt 0) {
            if ($css[$j] -eq '{') { $depth++ }
            elseif ($css[$j] -eq '}') { $depth-- }
            $j++
        }
        $body = $css.Substring($brace + 1, $j - $brace - 2).Trim()

        if ($selectors) {
            $parts = $selectors.Split(',')
            $scopedParts = @()
            foreach ($p in $parts) {
                $trimmed = $p.Trim()
                if ($trimmed.StartsWith($scope) -or $trimmed.StartsWith('[data-theme="light"] ' + $scope)) {
                    $scopedParts += $trimmed
                } else {
                    $scopedParts += ($scope + ' ' + $trimmed)
                }
            }
            [void]$sb.AppendLine(($scopedParts -join ', ') + " {`n  " + $body + "`n}")
        }

        $i = $j
    }

    return $sb.ToString()
}

$utf8 = [System.Text.Encoding]::UTF8

foreach ($item in $MODULE_MAP) {
    $srcFile = Join-Path $SourceDir $item.file
    $slug = $item.slug
    Write-Host "Processing module: [$slug] ($($item.name)) from $($item.file)..."

    if (-not (Test-Path $srcFile)) {
        Write-Host "  [ERROR] Source file not found: $srcFile" -ForegroundColor Red
        continue
    }

    $raw = [System.IO.File]::ReadAllText($srcFile, $utf8)

    # 1. Extract CSS
    $css = ""
    $mCSS = [regex]::Match($raw, '(?s)<style>(.*?)<\/style>')
    if ($mCSS.Success) {
        $css = $mCSS.Groups[1].Value.Trim()
    }
    $scoped = Scope-CSS $css $slug
    $cssFile = Join-Path $TargetDir ("css/modules/" + $slug + ".css")
    [System.IO.File]::WriteAllText($cssFile, $scoped, $utf8)
    Write-Host "  [OK] CSS scoped written: $cssFile ($($scoped.Length) chars)" -ForegroundColor Green

    # 2. Extract HTML fragment
    $frag = ""
    $mWrap = [regex]::Match($raw, '(?s)<body[^>]*>\s*(<div class=["'']?wrap["'']?>.*<\/div>)\s*<script>')
    if ($mWrap.Success) {
        $frag = $mWrap.Groups[1].Value.Trim()
    } else {
        $mWrap2 = [regex]::Match($raw, '(?s)(<div class=["'']?wrap["'']?>.*<\/div>)')
        if ($mWrap2.Success) {
            $frag = $mWrap2.Groups[1].Value.Trim()
        } else {
            $styleEnd = $raw.IndexOf('</style>')
            $scriptStart = $raw.IndexOf('<script>')
            if ($styleEnd -ne -1 -and $scriptStart -ne -1) {
                $frag = $raw.Substring($styleEnd + 8, $scriptStart - $styleEnd - 8).Trim()
                $frag = [regex]::Replace($frag, '(?s)^.*?<body[^>]*>', '')
                $frag = [regex]::Replace($frag, '(?s)<\/body>.*$', '')
                $frag = "<div class=`"wrap`">`n" + $frag + "`n</div>"
            }
        }
    }

    # Remove internal theme toggle buttons
    $frag = [regex]::Replace($frag, '(?s)<button[^>]*id=["'']?(theme-toggle|theme-btn)["'']?[^>]*>.*?<\/button>', '')

    # Standardize result div for lookup modules if needed
    if ($item.type -eq 'lookup' -and -not ($frag -match 'id=["'']?result["'']?')) {
        $frag = [regex]::Replace($frag, '(?s)(<div class=["'']?rule["'']?>.*?<\/div>)', "`$1`n  <div id=`"result`">`n")
        $frag = [regex]::Replace($frag, '(<\/div>\s*)$', "  </div>`n`$1")
    }

    $fragFile = Join-Path $TargetDir ("html/modules/" + $slug + ".frag.html")
    [System.IO.File]::WriteAllText($fragFile, $frag, $utf8)
    Write-Host "  [OK] HTML fragment written: $fragFile ($($frag.Length) chars)" -ForegroundColor Green

    # 3. Extract Script
    $js = ""
    $mJS = [regex]::Match($raw, '(?s)<script>(.*?)<\/script>')
    if ($mJS.Success) {
        $js = $mJS.Groups[1].Value.Trim()
    }

    # Wrap in factory function window.KD_MOD[slug]
    $jsWrap = New-Object System.Text.StringBuilder
    [void]$jsWrap.AppendLine("window.KD_MOD = window.KD_MOD || {};")
    [void]$jsWrap.AppendLine("window.KD_MOD[`"$slug`"] = function() {")
    [void]$jsWrap.AppendLine("  const host = document.querySelector('.kd-mod[data-mod=`"$slug`"]');")
    [void]$jsWrap.AppendLine("  if (!host) return;")
    [void]$jsWrap.AppendLine("")
    [void]$jsWrap.AppendLine("  /* ---- Original Module Logic ---- */")
    [void]$jsWrap.AppendLine($js)
    [void]$jsWrap.AppendLine("")
    [void]$jsWrap.AppendLine("  /* ---- Unified Bridge ---- */")
    [void]$jsWrap.AppendLine("  if (typeof cast === 'function') {")
    [void]$jsWrap.AppendLine("    window.cast = cast;")
    [void]$jsWrap.AppendLine("    window.__KD_CAST = cast;")
    [void]$jsWrap.AppendLine("  } else {")
    [void]$jsWrap.AppendLine("    window.__KD_CAST = function() {};")
    [void]$jsWrap.AppendLine("  }")
    [void]$jsWrap.AppendLine("};")

    $jsFile = Join-Path $TargetDir ("js/modules/" + $slug + ".js")
    [System.IO.File]::WriteAllText($jsFile, $jsWrap.ToString(), $utf8)
    Write-Host "  [OK] JS module written: $jsFile ($($jsWrap.Length) chars)" -ForegroundColor Green
}

Write-Host "`nAll 14 modules successfully extracted and structured!" -ForegroundColor Cyan
