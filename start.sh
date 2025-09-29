#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting SkillBridge Application..."

# Function to check if server is ready
check_server_health() {
  local max_attempts=30
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:9000/api/health >/dev/null 2>&1; then
      echo "✅ Server is ready!"
      return 0
    fi
    echo "⏳ Waiting for server... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
  done
  
  echo "❌ Server failed to start within 60 seconds"
  return 1
}

# Start server in background
echo "📡 Starting server on port 9000..."
cd server
if ! npm start & then
  echo "❌ Failed to start server"
  exit 1
fi
SERVER_PID=$!
cd ..

# Wait for server to be ready
if ! check_server_health; then
  echo "❌ Killing server process"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

# Start client
echo "🌐 Starting client on port 4000..."
cd client
if ! npm start & then
  echo "❌ Failed to start client"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi
CLIENT_PID=$!
cd ..

echo "✅ Both servers started successfully!"
echo "📡 Server: http://localhost:9000"
echo "🌐 Client: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Cleanup function
cleanup() {
  echo "\n🛑 Stopping servers..."
  kill $SERVER_PID $CLIENT_PID 2>/dev/null || true
  wait $SERVER_PID $CLIENT_PID 2>/dev/null || true
  echo "✅ Servers stopped"
  exit 0
}

# Wait for user interrupt
trap cleanup INT TERM
wait