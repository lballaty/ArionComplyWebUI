#!/bin/bash
# File path: arioncomply-v1/start-migration-dev.sh
# Starts both original mockup and new React app for side-by-side comparison

set -e

echo "🚀 Starting ArionComply Migration Development Environment"
echo "=================================================="

# Configuration
MOCKUP_PORT=8080
REACT_PORT=3000
MOCKUP_DIR="../../arioncomplymain/Mockup"
REACT_DIR="frontend-web"
PID_FILE=".migration-dev.pids"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "$MOCKUP_DIR" ] || [ ! -d "$REACT_DIR" ]; then
    echo -e "${RED}❌ Error: Run this script from arioncomply-v1/ directory${NC}"
    echo "   Expected directories: $MOCKUP_DIR/ and $REACT_DIR/"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down development servers...${NC}"
    if [ -f "$PID_FILE" ]; then
        while IFS= read -r pid; do
            if kill -0 "$pid" 2>/dev/null; then
                echo "Stopping process $pid"
                kill "$pid" 2>/dev/null || true
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    echo -e "${GREEN}✅ Development environment stopped${NC}"
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Check if ports are already in use
check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Port $port is already in use${NC}"
        echo "   Please stop the process using port $port or change the port in this script"
        echo "   To find what's using the port: lsof -Pi :$port -sTCP:LISTEN"
        exit 1
    fi
}

echo -e "${BLUE}🔍 Checking port availability...${NC}"
check_port $MOCKUP_PORT "Mockup Server"
check_port $REACT_PORT "React Development Server"

# Clear any existing PID file
rm -f "$PID_FILE"

echo -e "${BLUE}📁 Starting Original Mockup Server...${NC}"
cd "$MOCKUP_DIR"

# Start mockup server
if command -v python3 >/dev/null 2>&1; then
    echo "Using Python 3 HTTP server"
    python3 -m http.server $MOCKUP_PORT > ../mockup-server.log 2>&1 &
    MOCKUP_PID=$!
elif command -v python >/dev/null 2>&1; then
    echo "Using Python 2 HTTP server"
    python -m SimpleHTTPServer $MOCKUP_PORT > ../mockup-server.log 2>&1 &
    MOCKUP_PID=$!
elif command -v npx >/dev/null 2>&1; then
    echo "Using npx http-server"
    npx http-server -p $MOCKUP_PORT -s > ../mockup-server.log 2>&1 &
    MOCKUP_PID=$!
else
    echo -e "${RED}❌ No suitable HTTP server found${NC}"
    echo "   Please install Python 3, Python 2, or Node.js with npx"
    exit 1
fi

# Save mockup PID
echo $MOCKUP_PID >> "../$PID_FILE"
cd ..

# Wait a moment and check if mockup server started
sleep 2
if ! kill -0 $MOCKUP_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start mockup server${NC}"
    cat mockup-server.log
    exit 1
fi

echo -e "${GREEN}✅ Mockup server started (PID: $MOCKUP_PID)${NC}"

echo -e "${BLUE}⚛️  Starting React Development Server...${NC}"
cd "$REACT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing React dependencies...${NC}"
    npm install
fi

# Start React development server
npm run dev > ../react-dev.log 2>&1 &
REACT_PID=$!

# Save React PID
echo $REACT_PID >> "../$PID_FILE"
cd ..

# Wait for React server to start
echo -e "${YELLOW}⏳ Waiting for React development server to start...${NC}"
sleep 5

# Check if React server started
if ! kill -0 $REACT_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start React development server${NC}"
    echo "Check react-dev.log for details:"
    tail -20 react-dev.log
    exit 1
fi

# Wait for React server to be ready
echo -e "${BLUE}🔄 Checking React server status...${NC}"
for i in {1..30}; do
    if curl -s "http://localhost:$REACT_PORT" >/dev/null 2>&1; then
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ React server did not start within 30 seconds${NC}"
        echo "Check react-dev.log for details:"
        tail -20 react-dev.log
        exit 1
    fi
    sleep 1
done

echo -e "${GREEN}✅ React development server started (PID: $REACT_PID)${NC}"

# Create quick access script
cat > open-migration-urls.sh << EOF
#!/bin/bash
# Quick script to open both UIs
echo "Opening migration development URLs..."

