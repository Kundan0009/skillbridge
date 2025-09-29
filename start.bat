@echo off
echo 🚀 Starting SkillBridge Application...

echo 📡 Starting server on port 9000...
cd server
start "SkillBridge Server" cmd /k "npm start"

echo ⏳ Waiting for server to start...
timeout /t 10 /nobreak >nul

echo 🌐 Starting client on port 4000...
cd ..\client
start "SkillBridge Client" cmd /k "npm start"

echo ✅ Both servers started!
echo 📡 Server: http://localhost:9000
echo 🌐 Client: http://localhost:4000
echo.
echo Press any key to exit...
pause >nul