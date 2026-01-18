#!/bin/bash

# start.sh - Startup script for Railway/Heroku/Cloud deployments
# Builds TypeScript and starts the Probot app

set -e

echo "🚀 Starting Secure PR Reviewer..."

# Step 1: Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci --production
fi

# Step 2: Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Step 3: Check environment variables
echo "🔍 Checking environment variables..."
if [ -z "$APP_ID" ]; then
  echo "❌ Error: APP_ID environment variable not set"
  exit 1
fi

if [ -z "$WEBHOOK_SECRET" ]; then
  echo "❌ Error:  WEBHOOK_SECRET environment variable not set"
  exit 1
fi

if [ -z "$PRIVATE_KEY_PATH" ]; then
  echo "⚠️  Warning: PRIVATE_KEY_PATH not set, using ./private-key.pem"
  export PRIVATE_KEY_PATH="./private-key.pem"
fi

# Step 4: Verify private key exists
if [ ! -f "$PRIVATE_KEY_PATH" ]; then
  echo "❌ Error: Private key not found at $PRIVATE_KEY_PATH"
  echo "Please ensure the private key file exists or set PRIVATE_KEY_PATH correctly"
  exit 1
fi

echo "✅ All checks passed!"
echo "🌐 Starting Probot app on port ${PORT:-3000}..."

# Step 5: Start the app
npm start