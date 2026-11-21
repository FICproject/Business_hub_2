@echo off
TITLE Business Hub - Admin Website (Port 3001)
cd /d "%~dp0admin-website"
echo ===================================================
echo       Starting Business Hub Admin Website
echo       URL: http://localhost:3001
echo ===================================================
echo.
npm run dev
pause
