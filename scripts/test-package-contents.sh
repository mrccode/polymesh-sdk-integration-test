#!/bin/bash
set -e

echo "🔍 Package Content Validation"
echo "============================="

# Create tarball
echo "📦 Creating tarball..."
npm pack

TARBALL=$(ls *.tgz | head -1)
echo "Testing tarball: $TARBALL"

# Extract tarball for inspection
echo "📂 Extracting tarball..."
mkdir -p temp-extract
tar -xzf "$TARBALL" -C temp-extract

# Validate required files
echo "✅ Checking required files..."
REQUIRED_FILES=("package/package.json" "package/dist/" "package/README.md")

for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "temp-extract/$file" ]; then
        echo "✅ Found: $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

# Check for unwanted files
echo "🚫 Checking for unwanted files..."
UNWANTED_PATTERNS=("package/src/" "package/node_modules/" "package/.git/" "package/tests/" "package/.env")

for pattern in "${UNWANTED_PATTERNS[@]}"; do
    if ls temp-extract/$pattern 2>/dev/null; then
        echo "⚠️  Warning: Found unwanted files matching $pattern"
    else
        echo "✅ No unwanted files matching $pattern"
    fi
done

# Validate package.json in tarball
echo "📋 Validating packaged package.json..."
PACKAGED_JSON="temp-extract/package/package.json"

if ! jq -e '.name == "@test-org/polymesh-sdk-integration-test"' "$PACKAGED_JSON" > /dev/null; then
    echo "❌ Error: Package name incorrect in tarball"
    exit 1
fi

if ! jq -e '.main' "$PACKAGED_JSON" > /dev/null; then
    echo "❌ Error: Main entry point missing"
    exit 1
fi

echo "✅ Package.json validation passed"

# Show package size
echo "📊 Package size analysis..."
SIZE=$(stat -f%z "$TARBALL" 2>/dev/null || stat -c%s "$TARBALL")
echo "Tarball size: $SIZE bytes ($(echo "scale=2; $SIZE/1024" | bc 2>/dev/null || python3 -c "print(f'{$SIZE/1024:.2f}')")KB)"

if [ $SIZE -gt 10485760 ]; then  # 10MB
    echo "⚠️  Warning: Package size exceeds 10MB"
fi

# Cleanup
echo "🧹 Cleaning up..."
rm -rf temp-extract
rm -f *.tgz

echo "🎉 Package content validation completed!"