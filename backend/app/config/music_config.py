"""
Music Classification Configuration
Settings and constants for music genre classification.
"""
import os
from typing import List

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), "../cnn-models")
MODEL_PATH = os.path.join(MODEL_DIR, "efficientnet_music_genre_model.h5")
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# Audio processing settings
DEFAULT_SEGMENT_DURATION = 30  # seconds
MAX_SEGMENT_DURATION = 300     # seconds (5 minutes)
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

# Supported audio formats
SUPPORTED_AUDIO_FORMATS = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aac']

# Model settings
IMAGE_SIZE = (224, 224)
SAMPLE_RATE = 22050
N_MELS = 128
FMAX = 8000

# Expected genres (should match the trained model)
EXPECTED_GENRES = [
    'blues', 'classical', 'country', 'disco', 'hiphop',
    'jazz', 'metal', 'pop', 'reggae', 'rock'
]

# Download settings for URL classification
DOWNLOAD_TIMEOUT = 300  # seconds
MAX_DOWNLOAD_SIZE = 500 * 1024 * 1024  # 500 MB

# Logging settings
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Classification thresholds
MIN_CONFIDENCE_THRESHOLD = 0.1  # Minimum confidence to consider prediction valid
HIGH_CONFIDENCE_THRESHOLD = 0.7  # Threshold for high confidence predictions

class MusicClassificationConfig:
    """Configuration class for music classification settings."""
    
    def __init__(self):
        self.model_path = MODEL_PATH
        self.label_encoder_path = LABEL_ENCODER_PATH
        self.supported_formats = SUPPORTED_AUDIO_FORMATS
        self.default_segment_duration = DEFAULT_SEGMENT_DURATION
        self.max_segment_duration = MAX_SEGMENT_DURATION
        self.max_file_size = MAX_FILE_SIZE
        
    def validate_config(self) -> List[str]:
        """
        Validate configuration and return list of issues if any.
        
        Returns:
            List of configuration issues (empty if valid)
        """
        issues = []
        
        if not os.path.exists(self.model_path):
            issues.append(f"Model file not found: {self.model_path}")
            
        if not os.path.exists(self.label_encoder_path):
            issues.append(f"Label encoder not found: {self.label_encoder_path}")
            
        return issues
    
    def get_model_info(self) -> dict:
        """Get model information."""
        return {
            "model_path": self.model_path,
            "encoder_path": self.label_encoder_path,
            "expected_genres": EXPECTED_GENRES,
            "image_size": IMAGE_SIZE,
            "sample_rate": SAMPLE_RATE
        }
