#!/bin/bash
# Traceveil Startup Script

echo "🚀 Starting Traceveil - Fraud Detection System"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the Traceveil project root directory"
    exit 1
fi

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🔧 Starting FastAPI backend server..."
echo "   API will be available at: http://localhost:8000"
echo "   API documentation at: http://localhost:8000/docs"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
API_PID=$!

echo "🌐 Starting Next.js webapp..."
echo "   Webapp will be available at: http://localhost:3000"
cd webapp
npm install
npm run dev &
WEBAPP_PID=$!

echo ""
echo "✅ Traceveil is now running!"
echo "   🔗 Web Application: http://localhost:3000"
echo "   🔗 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "echo '🛑 Stopping services...'; kill $API_PID $WEBAPP_PID; exit" INT
wait