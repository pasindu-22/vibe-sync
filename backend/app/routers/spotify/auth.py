from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from ...services.spotify_service import get_spotify_oauth

router = APIRouter(
    prefix="/auth/spotify",
    tags=["spotify-auth"],
    responses={404: {"description": "Not found"}},
)

@router.get("/login")
def login():
    """
    Start Spotify OAuth flow by redirecting to Spotify's login page
    """
    sp_oauth = get_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    print(f"Redirecting to Spotify for authentication: {auth_url}")
    return RedirectResponse(auth_url)

@router.get("/callback")
def callback(request: Request, code: str = None):
    """
    Handle callback from Spotify OAuth flow
    """
    if not code:
        return {"error": "Missing code from Spotify callback"}

    sp_oauth = get_spotify_oauth()
    token_info = sp_oauth.get_access_token(code)
    request.session["token_info"] = token_info
    
    return {"message": "Login successful!", "access_token": token_info['access_token']}
