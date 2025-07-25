#!/bin/bash
set -e

echo "🔨 Build Process Verification"
echo "============================"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm test -- --run

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build outputs
echo "✅ Verifying build outputs..."
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not created"
    exit 1
fi

if [ ! -f "dist/index.js" ]; then
    echo "❌ Error: dist/index.js not found"
    exit 1
fi

if [ ! -f "dist/index.d.ts" ]; then
    echo "❌ Error: dist/index.d.ts not found"
    exit 1
fi

echo "✅ Build outputs verified"

# Test the built package
echo "🧪 Testing built package..."
node -e "require('./dist/index.js'); console.log('✅ Package loads successfully')"

# Generate build report
echo "📊 Build Report"
echo "==============="
echo "Build directory: $(du -sh dist/ | cut -f1)"
echo "Files created: $(find dist/ -type f | wc -l)"
echo "Build timestamp: $(date)"

echo "🎉 Build process verification completed!"