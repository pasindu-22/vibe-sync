@echo off
echo Starting Vibe-Sync Music Classification Server...

REM Check if we're in the correct directory
if not exist "app\main.py" (
    echo.
    echo Error: Please run this script from the backend directory
    echo Current directory should contain app\main.py
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo.
    echo Virtual environment not found!
    echo Please run setup.bat first to create the virtual environment.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Starting FastAPI server...
echo Press Ctrl+C to stop the server
echo.
uvicorn app.main:app --reload --host localhost --port 8000
