@echo off
echo Setting up new SQLite database...
node setup-new-database.js
echo.
echo If successful, update the server to use the new database.
echo To use the new database, edit complete-api-server.js to use rotary_new.db
pause