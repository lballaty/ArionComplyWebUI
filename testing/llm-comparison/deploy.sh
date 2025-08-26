#!/bin/bash

# deploy.sh - Automated deployment script for Compliance Assistant
set -e

# Parse command line arguments
SKIP_FUNCTION_DEPLOY=false
if [ "$1" = "--skip-function" ] || [ "$1" = "-s" ]; then
    SKIP_FUNCTION_DEPLOY=true
    echo "⏩ Skipping edge function deployment"
fi

echo "🚀 Deploying Compliance Assistant..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found! Please copy .env.template to .env and fill in your values."
    exit 1
fi

# Check if config.json exists
if [ ! -f "config.json" ]; then
    echo "❌ config.json file not found!"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$OPENAI_API_KEY" ] || [ -z "$ANTHROPIC_API_KEY" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing required API keys in .env file"
    echo "Required: OPENAI_API_KEY, ANTHROPIC_API_KEY, SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Environment variables loaded"

# Create Supabase functions directory structure if it doesn't exist
mkdir -p supabase/functions/_shared
mkdir -p supabase/functions/compliance-proxy

echo "✅ Directory structure created"

# Set Supabase secrets
echo "🔐 Setting up Supabase secrets..."
supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
supabase secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"

# Read config.json and set as environment variable
CONFIG_JSON=$(cat config.json | jq -c .)
supabase secrets set COMPLIANCE_CONFIG="$CONFIG_JSON"

echo "✅ Secrets configured"

# Deploy the edge function (conditionally)
if [ "$SKIP_FUNCTION_DEPLOY" = false ]; then
    echo "📦 Deploying edge function..."
    supabase functions deploy compliance-proxy
    echo "✅ Edge function deployed"
else
    echo "⏩ Skipped edge function deployment"
fi

# Get Supabase URL
if [ -z "$SUPABASE_URL" ]; then
    if [ -z "$SUPABASE_PROJECT_REF" ]; then
        echo "⚠️  Please set SUPABASE_PROJECT_REF in .env or SUPABASE_URL"
        echo "   You can find your project ref in your Supabase dashboard URL"
        echo "   Example: https://app.supabase.com/project/YOUR_PROJECT_REF"
    else
        SUPABASE_URL="https://$SUPABASE_PROJECT_REF.supabase.co"
    fi
fi

# Create a simple config file for the frontend
cat > frontend-config.js << EOF
// Auto-generated configuration
window.COMPLIANCE_CONFIG = {
    supabaseUrl: '$SUPABASE_URL',
    functionUrl: '$SUPABASE_URL/functions/v1/compliance-proxy',
    anonKey: '$SUPABASE_ANON_KEY'
};
EOF

echo "✅ Frontend configuration created"

echo ""
echo "🎉 Deployment complete!"
echo ""

# Ask user what they want to do
echo "🤔 What would you like to do next?"
echo "1. Start web server and test (recommended)"
echo "2. Just show URLs and exit"
echo ""
read -p "Choose option (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting web server and opening browser..."
        # Kill any existing servers
        lsof -ti:8000 | xargs kill -9 2>/dev/null || true
        
        # Start server in background
        python3 -m http.server 8000 > /dev/null 2>&1 &
        SERVER_PID=$!
        
        # Wait for server to start
        sleep 2
        
        # Open browser
        open http://localhost:8000
        
        echo "✅ Server running on http://localhost:8000"
        echo "✅ Browser opened automatically"
        echo ""
        echo "💡 To stop server later: ./stop-server.sh"
        echo "💡 To restart server only: ./start-server.sh"
        echo ""
        
        # Save PID
        echo $SERVER_PID > .server.pid
        ;;
    2)
        echo ""
        echo "📋 URLs and Commands:"
        echo "🔗 Function URL: $SUPABASE_URL/functions/v1/compliance-proxy"
        echo "🌐 To start server: ./start-server.sh"
        echo "🛑 To stop server: ./stop-server.sh"
        echo ""
        ;;
    *)
        echo "Invalid choice. Use ./start-server.sh to start testing."
        ;;
esac

echo "🎯 Ready to test compliance questions!"