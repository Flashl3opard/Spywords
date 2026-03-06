Set-Location "$PSScriptRoot\backend"

if (-Not (Test-Path ".\venv\Scripts\python.exe")) {
  Write-Host "Creating virtual environment..." -ForegroundColor Yellow
  python -m venv venv
}

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
.\venv\Scripts\python.exe -m pip install -r requirements.txt

Write-Host "Applying migrations..." -ForegroundColor Cyan
.\venv\Scripts\python.exe manage.py migrate

if (-Not $env:USE_IN_MEMORY_CHANNEL_LAYER) {
  $env:USE_IN_MEMORY_CHANNEL_LAYER = "1"
}

Write-Host "Starting backend on http://localhost:8000 ..." -ForegroundColor Green
.\venv\Scripts\python.exe -m daphne -b 0.0.0.0 -p 8000 backend.asgi:application
