@echo off
TITLE Business Hub - Backend API (Port 5000)
cd /d "%~dp0backend"
echo ===================================================
echo       Starting Business Hub Backend API
echo       URL: http://localhost:5000
echo ===================================================
echo.
npm run dev
pause
