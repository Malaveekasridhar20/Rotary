@echo off
echo Starting Rotary Diamond City application...

echo.
echo Step 1: Starting backend server
start cmd /k "cd rotary-backend && node database-server.cjs"

echo.
echo Step 2: Waiting for backend to initialize
timeout /t 5

echo.
echo Step 3: Starting frontend
start cmd /k "npm run dev"

echo.
echo Application started!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.