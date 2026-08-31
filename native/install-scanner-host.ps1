param(
  [Parameter(Mandatory = $true)]
  [string]$ExtensionId
)

$ErrorActionPreference = "Stop"

$hostName = "com.codewerk.brino.scanner"
$nativeDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$hostPath = Join-Path $nativeDir "brino-scanner-host.cmd"
$manifestPath = Join-Path $nativeDir "$hostName.json"

$manifest = @{
  name = $hostName
  description = "BRINO Scanner Bridge"
  path = $hostPath
  type = "stdio"
  allowed_origins = @("chrome-extension://$ExtensionId/")
}

$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

$chromeKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$hostName"
$edgeKey = "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\$hostName"
New-Item -Path $chromeKey -Force | Out-Null
New-Item -Path $edgeKey -Force | Out-Null
Set-Item -Path $chromeKey -Value $manifestPath
Set-Item -Path $edgeKey -Value $manifestPath

Write-Host "BRINO Scanner Bridge registered for extension $ExtensionId"
Write-Host "Manifest: $manifestPath"
