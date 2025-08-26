#!/bin/bash
# File path: stop-server.sh (in project root)
# Create this file with: chmod +x stop-server.sh

# stop-server.sh - Stop the web server
set -e

echo "🛑 Stopping web server..."

# Stop server using saved PID
if [ -f ".server.pid" ]; then
    SERVER_PID=$(cat .server.pid)
    if kill $SERVER_PID 2>/dev/null; then
        echo "✅ Server stopped (PID: $SERVER_PID)"
    else
        echo "⚠️  Server was already stopped"
    fi
    rm .server.pid
else
    echo "⚠️  No server PID found"
fi

# Kill any Python servers on port 8000 as backup
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

echo "✅ Port 8000 is now free"