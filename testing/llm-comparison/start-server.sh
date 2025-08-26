#!/bin/bash
# File path: start-server.sh (in project root)
# Create this file with: chmod +x start-server.sh

# start-server.sh - Just start the web server for testing
set -e

echo "🌐 Starting Compliance Assistant web server..."

# Check if frontend-config.js exists
if [ ! -f "frontend-config.js" ]; then
    echo "❌ frontend-config.js not found!"
    echo "💡 Run ./deploy.sh first to set up the configuration"
    exit 1
fi

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found!"
    exit 1
fi

echo "✅ Configuration files found"

# Kill any existing Python servers on port 8000
echo "🧹 Cleaning up any existing servers..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Start HTTP server in background
echo "🚀 Starting web server on http://localhost:8000..."
python3 -m http.server 8000 > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if ! curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "❌ Failed to start web server"
    exit 1
fi

# Open browser
echo "🌐 Opening browser..."
open http://localhost:8000

echo ""
echo "✅ Web server running on http://localhost:8000"
echo "✅ Browser opened automatically"
echo ""
echo "🎯 Ready to test! Ask compliance questions and compare responses!"
echo ""
echo "💡 To stop server: kill $SERVER_PID"
echo "💡 Or run: ./stop-server.sh"
echo ""

# Save PID for easy stopping
echo $SERVER_PID > .server.pid