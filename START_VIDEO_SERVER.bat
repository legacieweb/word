@echo off
echo ========================================
echo   Church Reels - Video Server
echo ========================================
echo.
echo Starting video server...
echo.
echo Videos folder: %~dp0church_videos
echo Server URL: http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
node get_videos.js

pause