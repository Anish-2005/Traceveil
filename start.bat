@echo off
REM Traceveil Startup Script for Windows

echo 🚀 Starting Traceveil - Fraud Detection System
echo ==============================================

REM Check if we're in the right directory
if not exist "requirements.txt" (
    echo ❌ Error: Please run this script from the Traceveil project root directory
    pause
    exit /b 1
)

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo 🔧 Starting FastAPI backend server...
echo    API will be available at: http://localhost:8000
echo    API documentation at: http://localhost:8000/docs
start "Traceveil API" cmd /c "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo 🌐 Starting Next.js webapp...
echo    Webapp will be available at: http://localhost:3000
cd webapp
if not exist "node_modules" (
    npm install
)
start "Traceveil WebApp" cmd /c "npm run dev"

echo.
echo ✅ Traceveil is now running!
echo    🔗 Web Application: http://localhost:3000
echo    🔗 API Documentation: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause > nul