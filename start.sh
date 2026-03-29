#!/bin/bash
# Traceveil startup script

set -e

echo "Starting Traceveil - Fraud Detection System"
echo "=========================================="

if [ ! -f "requirements.txt" ]; then
  echo "Error: Run this script from the Traceveil project root directory"
  exit 1
fi

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Cleaning stale backend process on port 8000..."
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -ti :8000 || true)
  if [ -n "$PIDS" ]; then
    echo "Stopping process(es): $PIDS"
    kill -9 $PIDS || true
  fi
elif command -v fuser >/dev/null 2>&1; then
  fuser -k 8000/tcp || true
fi

echo "Starting FastAPI backend server..."
echo "API:  http://localhost:8000"
echo "Docs: http://localhost:8000/docs"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
API_PID=$!

echo "Starting Next.js webapp..."
echo "Webapp: http://localhost:3000"
cd webapp
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev &
WEBAPP_PID=$!

echo
echo "Traceveil started"
echo "Web: http://localhost:3000"
echo "API: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop all services"

trap 'echo "Stopping services..."; kill $API_PID $WEBAPP_PID 2>/dev/null || true; exit' INT TERM
wait
