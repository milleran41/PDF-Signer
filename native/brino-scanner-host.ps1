$ErrorActionPreference = "Stop"

function Read-NativeMessage {
  $stdin = [Console]::OpenStandardInput()
  $lengthBytes = New-Object byte[] 4
  $read = $stdin.Read($lengthBytes, 0, 4)
  if ($read -ne 4) { return $null }
  $length = [BitConverter]::ToInt32($lengthBytes, 0)
  if ($length -le 0) { return $null }

  $buffer = New-Object byte[] $length
  $offset = 0
  while ($offset -lt $length) {
    $chunk = $stdin.Read($buffer, $offset, $length - $offset)
    if ($chunk -le 0) { break }
    $offset += $chunk
  }
  if ($offset -ne $length) { return $null }
  $json = [Text.Encoding]::UTF8.GetString($buffer)
  return $json | ConvertFrom-Json
}

function Write-NativeMessage($payload) {
  $json = $payload | ConvertTo-Json -Compress -Depth 8
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $lengthBytes = [BitConverter]::GetBytes([Int32]$bytes.Length)
  $stdout = [Console]::OpenStandardOutput()
  $stdout.Write($lengthBytes, 0, 4)
  $stdout.Write($bytes, 0, $bytes.Length)
  $stdout.Flush()
}

function Invoke-WiaScan {
  $tmp = Join-Path $env:TEMP ("brino-scan-{0}.png" -f ([Guid]::NewGuid().ToString("N")))
  $dialog = $null
  $image = $null
  try {
    $scannerDeviceType = 1
    $colorIntent = 1
    $maximizeQuality = 131072
    $pngFormat = "{B96B3CAF-0728-11D3-9D7B-0000F81EF32E}"

    $dialog = New-Object -ComObject WIA.CommonDialog
    $image = $dialog.ShowAcquireImage($scannerDeviceType, $colorIntent, $maximizeQuality, $pngFormat, $true, $true, $true)
    if ($null -eq $image) {
      return @{ canceled = $true }
    }

    $image.SaveFile($tmp)
    $bytes = [IO.File]::ReadAllBytes($tmp)
    return @{
      pages = @(
        @{
          mimeType = "image/png"
          imageBase64 = [Convert]::ToBase64String($bytes)
          label = "Scan"
        }
      )
    }
  } catch {
    $hresult = $_.Exception.HResult
    if ($hresult -eq -2145320939 -or $hresult -eq -2145320938) {
      return @{ canceled = $true }
    }
    return @{ error = $_.Exception.Message }
  } finally {
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue }
    if ($image) { [Runtime.InteropServices.Marshal]::ReleaseComObject($image) | Out-Null }
    if ($dialog) { [Runtime.InteropServices.Marshal]::ReleaseComObject($dialog) | Out-Null }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
  }
}

$message = Read-NativeMessage
if ($null -eq $message) {
  Write-NativeMessage @{ error = "No native message received." }
  exit 0
}

if ($message.action -ne "scan") {
  Write-NativeMessage @{ error = "Unsupported action." }
  exit 0
}

Write-NativeMessage (Invoke-WiaScan)
