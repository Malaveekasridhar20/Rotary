@echo off
echo Starting Rotary Diamond City Dashboard...

echo.
echo Step 1: Stopping any running Node.js processes
taskkill /f /im node.exe 2>nul

echo.
echo Step 2: Starting static server
cd rotary-backend
start cmd /k "node static-server.cjs"

echo.
echo Dashboard started!
echo Please open http://localhost:3001/public/dashboard.html in your browser
echo.
timeout /t 3
start http://localhost:3001/public/dashboard.html