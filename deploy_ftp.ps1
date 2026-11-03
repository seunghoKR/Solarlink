$ftpServer = "ftp://115.68.168.242/public_html"
$user = "agentsolar26"
$pass = "seungho0409#"
$localBase = (Resolve-Path "frontend\dist").Path

function Make-FtpDirectory($remoteUri) {
    try {
        $req = [System.Net.FtpWebRequest]::Create($remoteUri)
        $req.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.UsePassive = $true
        $req.KeepAlive = $false
        $resp = $req.GetResponse()
        $resp.Close()
        Write-Host "Created remote dir: $remoteUri"
    } catch {
        # Directory might already exist, ignore
    }
}

function Upload-FtpFile($localFilePath, $remoteUri) {
    $req = [System.Net.FtpWebRequest]::Create($remoteUri)
    $req.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
    $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $req.UseBinary = $true
    $req.UsePassive = $true
    $req.KeepAlive = $false

    $content = [System.IO.File]::ReadAllBytes($localFilePath)
    $req.ContentLength = $content.Length

    $reqStream = $req.GetRequestStream()
    $reqStream.Write($content, 0, $content.Length)
    $reqStream.Close()

    $resp = $req.GetResponse()
    $resp.Close()
    Write-Host "Uploaded: $(Split-Path $localFilePath -Leaf) -> $remoteUri"
}

Write-Host "Starting deployment to iwinv web hosting ($ftpServer) for https://re100life.com..."

$files = Get-ChildItem -Path $localBase -Recurse -File -Force
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($localBase.Length).TrimStart("\")
    $remotePathParts = $relativePath.Split("\")
    
    # Ensure intermediate directories exist
    $currentRemote = $ftpServer
    for ($i = 0; $i -lt ($remotePathParts.Length - 1); $i++) {
        $currentRemote = "$currentRemote/$($remotePathParts[$i])"
        Make-FtpDirectory $currentRemote
    }

    $finalRemoteFileUri = "$ftpServer/$($relativePath.Replace('\', '/'))"
    Upload-FtpFile $file.FullName $finalRemoteFileUri
}

Write-Host "Deployment completed successfully!"
