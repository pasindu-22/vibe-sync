@echo off
echo Installing FFmpeg for Vibe-Sync Music Classification...
echo.

REM Check if FFmpeg already exists
where ffmpeg >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo FFmpeg is already installed and in PATH.
    echo.
    ffmpeg -version | findstr "ffmpeg version"
    echo.
    pause
    exit /b 0
)

REM Create ffmpeg directory
if not exist "C:\ffmpeg" mkdir "C:\ffmpeg"
cd /d "C:\ffmpeg"

echo Downloading FFmpeg...
echo Please download FFmpeg from: https://www.gyan.dev/ffmpeg/builds/
echo.
echo 1. Download the "release essentials" build
echo 2. Extract the contents to C:\ffmpeg\
echo 3. The structure should be: C:\ffmpeg\bin\ffmpeg.exe
echo.
echo Alternative: You can also use chocolatey:
echo   choco install ffmpeg
echo.
echo Or use winget:
echo   winget install FFmpeg
echo.
echo After installation, restart your terminal and try running the server again.
echo.
pause
