@echo off
echo Using minimal App version for Rotary Diamond City...

echo.
echo Step 1: Stopping any running Node.js processes
taskkill /f /im node.exe 2>nul

echo.
echo Step 2: Backing up current App.tsx
copy src\App.tsx src\App.tsx.bak

echo.
echo Step 3: Using minimal App version
copy src\App.minimal.tsx src\App.tsx

echo.
echo Step 4: Clearing Vite cache
rd /s /q node_modules\.vite 2>nul

echo.
echo Step 5: Starting backend server
start cmd /k "cd rotary-backend && node database-server.cjs"

echo.
echo Step 6: Waiting for backend to initialize
timeout /t 3

echo.
echo Step 7: Starting frontend
start cmd /k "npm run dev"

echo.
echo Application started with minimal App version!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.