@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm were not found.
  echo Install Node.js from https://nodejs.org/ and run this again.
  pause
  exit /b 1
)

echo Installing dependencies...
call npm install

echo.
echo Starting FlowCache locally...
start "" http://localhost:5173
call npm run dev -- --host 127.0.0.1
