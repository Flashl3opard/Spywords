# Codenames Game - Quick Setup Script (Windows PowerShell)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Codenames Game - Development Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Backend Setup
Write-Host ""
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Green
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Green
& "venv\Scripts\Activate.ps1"

Write-Host "Installing Python dependencies..." -ForegroundColor Green
pip install -r requirements.txt

if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Green
    Copy-Item .env.example .env
}

Write-Host "Running migrations..." -ForegroundColor Green
python manage.py migrate

Write-Host "✅ Backend setup complete" -ForegroundColor Green

Set-Location ..

# Frontend Setup
Write-Host ""
Write-Host "📦 Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend

if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing Node dependencies..." -ForegroundColor Green
    npm install
}

if (-Not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local file..." -ForegroundColor Green
    Copy-Item .env.local.example .env.local
}

Write-Host "✅ Frontend setup complete" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor White
Write-Host ""
Write-Host "1. Start Redis (in a new terminal):" -ForegroundColor Yellow
Write-Host "   redis-server" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Backend (in a new terminal):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "   python manage.py runserver" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Frontend (in a new terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open your browser at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
