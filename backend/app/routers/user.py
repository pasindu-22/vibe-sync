from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from ..auth.firebase_auth import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

class ProfileUpdate(BaseModel):
    displayName: str = None
    photoURL: str = None

@router.get("/profile")
async def get_user_profile(user_info: dict = Depends(get_current_user)):
    """
    Get the current user's profile information.
    """
    return {
        "status": "success",
        "data": user_info
    }

@router.post("/profile")
async def update_user_profile(profile_data: ProfileUpdate, user_info: dict = Depends(get_current_user)):
    """
    Update the user's profile information in the database.
    
    In a real application, you would update this in your database.
    """
    # Here you would typically update the profile in your database
    # For now, we'll just echo back the updated profile
    
    # Example database update (pseudocode):
    # db.users.update_one(
    #     {"uid": user_info["uid"]},
    #     {"$set": profile_data.dict(exclude_unset=True)}
    # )
    
    return {
        "status": "success",
        "message": "Profile updated successfully",
        "data": {
            **user_info,
            **profile_data.dict(exclude_unset=True)
        }
    }
