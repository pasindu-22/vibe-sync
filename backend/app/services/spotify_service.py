import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from ..config.settings import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI

# Create Spotify client with client credentials flow (app-level access)
def get_spotify_client():
    """
    Returns a Spotify client using client credentials flow (no user authentication required)
    """
    auth_manager = SpotifyClientCredentials(
        client_id=SPOTIFY_CLIENT_ID, 
        client_secret=SPOTIFY_CLIENT_SECRET
    )
    return spotipy.Spotify(auth_manager=auth_manager)

# Get OAuth2 instance for user-level authentication
def get_spotify_oauth():
    """
    Returns a SpotifyOAuth object for user authentication flow
    """
    return SpotifyOAuth(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET,
        redirect_uri=SPOTIFY_REDIRECT_URI,
        scope="user-read-private user-read-email user-top-read",
        open_browser=False
    )

# Create authenticated Spotify client using user token
def get_spotify_user_client(access_token):
    """
    Returns a Spotify client authenticated with a user's access token
    """
    return spotipy.Spotify(auth=access_token)


# Spotify data retrieval functions
def search_track(spotify_client, title, artist="", limit=1):
    """
    Search for a track by title and optional artist
    """
    query = f"{title} {artist}".strip()
    results = spotify_client.search(q=query, type='track', limit=limit)

    if results['tracks']['items']:
        return results['tracks']['items']
    return None

def get_artist_id(spotify_client, artist_name):
    """
    Get Spotify ID for an artist by name
    """
    result = spotify_client.search(q=f"artist:{artist_name}", type="artist", limit=1)
    if result['artists']['items']:
        return result['artists']['items'][0]['id']
    return None

def get_all_albums(spotify_client, artist_id):
    """
    Get all albums by artist ID
    """
    albums = []
    results = spotify_client.artist_albums(artist_id=artist_id, album_type="album", limit=50)
    albums.extend(results['items'])

    # Handle pagination
    while results['next']:
        results = spotify_client.next(results)
        albums.extend(results['items'])

    # Remove duplicate album names
    seen = set()
    unique_albums = []
    for album in albums:
        if album['name'] not in seen:
            seen.add(album['name'])
            unique_albums.append(album)
    return unique_albums

def get_all_tracks(spotify_client, albums):
    """
    Get all tracks from a list of albums
    """
    all_tracks = []
    for album in albums:
        tracks = spotify_client.album_tracks(album['id'])['items']
        for track in tracks:
            all_tracks.append({
                'name': track['name'],
                'album': album['name'],
                'id': track['id']
            })
    return all_tracks

def get_genres(spotify_client):
    """
    Get all available genre seeds from Spotify
    """
    try:
        genres = spotify_client.recommendation_genre_seeds()
        return genres["genres"]
    except Exception as e:
        print(f"Error fetching genres: {str(e)}")
        return None
