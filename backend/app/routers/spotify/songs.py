from fastapi import APIRouter, Request
from ...services.spotify_service import (
    get_spotify_client, 
    search_track, 
    get_artist_id, 
    get_all_albums, 
    get_all_tracks,
    get_spotify_user_client,
    get_genres
)

router = APIRouter(
    prefix="/songs",
    tags=["songs"],
    responses={404: {"description": "Not found"}},
)

@router.get("/by-name")
def get_song_by_name(title: str):
    spotify_client = get_spotify_client()
    results = spotify_client.search(q=title, type='track', limit=5)
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

@router.get("/get-song")
def get_song(title: str, artist: str = ""):
    spotify_client = get_spotify_client()
    tracks = search_track(spotify_client, title, artist)
    
    if tracks:
        track = tracks[0]
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

@router.get("/search-and-download")
def search_and_download(query: str):
    spotify_client = get_spotify_client()
    results = spotify_client.search(q=query, type='track', limit=5)
    for track in results['tracks']['items']:
        if track['preview_url']:
            return {"title": track['name'], "artist": track['artists'][0]['name'], "preview": track['preview_url']}
    return {"error": "No preview URLs found for this query"}

@router.get("/artist-songs")
def get_all_songs(artist_name: str):
    spotify_client = get_spotify_client()
    artist_id = get_artist_id(spotify_client, artist_name)
    if not artist_id:
        return {"error": "Artist not found"}

    albums = get_all_albums(spotify_client, artist_id)
    tracks = get_all_tracks(spotify_client, albums)

    return {
        "artist": artist_name,
        "total_songs": len(tracks),
        "songs": tracks
    }

@router.get("/by-genre")
def get_songs_by_genre(request: Request, genre: str):
    token_info = request.session.get("token_info")
    
    if not token_info:
        return {"error": "User not authenticated"}

    spotify_client = get_spotify_user_client(token_info["access_token"])

    try:
        recommendations = spotify_client.recommendations(seed_genres=[genre], limit=10)
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

@router.get("/classify")
def classify_music(track_url: str):
    # This is a placeholder that returns mock data
    return {"track": track_url, "genre": "Pop", "mood": "Happy"}

@router.get("/available-genres")
def available_genres():
    spotify_client = get_spotify_client()
    genres = get_genres(spotify_client)
    
    if genres:
        return {"genres": genres}
    else:
        return {"error": "Failed to fetch genres from Spotify"}
