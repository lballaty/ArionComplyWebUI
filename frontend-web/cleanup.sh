#!/bin/bash

# ArionComply Comprehensive Cleanup Script
# This script resets EVERYTHING back to basic Next.js state for clean implementation

echo "🧹 Comprehensive cleanup for ArionComply Phase 1 + Chat implementation..."

# Check if we're in a Next.js project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your Next.js project root directory."
    echo "   (The directory that contains package.json, src/, next.config.js, etc.)"
    exit 1
fi

if [ ! -d "src" ]; then
    echo "❌ Error: src/ directory not found. Please run this script from your Next.js project root directory."
    exit 1
fi

echo "✅ Found Next.js project structure, proceeding with cleanup..."

# 1. Reset main application files to basic state
echo "📄 Resetting main application files..."

# Reset layout.tsx to basic state
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArionComply - AI Accountability & Compliance Platform',
  description: 'Multi-framework compliance platform with AI accountability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
EOF

# Reset page.tsx to basic state  
cat > src/app/page.tsx << 'EOF'
'use client';

export default function HomePage() {
  return (
    <div>
      <h1>ArionComply - Module Cards Page</h1>
      <p>This will be replaced with the exact module cards routing page.</p>
    </div>
  );
}
EOF

# Reset Providers.tsx to basic state
cat > src/components/providers/Providers.tsx << 'EOF'
'use client';

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
EOF

# Reset globals.css to basic state with Tailwind
cat > src/styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* This will be replaced with the complete vanilla JS styles */
EOF

# 2. Remove any existing over-engineered components
echo "🗑️ Removing over-engineered components..."

# Remove any existing auth components
rm -rf src/components/auth 2>/dev/null
rm -rf src/app/auth 2>/dev/null

# Remove any existing chat components  
rm -rf src/components/chat 2>/dev/null

# Remove any existing layout components that might be over-engineered
rm -rf src/components/layout 2>/dev/null

# Remove any existing styles that might conflict
rm -rf src/styles/components 2>/dev/null
rm -rf src/styles/vanilla 2>/dev/null

# Remove any other potentially problematic directories
rm -rf src/components/ui/auth 2>/dev/null
rm -rf src/hooks/useAuth.ts 2>/dev/null
rm -rf src/hooks/useChat.ts 2>/dev/null
rm -rf src/contexts 2>/dev/null
rm -rf src/lib/auth.ts 2>/dev/null

# 3. Clean up any dashboard route conflicts
echo "🧽 Cleaning up route conflicts..."

# Keep dashboard directory but ensure it's basic
if [ -d "src/app/dashboard" ]; then
    echo "   Dashboard directory exists - keeping it"
else
    echo "   Dashboard directory not found - you can create it later"
fi

# Remove any auth middleware or route protection that might interfere
rm -rf src/middleware.ts 2>/dev/null

# 4. Create clean directory structure
echo "📁 Creating clean directory structure..."

# Create proper directory structure for Phase 1
mkdir -p src/components/auth
mkdir -p src/components/chat  
mkdir -p src/components/layout
mkdir -p src/styles/vanilla
mkdir -p src/app/auth

# 5. Clear any localStorage that might interfere with testing
echo "🧹 Note: Clear browser localStorage before testing"

# 6. Clean up any package.json scripts or dependencies that might be added
echo "📦 Checking package.json..."
if ! grep -q "next" package.json; then
    echo "⚠️  Warning: This doesn't look like a Next.js project"
    echo "   Make sure you're in the correct frontend-web directory"
fi

# 7. Create status file
cat > CLEANUP_STATUS.md << 'EOF'
# Cleanup Complete ✅

## What Was Reset:
- ✅ src/app/layout.tsx - Reset to basic Next.js layout
- ✅ src/app/page.tsx - Reset to placeholder page  
- ✅ src/components/providers/Providers.tsx - Reset to basic provider
- ✅ src/styles/globals.css - Reset to basic Tailwind
- ✅ Removed all over-engineered auth/chat components
- ✅ Removed conflicting layout components
- ✅ Cleaned up directory structure

## Next Steps:
1. Copy the 9 component files from Claude's artifacts
2. Run: npm run dev
3. Test the complete authentication + chat system

## Directory Structure Created:
```
src/
├── app/
│   ├── auth/          # ✅ Ready for auth page
│   ├── layout.tsx     # ✅ Reset to basic
│   └── page.tsx       # ✅ Reset to placeholder
├── components/
│   ├── auth/          # ✅ Ready for auth components
│   ├── chat/          # ✅ Ready for chat components
│   ├── layout/        # ✅ Ready for layout components
│   └── providers/     # ✅ Reset to basic
└── styles/
    ├── globals.css    # ✅ Reset to basic
    └── vanilla/       # ✅ Ready for vanilla CSS
```

## Ready for Phase 1 Implementation! 🚀
EOF

echo ""
echo "✅ Comprehensive cleanup complete!"
echo ""
echo "📋 Summary:"
echo "   - Reset all main files to basic Next.js state"
echo "   - Removed all over-engineered components"  
echo "   - Created clean directory structure"
echo "   - Ready for Phase 1 + Chat implementation"
echo ""
echo "📖 Next steps:"
echo "   1. Copy the 9 component files from Claude's artifacts"
echo "   2. Run: npm run dev"
echo "   3. Test authentication flow"
echo ""
echo "🧹 Remember to clear browser localStorage before testing:"
echo "   - Open DevTools → Console → Run: localStorage.clear()"
echo ""
echo "🚀 Ready for clean Phase 1 implementation!"
