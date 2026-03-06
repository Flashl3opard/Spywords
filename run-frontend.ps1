Set-Location "$PSScriptRoot\frontend"

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Starting frontend on http://localhost:3000 ..." -ForegroundColor Green
npm run dev
