@echo off
TITLE Business Hub - User Website (Port 3000)
cd /d "%~dp0user-website"
echo ===================================================
echo       Starting Business Hub User Website
echo       URL: http://localhost:3000
echo ===================================================
echo.
npm run dev
pause
