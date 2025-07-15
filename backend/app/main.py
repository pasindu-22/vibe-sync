# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from .auth.firebase_auth import get_current_user
from .routers import user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(user.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Vibe-Sync"}

@app.get("/classify")
def classify_music(track_url: str):
    # This is a placeholder. In the future, you'd integrate audio classification logic here
    return {"track": track_url, "genre": "Pop", "mood": "Happy"}

# Authentication verification endpoint
@app.get("/auth/verify")
def verify_token(user_info: dict = Depends(get_current_user)):
    """
    Verify if the Firebase token is valid.
    """
    return {
        "authenticated": True,
        "user": user_info
    }
