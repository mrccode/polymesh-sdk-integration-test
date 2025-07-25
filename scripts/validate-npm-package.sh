#!/bin/bash
set -e

echo "🔍 NPM Package Validation Started"
echo "=================================="

# Check package.json configuration
echo "📋 Validating package.json configuration..."
if ! jq -e '.name | startswith("@test-org/")' package.json > /dev/null; then
    echo "❌ Error: Package name must start with @test-org/"
    exit 1
fi

if ! jq -e '.publishConfig.access == "public"' package.json > /dev/null; then
    echo "❌ Error: publishConfig.access must be 'public'"
    exit 1
fi

echo "✅ Package.json configuration valid"

# Build the package
echo "🔨 Building package..."
npm run build
echo "✅ Package built successfully"

# Test dry-run publishing
echo "🧪 Testing npm publish --dry-run..."
if timeout 120 npm publish --dry-run --ignore-scripts; then
    echo "✅ Dry-run publish successful"
else
    echo "❌ Dry-run publish failed"
    exit 1
fi

# Create and inspect tarball
echo "📦 Creating and inspecting tarball..."
npm pack
TARBALL=$(ls *.tgz | head -1)
echo "📋 Tarball contents:"
tar -tzf "$TARBALL" | head -20

# Validate tarball structure
echo "🔍 Validating tarball structure..."
if tar -tzf "$TARBALL" | grep -q "package/dist/"; then
    echo "✅ Built files included in tarball"
else
    echo "❌ Built files missing from tarball"
    exit 1
fi

if tar -tzf "$TARBALL" | grep -q "package/src/"; then
    echo "⚠️  Warning: Source files included in tarball"
fi

# Test tarball installation
echo "🔧 Testing tarball installation..."
if npm install "./$TARBALL" --dry-run; then
    echo "✅ Tarball installation simulation successful"
else
    echo "❌ Tarball installation simulation failed"
    exit 1
fi

# Cleanup
echo "🧹 Cleaning up..."
rm -f *.tgz

echo "🎉 All validations passed!"
echo "=========================="