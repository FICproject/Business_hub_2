@echo off
set "PATH=C:\Users\dhanu\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"
echo Starting All Business Hub Services (Backend + User Website + Admin Website)...
npm run dev
pause
