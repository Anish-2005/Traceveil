@echo off
REM Traceveil startup script for Windows

echo Starting Traceveil - Fraud Detection System
echo ==========================================

REM Ensure script runs from project root
if not exist "requirements.txt" (
    echo Error: Run this script from the Traceveil project root directory
    pause
    exit /b 1
)

echo Installing Python dependencies...
pip install -r requirements.txt

echo Cleaning stale backend process on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /R /C:":8000 .*LISTENING"') do (
    echo Stopping process %%a bound to port 8000
    taskkill /PID %%a /F > nul 2>&1
)

echo Starting FastAPI backend server...
echo API: http://localhost:8000
echo Docs: http://localhost:8000/docs
start "Traceveil API" cmd /c "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo Starting Next.js webapp...
echo Webapp: http://localhost:3000
cd webapp
if not exist "node_modules" (
    npm install
)
start "Traceveil WebApp" cmd /c "npm run dev"

echo.
echo Traceveil started
echo Web:  http://localhost:3000
echo API:  http://localhost:8000/docs
echo.
echo Press any key to exit this launcher...
pause > nul
