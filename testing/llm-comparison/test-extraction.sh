#!/bin/bash
# Test the JavaScript extraction

echo "🧪 Testing JavaScript extraction..."

echo "📁 Checking files..."
[ -f "index.html" ] && echo "✅ index.html" || echo "❌ index.html missing"
[ -f "extracted-functions.js" ] && echo "✅ extracted-functions.js" || echo "❌ extracted-functions.js missing"
[ -f "frontend-config.js" ] && echo "✅ frontend-config.js" || echo "❌ frontend-config.js missing"

echo "📊 File analysis:"
echo "Lines in index.html: $(wc -l < index.html)"
echo "Lines in extracted-functions.js: $(wc -l < extracted-functions.js)"

echo "🔍 Checking for script references..."
if grep -q "extracted-functions.js" index.html; then
    echo "✅ Script reference found in HTML"
else
    echo "❌ Script reference missing in HTML"
fi

echo "🔍 Checking for remaining inline scripts..."
if grep -q "<script>" index.html; then
    echo "⚠️  Some script tags still remain"
    grep -n "<script" index.html
else
    echo "✅ No inline script tags found"
fi

echo "🌐 Starting test server..."
python3 -m http.server 8000 > /dev/null 2>&1 &
SERVER_PID=$!

echo "✅ Server started (PID: $SERVER_PID)"
echo "🔗 Open: http://localhost:8000"
echo "🛑 To stop: kill $SERVER_PID"

echo ""
echo "🧪 Test checklist:"
echo "   1. Page loads without JavaScript errors (check browser console)"
echo "   2. All buttons and onclick handlers still work"
echo "   3. LLM comparison functionality works"
echo "   4. Database save functionality works"
echo ""
echo "💾 Original file backed up as: index.html.before-js-extraction.backup"

# Save PID for cleanup
echo $SERVER_PID > .test-server.pid