# Detect OS and open URLs
if [[ "\$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:$MOCKUP_PORT"
    open "http://localhost:$REACT_PORT"
elif [[ "\$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:$MOCKUP_PORT" 2>/dev/null &
    xdg-open "http://localhost:$REACT_PORT" 2>/dev/null &
elif [[ "\$OSTYPE" == "msys" ]] || [[ "\$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "http://localhost:$MOCKUP_PORT"
    start "http://localhost:$REACT_PORT"
fi
EOF

chmod +x open-migration-urls.sh

echo ""
echo -e "${GREEN}🎉 Migration Development Environment Ready!${NC}"
echo "=================================================="
echo -e "${BLUE}📱 Original Mockup:${NC}     http://localhost:$MOCKUP_PORT"
echo -e "${BLUE}⚛️  React Application:${NC}  http://localhost:$REACT_PORT"
echo ""
echo -e "${YELLOW}🔗 Quick Access:${NC}"
echo "   ./open-migration-urls.sh    # Opens both URLs in browser"
echo ""
echo -e "${YELLOW}📊 Comparison Pages:${NC}"
echo "   Mockup Dashboard:     http://localhost:$MOCKUP_PORT/dashboard.html"
echo "   React Dashboard:      http://localhost:$REACT_PORT/dashboard"
echo "   Mockup List View:     http://localhost:$MOCKUP_PORT/listView.html"
echo "   React List View:      http://localhost:$REACT_PORT/lists"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo "   Mockup Server:        tail -f mockup-server.log"
echo "   React Dev Server:     tail -f react-dev.log"
echo ""
echo -e "${YELLOW}🛑 To Stop:${NC}"
echo "   Press Ctrl+C or run: ./stop-migration-dev.sh"
echo ""

# Create stop script
cat > stop-migration-dev.sh << 'EOF'
#!/bin/bash
# File path: arioncomply-v1/stop-migration-dev.sh
# Stops both mockup and React development servers

PID_FILE=".migration-dev.pids"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping Migration Development Environment...${NC}"

if [ -f "$PID_FILE" ]; then
    while IFS= read -r pid; do
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            echo "Stopping process $pid"
            kill "$pid" 2>/dev/null || true
            # Wait for process to stop
            for i in {1..5}; do
                if ! kill -0 "$pid" 2>/dev/null; then
                    break
                fi
                sleep 1
            done
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                echo "Force stopping process $pid"
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
fi

# Clean up log files
rm -f mockup-server.log react-dev.log

# Clean up helper scripts
rm -f open-migration-urls.sh

echo -e "${GREEN}✅ Migration development environment stopped${NC}"
EOF

chmod +x stop-migration-dev.sh

# Auto-open URLs if possible
echo -e "${BLUE}🌐 Opening URLs in browser...${NC}"
./open-migration-urls.sh

echo ""
echo -e "${GREEN}✨ Development environment is running!${NC}"
echo -e "${YELLOW}   Press Ctrl+C to stop all servers${NC}"
echo ""

# Keep script running and show live logs
echo -e "${BLUE}📊 Live Development Logs (Ctrl+C to exit):${NC}"
echo "=================================================="

# Show both logs in parallel
tail -f mockup-server.log react-dev.log &
TAIL_PID=$!

# Wait for user to stop
wait

#!/bin/bash
# File path: arioncomply-v1/quick-migration-compare.sh
# Quick comparison script for specific pages during migration

MOCKUP_PORT=8080
REACT_PORT=3000

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 ArionComply Migration Quick Comparison${NC}"
echo "============================================="

# Check if servers are running
if ! curl -s "http://localhost:$MOCKUP_PORT" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Mockup server not running on port $MOCKUP_PORT${NC}"
    echo "   Run: ./start-migration-dev.sh"
    exit 1
fi

if ! curl -s "http://localhost:$REACT_PORT" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  React server not running on port $REACT_PORT${NC}"
    echo "   Run: ./start-migration-dev.sh"
    exit 1
fi

echo -e "${GREEN}✅ Both servers are running${NC}"
echo ""

# Function to open comparison
open_comparison() {
    local page_name=$1
    local mockup_path=$2
    local react_path=$3
    
    echo -e "${BLUE}🔗 Opening: $page_name${NC}"
    echo "   Mockup: http://localhost:$MOCKUP_PORT/$mockup_path"
    echo "   React:  http://localhost:$REACT_PORT/$react_path"
    
    # Open URLs based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:$MOCKUP_PORT/$mockup_path"
        open "http://localhost:$REACT_PORT/$react_path"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "http://localhost:$MOCKUP_PORT/$mockup_path" 2>/dev/null &
        xdg-open "http://localhost:$REACT_PORT/$react_path" 2>/dev/null &
    fi
    echo ""
}

# Show menu
echo -e "${YELLOW}Select pages to compare:${NC}"
echo "1) Dashboard (Phase 1 - ✅ Completed)"
echo "2) List View (Phase 2 - 🔄 Next)"
echo "3) Settings (Phase 2 - 🔄 Next)"
echo "4) Chat Interface (Phase 2 - 🔄 Next)"
echo "5) All Phase 1 & 2 pages"
echo "6) Custom URLs"
echo "0) Exit"
echo ""

read -p "Enter your choice (1-6, 0 to exit): " choice

case $choice in
    1)
        open_comparison "Dashboard" "dashboard.html" "dashboard"
        ;;
    2)
        open_comparison "List View" "listView.html" "lists"
        ;;
    3)
        open_comparison "Settings" "settingsPanel.html" "settings"
        ;;
    4)
        open_comparison "Chat Interface" "chatInterface.html" "chat"
        ;;
    5)
        echo -e "${BLUE}🚀 Opening all Phase 1 & 2 pages...${NC}"
        open_comparison "Dashboard" "dashboard.html" "dashboard"
        sleep 1
        open_comparison "List View" "listView.html" "lists"
        sleep 1
        open_comparison "Settings" "settingsPanel.html" "settings"
        sleep 1
        open_comparison "Chat Interface" "chatInterface.html" "chat"
        ;;
    6)
        echo "Enter custom paths:"
        read -p "Mockup path (e.g., dashboard.html): " mockup_custom
        read -p "React path (e.g., dashboard): " react_custom
        open_comparison "Custom" "$mockup_custom" "$react_custom"
        ;;
    0)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${YELLOW}⚠️  Invalid choice${NC}"
        ;;
esac
