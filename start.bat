@echo off
TITLE Business Hub - Unified Dev Environment
echo ===================================================
echo           Starting Business Hub Services
echo ===================================================
echo.
echo 1. Backend Server:  http://localhost:5000
echo 2. User Website:    http://localhost:3000
echo 3. Admin Website:   http://localhost:3001
echo.
echo Press Ctrl+C in this window anytime to stop all services.
echo ===================================================
echo.

npm run dev
pause
