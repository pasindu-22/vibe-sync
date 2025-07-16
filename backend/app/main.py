"""
Main application entry point.
This module initializes the FastAPI application and includes all routers.
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .config.settings import SESSION_SECRET
from .auth.firebase_auth import get_current_user

# Import routers
from .routers import user
from .routers.spotify import songs, auth

# Create FastAPI app
app = FastAPI(
    title="Vibe-Sync API",
    description="Music streaming and analysis platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Add session middleware for Spotify auth
app.add_middleware(
    SessionMiddleware, 
    secret_key=SESSION_SECRET,
    # Uncomment these for production with HTTPS
    # same_site="none", 
    # https_only=True
)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Vibe-Sync API",
        "version": "1.0.0",
        "status": "online"
    }

# Include all routers
app.include_router(user.router)
app.include_router(songs.router)
app.include_router(auth.router)

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
