from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
import firebase_admin
import os
import json
from pathlib import Path

# Initialize Firebase Admin
try:
    # Check if already initialized
    firebase_admin.get_app()
except ValueError:
    # Initialize Firebase Admin with a service account
    firebase_cred = None
    
    service_account_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH")
    if service_account_path and os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        initialize_app(cred)

# Security scheme
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Function to validate Firebase token and return user info
    """
    token = credentials.credentials
    try:
        # Verify the token
        decoded_token = auth.verify_id_token(token)
        # Get user information
        user_id = decoded_token.get('uid')
        user = auth.get_user(user_id)
        return {
            'uid': user.uid,
            'email': user.email,
            'display_name': user.display_name
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
