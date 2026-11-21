@echo off
TITLE Business Hub - Launcher
echo ===================================================
echo     Launching All Business Hub Services
echo     (Each running in its own terminal window)
echo ===================================================
echo.

start "Backend Server" cmd /k "call "%~dp0start-backend.bat""
timeout /t 2 /nobreak >nul

start "User Website" cmd /k "call "%~dp0start-user-website.bat""
start "Admin Website" cmd /k "call "%~dp0start-admin-website.bat""

echo All web services launched in dedicated windows!
echo.
pause
