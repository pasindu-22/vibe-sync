# Quick Setup Guide

## 🚀 Step-by-Step Backend Setup

### Prerequisites
- Python 3.8 or higher installed
- Git (optional, for cloning)
- At least 4GB free disk space (for model files)

### Step 1: Navigate to Backend Directory
```bash
cd "<path_to_Vibe-Sync>\Vibe-Sync\vibe-sync\backend"
```

### Step 2: Run Initial Setup
```bash
setup.bat
```

**What this does:**
- Creates Python virtual environment (`venv/`)
- Installs all required dependencies

### Step 3: Generate Model Files (If Needed)

If you see "⚠️ Model files not found" message:

#### Option A: Run Jupyter Notebook (Recommended)
```bash
# Activate virtual environment first
venv\Scripts\activate.bat

# Install Jupyter if not already installed
pip install jupyter

# Start Jupyter notebook
jupyter notebook app/notebook/music-genre-classification.ipynb
```

Then in the notebook:
1. Run all cells (Cell → Run All)
2. Wait for training to complete (~30-60 minutes)
3. Model files will be saved automatically

#### Option B: Download Pre-trained Models
If you have pre-trained model files:
1. Place `efficientnet_music_genre_model.h5` in `app/cnn-models/`
2. Place `label_encoder.pkl` in `app/cnn-models/`

### Step 4: Start the Server
```bash
start_server.bat
```

**Server will be available at:**
- 📚 API Documentation: http://localhost:8000/docs
- 🔍 Health Check: http://localhost:8000/api/health/classification


## 🎯 Quick Commands Reference

### Daily Startup (After Initial Setup)
```bash
# Navigate to backend directory
cd "<path_to_Vibe-Sync>\Vibe-Sync\vibe-sync\backend"

# Start server
start_server.bat
```

### Manual Server Start
```bash
# Activate virtual environment
venv\Scripts\activate.bat

# Start server manually
uvicorn app.main:app --reload --host localhost --port 8000
```

### Troubleshooting Commands
```bash
# Reinstall dependencies
venv\Scripts\activate.bat
pip install -r requirements.txt

# Check virtual environment
venv\Scripts\activate.bat
python --version
pip list

# Check if server is running
curl http://localhost:8000/api/health/
```

## 📂 Project Structure

```
backend/
├── setup.bat                    # Initial setup script
├── start_server.bat            # Daily server start script  
├── example_usage.py            # API usage examples
├── venv/                       # Virtual environment 
└── app/
    ├── main.py                 # FastAPI utilities
    ├── services/
    │   └── music_classifier.py # Classification service
    ├── routers/
    │   ├── music_classification.py  # API endpoints
    │   └── health.py               # Health checks
    ├── config/
    │   └── music_config.py     # Configuration
    └── cnn-models/             # Model files
        ├── efficientnet_music_genre_model.h5
        └── label_encoder.pkl
```

## 🎵 API Endpoints

Once running, visit: **http://localhost:8000/docs**

## 💡 How It Works

1. **Audio Processing**: Converts audio to mel spectrograms (224x224 images)
2. **Segmentation**: Divides long tracks into 30-second segments  
3. **Classification**: Uses EfficientNetB0 model for each segment
4. **Voting**: Final genre determined by majority vote across segments
