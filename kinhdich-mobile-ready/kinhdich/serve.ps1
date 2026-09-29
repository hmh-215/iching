param(
    [int]$Port = 8000
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "[LOI] Khong the mo cong $Port. Hay thu cong khac: .\serve.ps1 -Port 8080" -ForegroundColor Red
    exit 1
}

$localIPs = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*", "Ethernet*" -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike "169.*" -and $_.IPAddress -notlike "127.*" }).IPAddress

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  DICH HOC NGU LINH - MAY CHU TINH (POWERSHELL STATIC SERVER)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "May tinh:      $prefix" -ForegroundColor Green
if ($localIPs) {
    foreach ($ip in $localIPs) {
        Write-Host "Dien thoai:    http://$($ip):$Port/ (cung mang WiFi)" -ForegroundColor Yellow
    }
}
Write-Host "Nhan Ctrl+C de dung may chu." -ForegroundColor DarkGray
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray

# Tu dong mo trinh duyet
Start-Process $prefix

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($localPath)) {
            $localPath = "index.html"
        }
        $localPath = [System.Uri]::UnescapeDataString($localPath)
        $filePath = Join-Path $PSScriptRoot $localPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".webmanifest" { "application/manifest+json" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = "404 Not Found: " + $localPath
            $buf = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $response.ContentLength64 = $buf.Length
            $response.OutputStream.Write($buf, 0, $buf.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}