
# Music Genre and Mood Classifier

This project is a web application that allows users to upload or link music tracks, uses deep learning models to classify the genre and mood of the music, and generates personalized playlists based on these classifications and user preferences. It consists of a **FastAPI** backend and a **Next.js** frontend.

## Project Structure

```
your-project/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI main application
│   │   ├── models.py       # (Future) Database models and data structures
│   │   ├── services.py     # (Future) Business logic for music classification
│   └── requirements.txt    # Python dependencies for FastAPI
├── frontend/               # Next.js frontend
│   └── (Next.js project files)
└── README.md
```

## Prerequisites

- **Python 3.11** (Backend)
- **Node.js 18.x** or higher (Frontend)
- **WSL2** (Windows Subsystem for Linux) is recommended if you are on Windows for a seamless development experience.

---

## Backend Setup (FastAPI)

### Step 1: Install Python 3.11 and Create Virtual Environment

1. **Install Python 3.11** (if not already installed):

   ```bash
   sudo apt update
   sudo apt install -y python3.11 python3.11-venv python3.11-dev python3.11-distutils
   ```

2. **Create a virtual environment**:

   ```bash
   python3.11 -m venv venv
   ```

3. **Activate the virtual environment**:

   ```bash
   source venv/bin/activate
   ```

### Step 2: Install Backend Dependencies

1. **Install required Python packages from requirements.txt**:

   ```bash
   pip install -r requirements.txt
   ```

   This will install all the necessary dependencies including FastAPI, Uvicorn, librosa (for audio processing), TensorFlow, scikit-learn, and others.

### Step 3: Run the FastAPI Backend

1. **Navigate to the `backend` directory** and start the FastAPI app:

   ```bash
   uvicorn app.main:app --reload
   ```

   This will run the backend on [http://127.0.0.1:8000](http://127.0.0.1:8000).

2. You can check the API documentation at:

   [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Frontend Setup (Next.js)

### Step 1: Install Frontend Dependencies

1. **Navigate to the `frontend` directory** and install the necessary dependencies:

   ```bash
   npm install
   ```

2. **Run the Next.js frontend**:

   ```bash
   npm run dev
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## Communication Between Frontend and Backend

- The frontend (Next.js) makes API requests to the backend (FastAPI) to classify music genres and moods.
- Ensure that both the frontend and backend are running locally before trying to use the application.
- CORS (Cross-Origin Resource Sharing) is enabled in the FastAPI backend, allowing the frontend to communicate with it even when running on different ports.

---

