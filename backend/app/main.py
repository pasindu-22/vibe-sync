# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Vibe-Sync"}

@app.get("/classify")
def classify_music(track_url: str):
    # This is a placeholder. In the future, you'd integrate audio classification logic here
    return {"track": track_url, "genre": "Pop", "mood": "Happy"}
