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



#################

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
import os

import spotipy
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from spotipy.oauth2 import SpotifyOAuth
from starlette.middleware.sessions import SessionMiddleware


# Load .env file
load_dotenv()

# Authenticate using your client ID and secret
client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
secret_key=os.getenv("SESSION_SECRET")

print(f"Client ID: {client_id}")
print(f"Client Secret: {client_secret}")

auth_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(auth_manager=auth_manager)

results = sp.search(q="lorde royals", type='track', limit=5)

import requests

for track in results['tracks']['items']:
    name = track['name']
    artist = track['artists'][0]['name']
    preview_url = track['preview_url']

    if not preview_url:
        print(f"⚠️ No preview for: {name} by {artist}")
        continue

    print(f"✅ Downloading: {name} by {artist}")
    print(f"Preview URL: {preview_url}")
    print("-----------")

    response = requests.get(preview_url)
    with open(f"{name}.mp3", "wb") as f:
        f.write(response.content)

@app.get("/search_and_download")
def search_and_download(query: str):
    results = sp.search(q=query, type='track', limit=5)
    for track in results['tracks']['items']:
        if track['preview_url']:
            return {"title": track['name'], "artist": track['artists'][0]['name'], "preview": track['preview_url']}
    return {"error": "No preview URLs found for this query"}




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.add_middleware(SessionMiddleware, secret_key=secret_key, same_site="none", https_only=True)


@app.get("/")
def read_root():
    return {"message": "Welcome to Vibe-Sync"}

@app.get("/classify")
def classify_music(track_url: str):
    # This is a placeholder. In the future, you'd integrate audio classification logic here
    return {"track": track_url, "genre": "Pop", "mood": "Happy"}


@app.get("/get_song")
def get_song(title: str, artist: str = ""):
    print(f"Searching for song: {title} by {artist}")
    query = f"{title} {artist}".strip()
    results = sp.search(q=query, type='track', limit=1)

    if results['tracks']['items']:
        track = results['tracks']['items'][0]
        return {
            "title": track['name'],
            "artist": track['artists'][0]['name'],
            "preview_url": track['preview_url'],
            "spotify_url": track['external_urls']['spotify'],
            "album": track['album']['name'],
            "image": track['album']['images'][0]['url'] if track['album']['images'] else None
        }
    else:
        return {"error": "❌ Song not found"}




############

# Step 1: Search for the artist and get their Spotify ID
def get_artist_id(artist_name):
    result = sp.search(q=f"artist:{artist_name}", type="artist", limit=1)
    if result['artists']['items']:
        return result['artists']['items'][0]['id']
    return None

# Step 2: Get all albums by the artist
def get_all_albums(artist_id):
    albums = []
    results = sp.artist_albums(artist_id=artist_id, album_type="album", limit=50)
    albums.extend(results['items'])

    # Handle pagination
    while results['next']:
        results = sp.next(results)
        albums.extend(results['items'])

    # Remove duplicate album names
    seen = set()
    unique_albums = []
    for album in albums:
        if album['name'] not in seen:
            seen.add(album['name'])
            unique_albums.append(album)
    return unique_albums

# Step 3: Get all tracks from each album
def get_all_tracks(albums):
    all_tracks = []
    for album in albums:
        tracks = sp.album_tracks(album['id'])['items']
        for track in tracks:
            all_tracks.append({
                'name': track['name'],
                'album': album['name'],
                'id': track['id']
            })
    return all_tracks

@app.get("/get_all_songs")
def get_all_songs(artist_name: str):
    artist_id = get_artist_id(artist_name)
    if not artist_id:
        return {"error": "Artist not found"}

    albums = get_all_albums(artist_id)
    tracks = get_all_tracks(albums)

    return {
        "artist": artist_name,
        "total_songs": len(tracks),
        "songs": tracks
    }

################## use song name for this endpoint 

@app.get("/get_song_by_name")
def get_song_by_name(title: str):
    results = sp.search(q=title, type='track', limit=5)
    songs = []

    for track in results['tracks']['items']:
        songs.append({
            "title": track['name'],
            "artist": track['artists'][0]['name'],
            "album": track['album']['name'],
            "preview_url": track['preview_url'],
            "id": track['id']
        })

    if not songs:
        return {"error": "No matching songs found"}
    
    return {"results": songs}


######################Authorization flow


sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope="user-read-private user-read-email user-top-read",
    open_browser=False
)



@app.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    print(f"Redirecting to Spotify for authentication: {auth_url}")
    return RedirectResponse(auth_url)

@app.get("/callback")
def callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return {"error": "Missing code from Spotify callback"}

    token_info = sp_oauth.get_access_token(code)
    request.session["token_info"] = token_info
    print("✅ Stored token in session:", request.session.get("token_info"))

    return {"message": "Login successful!", "access_token": token_info['access_token']}



@app.get("/songs_by_genre")
def get_songs_by_genre(request: Request, genre: str):
    print("Received genre:", genre)
    
    token_info = request.session.get("token_info")
    print(token_info)

    if not token_info:
        return {"error": "User not authenticated"}

    sp = spotipy.Spotify(auth=token_info["access_token"])

    try:
        recommendations = sp.recommendations(seed_genres=[genre], limit=10)
        results = [
            {
                "name": track["name"],
                "artist": track["artists"][0]["name"],
                "preview_url": track["preview_url"]
            }
            for track in recommendations["tracks"]
        ]
        return {"genre": genre, "songs": results}
    except Exception as e:
        print("Error fetching recommendations:", str(e))
        return {"error": str(e)}


################### Get All available genres

@app.get("/available_genres")
def available_genres():
    print("📦 Using app-level credentials to get genres")

    auth_manager = SpotifyClientCredentials(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
    )

    # 🚨 This line forces token retrieval
    token = auth_manager.get_access_token()
    print("🔐 App token acquired:", token)

    sp = spotipy.Spotify(auth=token)

    try:
        genres = sp.recommendation_genre_seeds()
        return {"genres": genres["genres"]}
    except spotipy.exceptions.SpotifyException as e:
        print("❌ Spotify API error:", str(e))
        return {"error": "Failed to fetch genres from Spotify"}
