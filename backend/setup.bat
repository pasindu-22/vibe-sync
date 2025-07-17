@echo off
echo Setting up Vibe-Sync Music Classification Backend...
echo.

REM Check if we're in the correct directory
if not exist "app\main.py" (
    echo Error: Please run this script from the backend directory
    echo Current directory should contain app\main.py
    pause
    exit /b 1
)

echo Step 1: Creating Python virtual environment...
if exist "venv" (
    echo Virtual environment already exists, skipping creation...
) else (
    echo Creating new virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo Error: Failed to create virtual environment
        echo Make sure Python is installed and available in PATH
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo Error: Failed to activate virtual environment
    pause
    exit /b 1
)
echo Virtual environment activated!

echo.
echo Step 3: Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo.
echo Dependencies installed successfully!
echo.
pause
