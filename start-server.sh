#!/bin/bash

# Start a local Python HTTP server
# This allows you to open the website in any browser without file:// restrictions

echo "🚀 Starting ShopEase local server..."
echo "📱 Open your browser and visit: http://localhost:8000"
echo "⌨️  Press Ctrl+C to stop the server"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found. Please install Python to run the local server."
    exit 1
fi
