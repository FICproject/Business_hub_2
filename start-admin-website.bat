@echo off
set "PATH=C:\Users\dhanu\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0admin-website"
echo Starting Business Hub Admin Website on http://localhost:5174 ...
npm run dev
pause
