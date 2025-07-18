@echo off
echo Restarting Rotary Diamond City application...

echo.
echo Step 1: Stopping any running Node.js processes
taskkill /f /im node.exe 2>nul

echo.
echo Step 2: Clearing Vite cache
rd /s /q node_modules\.vite 2>nul

echo.
echo Step 3: Starting backend server
start cmd /k "cd rotary-backend && node database-server.cjs"

echo.
echo Step 4: Waiting for backend to initialize
timeout /t 3

echo.
echo Step 5: Starting frontend
start cmd /k "npm run dev"

echo.
echo Application restarted!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.