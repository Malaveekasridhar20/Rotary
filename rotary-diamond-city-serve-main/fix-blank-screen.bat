@echo off
echo Fixing blank screen issues for Rotary Diamond City application...

echo.
echo Step 1: Clearing node_modules and package-lock.json
rd /s /q node_modules
del package-lock.json

echo.
echo Step 2: Reinstalling dependencies
call npm install

echo.
echo Step 3: Clearing Vite cache
rd /s /q node_modules\.vite

echo.
echo Step 4: Rebuilding the application
call npm run build

echo.
echo Step 5: Starting the application in development mode
echo.
echo Please open http://localhost:5173 in your browser
echo If you still see a blank screen, try http://localhost:5173/minimal.html
echo.
call npm run dev