@echo off
echo Fixing React application for Rotary Diamond City...

echo.
echo Step 1: Backing up original files
copy src\App.tsx src\App.tsx.bak
copy src\main.tsx src\main.tsx.bak

echo.
echo Step 2: Replacing with simplified versions
copy src\App.simple.tsx src\App.tsx
copy src\main.simple.tsx src\main.tsx

echo.
echo Step 3: Clearing Vite cache
rd /s /q node_modules\.vite 2>nul

echo.
echo Step 4: Starting the application
echo.
echo Please open http://localhost:5173 in your browser
echo.
npm run dev