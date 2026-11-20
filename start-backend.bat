@echo off
set "PATH=C:\Users\dhanu\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0backend"
echo Starting Business Hub Backend on http://localhost:5000 ...
npm run dev
pause
