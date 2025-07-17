"""
Music Classification Router
Handles endpoints for music genre classification.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any
import os
import tempfile
import aiofiles
from pathlib import Path
import logging

from ..services.music_classifier import MusicGenreClassifier
from ..auth.firebase_auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/music/classify",
    tags=["Music Classification"]
)

# Initialize classifier (will be loaded when first endpoint is called)
classifier = None

def get_classifier() -> MusicGenreClassifier:
    """Get or initialize the music classifier."""
    global classifier
    if classifier is None:
        # Paths to model files
        model_path = os.path.join(os.path.dirname(__file__), "../cnn-models/efficientnet_music_genre_model.h5")
        encoder_path = os.path.join(os.path.dirname(__file__), "../cnn-models/label_encoder.pkl")
        
        if not os.path.exists(model_path):
            raise HTTPException(
                status_code=500, 
                detail="Model file not found. Please ensure the model is properly deployed."
            )
        if not os.path.exists(encoder_path):
            raise HTTPException(
                status_code=500, 
                detail="Label encoder file not found. Please ensure the encoder is properly deployed."
            )
        
        try:
            classifier = MusicGenreClassifier(model_path, encoder_path)
            logger.info("Music classifier initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize classifier: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to initialize music classifier")
    
    return classifier

@router.post("/upload")
async def classify_uploaded_track(
    file: UploadFile = File(...),
    segment_duration: Optional[int] = 30,
    user_info: dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Classify genre of an uploaded music track.
    
    The track will be divided into segments and each segment will be classified.
    The final prediction is based on majority voting across all segments.
    
    Args:
        file: Audio file to classify
        segment_duration: Duration of each segment in seconds (default: 30)
        user_info: Current user information from Firebase auth
        
    Returns:
        Classification results including overall prediction and segment details
    """
    try:
        # Initialize classifier
        music_classifier = get_classifier()
        
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in music_classifier.get_supported_formats():
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Supported formats: {music_classifier.get_supported_formats()}"
            )
        
        # Validate segment duration
        if segment_duration <= 0 or segment_duration > 300:  # Max 5 minutes per segment
            raise HTTPException(
                status_code=400, 
                detail="Segment duration must be between 1 and 300 seconds"
            )
        
        # Save uploaded file temporarily
        content = await file.read()
        
        # Create temporary file
        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
        tmp_file_path = tmp_file.name
        tmp_file.close()  # Close the file handle so we can write to it with aiofiles
        
        try:
            # Write content to temporary file
            async with aiofiles.open(tmp_file_path, 'wb') as f:
                await f.write(content)
            
            # Classify the track
            result = music_classifier.classify_full_track(tmp_file_path, segment_duration)
            
            # Add metadata
            result['file_info'] = {
                'filename': file.filename,
                'file_size': len(content),
                'user_id': user_info.get('uid')
            }
            
            logger.info(f"Successfully classified track {file.filename} for user {user_info.get('uid')}")
            return result
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(tmp_file_path)
            except:
                pass
                    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error classifying uploaded track: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during classification")

@router.post("/url")
async def classify_from_url(
    url: str = Form(...),
    segment_duration: Optional[int] = 30,
    user_info: dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Classify genre of music from a URL (YouTube, etc.).
    
    Downloads the audio from the provided URL and classifies it.
    Supports YouTube, SoundCloud, and other platforms supported by yt-dlp.
    
    Args:
        url: URL to the music video/audio
        segment_duration: Duration of each segment in seconds (default: 30)
        user_info: Current user information from Firebase auth
        
    Returns:
        Classification results including overall prediction and source info
    """
    try:
        # Initialize classifier
        music_classifier = get_classifier()
        
        # Validate URL
        if not url or not url.startswith(('http://', 'https://')):
            raise HTTPException(status_code=400, detail="Please provide a valid URL")
        
        # Validate segment duration
        if segment_duration <= 0 or segment_duration > 300:
            raise HTTPException(
                status_code=400, 
                detail="Segment duration must be between 1 and 300 seconds"
            )
        
        # Classify from URL
        result = music_classifier.classify_from_url(url)
        
        # Add user metadata
        result['user_info'] = {
            'user_id': user_info.get('uid'),
            'classification_timestamp': None  # You can add timestamp here
        }
        
        logger.info(f"Successfully classified URL {url} for user {user_info.get('uid')}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error classifying from URL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to download or classify audio from URL: {str(e)}")

@router.get("/supported-formats")
async def get_supported_formats() -> Dict[str, Any]:
    """
    Get list of supported audio formats for upload.
    
    Returns:
        List of supported file formats and additional info
    """
    try:
        music_classifier = get_classifier()
        
        return {
            "supported_formats": music_classifier.get_supported_formats(),
            "max_file_size": "100MB",  # You can configure this
            "max_segment_duration": 300,
            "default_segment_duration": 30,
            "note": "Larger files will take longer to process. URL classification supports YouTube and other major platforms."
        }
        
    except Exception as e:
        logger.error(f"Error getting supported formats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get format information")

@router.get("/genres")
async def get_available_genres() -> Dict[str, Any]:
    """
    Get list of music genres that can be classified.
    
    Returns:
        List of available genres and model information
    """
    try:
        music_classifier = get_classifier()
        
        return {
            "genres": music_classifier.genres,
            "total_genres": len(music_classifier.genres),
            "model_type": "EfficientNetB0",
            "note": "Model trained on GTZAN dataset with mel spectrogram analysis"
        }
        
    except Exception as e:
        logger.error(f"Error getting available genres: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get genre information")

@router.post("/segment")
async def classify_audio_segment(
    file: UploadFile = File(...),
    start_time: int = Form(0),
    duration: int = Form(30),
    user_info: dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Classify a specific segment of an audio file.
    
    Args:
        file: Audio file to classify
        start_time: Start time of the segment in seconds
        duration: Duration of the segment in seconds
        user_info: Current user information from Firebase auth
        
    Returns:
        Classification results for the specified segment
    """
    try:
        # Initialize classifier
        music_classifier = get_classifier()
        
        # Validate inputs
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if start_time < 0:
            raise HTTPException(status_code=400, detail="Start time must be non-negative")
        
        if duration <= 0 or duration > 300:
            raise HTTPException(
                status_code=400, 
                detail="Duration must be between 1 and 300 seconds"
            )
        
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in music_classifier.get_supported_formats():
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Supported formats: {music_classifier.get_supported_formats()}"
            )
        
        # Save uploaded file temporarily
        content = await file.read()
        
        # Create temporary file
        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
        tmp_file_path = tmp_file.name
        tmp_file.close()  # Close the file handle so we can write to it with aiofiles
        
        try:
            # Write content to temporary file
            async with aiofiles.open(tmp_file_path, 'wb') as f:
                await f.write(content)
            
            # Classify the specific segment
            result = music_classifier.predict_genre_from_audio_segment(
                tmp_file_path, start_time, duration
            )
            
            # Add metadata
            result['file_info'] = {
                'filename': file.filename,
                'file_size': len(content),
                'user_id': user_info.get('uid')
            }
            
            logger.info(f"Successfully classified segment of {file.filename} for user {user_info.get('uid')}")
            return result
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(tmp_file_path)
            except:
                pass
                    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error classifying audio segment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during segment classification")
