Write-Host "Starting backend and frontend in separate PowerShell windows..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$PSScriptRoot\run-backend.ps1`""
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$PSScriptRoot\run-frontend.ps1`""

Write-Host "Launched:" -ForegroundColor Green
Write-Host "- Backend: http://localhost:8000"
Write-Host "- Frontend: http://localhost:3000"
