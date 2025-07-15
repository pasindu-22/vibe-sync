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

######################################################################


from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://sandeepravindu112:eoJcNVzzO2UHJKZ7@cluster0.ltmrd93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)