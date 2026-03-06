#!/bin/bash

# Codenames Game - Quick Setup Script (Linux/macOS)

echo "========================================="
echo "Codenames Game - Development Setup"
echo "========================================="

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo "Running migrations..."
python manage.py migrate

echo "✅ Backend setup complete"

cd ..

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
fi

echo "✅ Frontend setup complete"

cd ..

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start Redis (in a new terminal):"
echo "   redis-server"
echo ""
echo "2. Start Backend (in a new terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python manage.py runserver"
echo ""
echo "3. Start Frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open your browser at: http://localhost:3000"
echo ""
echo "========================================="
