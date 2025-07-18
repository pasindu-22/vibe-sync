"""
Health Check Service for Music Classification
Provides endpoints to check if the classification service is working properly.
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import os
import logging
from datetime import datetime
from ..config.music_config import MusicClassificationConfig

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/health",
    tags=["Health Check"]
)

@router.get("/classification")
async def check_classification_health() -> Dict[str, Any]:
    """
    Check if the music classification service is healthy.
    
    Returns:
        Health status and configuration information
    """
    try:
        config = MusicClassificationConfig()
        issues = config.validate_config()
        
        # Check if all required files exist
        model_exists = os.path.exists(config.model_path)
        encoder_exists = os.path.exists(config.label_encoder_path)
        
        # Get file sizes if they exist
        model_size = None
        encoder_size = None
        
        if model_exists:
            model_size = os.path.getsize(config.model_path) / (1024 * 1024)  # MB
        
        if encoder_exists:
            encoder_size = os.path.getsize(config.label_encoder_path) / (1024 * 1024)  # MB
        
        health_status = {
            "status": "healthy" if not issues else "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "music_classification",
            "model_info": {
                "model_exists": model_exists,
                "model_size_mb": round(model_size, 2) if model_size else None,
                "encoder_exists": encoder_exists,
                "encoder_size_mb": round(encoder_size, 2) if encoder_size else None,
                "model_path": config.model_path,
                "encoder_path": config.label_encoder_path
            },
            "configuration": {
                "supported_formats": config.supported_formats,
                "default_segment_duration": config.default_segment_duration,
                "max_segment_duration": config.max_segment_duration,
                "max_file_size_mb": config.max_file_size / (1024 * 1024)
            },
            "issues": issues
        }
        
        if issues:
            health_status["recommendations"] = [
                "Run the Jupyter notebook to generate model files",
                "Execute python app/setup_models.py to move files to correct location",
                "Ensure all required packages are installed"
            ]
        
        return health_status
        
    except Exception as e:
        logger.error(f"Error checking classification health: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to check classification service health: {str(e)}"
        )

@router.get("/")
async def general_health_check() -> Dict[str, Any]:
    """
    General health check for the entire API.
    
    Returns:
        Overall system health status
    """
    try:
        # Check classification service
        classification_health = await check_classification_health()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "api": "healthy",
                "classification": classification_health["status"]
            },
            "version": "1.0.0"
        }
        
    except Exception as e:
        logger.error(f"Error in general health check: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": "An internal error has occurred.",
            "version": "1.0.0"
        }
