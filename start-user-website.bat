@echo off
set "PATH=C:\Users\dhanu\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0user-website"
echo Starting Business Hub User Website on http://localhost:5173 ...
npm run dev
pause
