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
    if service_account_path:
        # Try relative to backend directory first
        backend_dir = Path(__file__).parent.parent.parent
        full_path = backend_dir / service_account_path
        
        # If relative path doesn't work, try absolute path
        if not full_path.exists():
            full_path = Path(service_account_path)
        
        if full_path.exists():
            cred = credentials.Certificate(str(full_path))
            initialize_app(cred)
        else:
            print(f"Warning: Firebase service account file not found at {service_account_path}")
            print(f"Tried: {backend_dir / service_account_path} and {service_account_path}")
    else:
        print("Warning: FIREBASE_SERVICE_ACCOUNT_PATH environment variable not set")

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
