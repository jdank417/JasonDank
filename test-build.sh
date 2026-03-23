#!/bin/bash

echo "🚀 Testing Next.js build for GitHub Pages deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if out directory was created
    if [ -d "out" ]; then
        echo "✅ Static export directory 'out' created successfully!"
        echo "📊 Build output size:"
        du -sh out/
        
        # List key files
        echo "📁 Key files in output:"
        ls -la out/ | head -10
        
        echo "🎉 Build test completed successfully!"
        echo "💡 The site should now work properly on GitHub Pages without flashing issues."
    else
        echo "❌ Error: 'out' directory not found. Static export may have failed."
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi