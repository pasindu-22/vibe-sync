# Music Genre Classification API

This module provides music genre classification functionality using a trained EfficientNetB0 model. The API can classify music from uploaded audio files.

## Features

- **File Upload Classification**: Upload audio files and get genre predictions
- **Segment Analysis**: Analyze specific segments of audio files
- **Multi-segment Analysis**: Divide long tracks into segments for comprehensive analysis
- **Confidence Scoring**: Get confidence scores for each prediction
- **Multiple Format Support**: Support for MP3, WAV, M4A, FLAC, OGG, AAC

## Supported Genres

The model can classify the following 10 music genres:
- Blues
- Classical
- Country
- Disco
- Hip-hop
- Jazz
- Metal
- Pop
- Reggae
- Rock

## API Endpoints

### Authentication
All endpoints require Firebase authentication. Include the Authorization header:
```
Authorization: Bearer <firebase_token>
```

### 1. Classify Uploaded Track
```
POST /api/music/classify/upload
```

Upload an audio file for genre classification.

**Form Data:**
- `file`: Audio file (required)
- `segment_duration`: Duration of each segment in seconds (optional, default: 30)

**Response:**
```json
{
  "overall_prediction": {
    "predicted_genre": "rock",
    "confidence": 0.85,
    "genre_distribution": {
      "rock": 0.6,
      "metal": 0.3,
      "pop": 0.1
    }
  },
  "track_info": {
    "duration": 180.5,
    "num_segments_analyzed": 6,
    "segment_duration": 30
  },
  "segment_predictions": [...],
  "file_info": {
    "filename": "song.mp3",
    "file_size": 5242880,
    "user_id": "user123"
  }
}
```

### 2. Classify Audio Segment
```
POST /api/music/classify/segment
```

Classify a specific segment of an audio file.

**Form Data:**
- `file`: Audio file (required)
- `start_time`: Start time in seconds (required)
- `duration`: Duration in seconds (required)

### 3. Get Supported Formats
```
GET /api/music/classify/supported-formats
```

Get information about supported audio formats.

### 4. Get Available Genres
```
GET /api/music/classify/genres
```

Get list of genres that can be classified.

### 5. Health Check
```
GET /api/health/classification
```

Check if the classification service is working properly.

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Model Files
The trained model files should be generated from the Jupyter notebook:

1. Run the `music-genre-classification.ipynb` notebook
2. This will generate:
   - `efficientnet_music_genre_model.h5`
   - `label_encoder.pkl`

3. Move the files to the correct location:
```bash
cd backend/app
python setup_models.py
```

### 3. Verify Setup
Check if everything is working:
```bash
curl http://localhost:8000/api/health/classification
```

## Usage Examples

### Python Client Example
```python
import requests

# Upload file
with open('song.mp3', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/music/classify/upload',
        files={'file': f},
        data={'segment_duration': 30},
        headers={'Authorization': 'Bearer <your_token>'}
    )
    result = response.json()
    print(f"Predicted genre: {result['overall_prediction']['predicted_genre']}")
```

### JavaScript/Frontend Example
```javascript
// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('segment_duration', '30');

const response = await fetch('/api/music/classify/upload', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log('Predicted genre:', result.overall_prediction.predicted_genre);
```

## How It Works

### 1. Audio Processing
- Audio files are converted to mel spectrograms
- Spectrograms are resized to 224x224 images
- Images are preprocessed for the EfficientNetB0 model

### 2. Segment Analysis
- Long tracks are divided into 30-second segments (configurable)
- Each segment is classified independently
- Final prediction uses majority voting across all segments

### 3. Model Architecture
- Base: EfficientNetB0 (pretrained on ImageNet)
- Custom classifier on top for genre prediction
- Trained on GTZAN dataset

## File Structure

```
backend/app/
├── services/
│   └── music_classifier.py      # Main classification logic
├── routers/
│   ├── music_classification.py  # API endpoints
│   └── health.py               # Health checks
├── config/
│   └── music_config.py         # Configuration settings
├── cnn-models/                 # Model files (generated)
│   ├── efficientnet_music_genre_model.h5
│   └── label_encoder.pkl
├── notebook/
│   └── music-genre-classification.ipynb
└── setup_models.py            # Setup utility
```

## Performance Notes

- **File Upload**: Faster processing, files stored temporarily
- **Segment Duration**: Shorter segments = faster processing, longer segments = potentially more accurate
- **File Size**: Larger files take longer to process

## Error Handling

The API provides detailed error messages for:
- Unsupported file formats
- Authentication issues
- Model loading problems
- File processing errors

## Limitations

1. **Genres**: Limited to 10 genres from GTZAN dataset
2. **Languages**: Trained primarily on English music
3. **Audio Quality**: Works best with clear audio (not heavily distorted)
4. **File Size**: Maximum 100MB file upload
5. **Processing Time**: Large files or multiple segments take longer to process

## Future Improvements

- Support for more genres
- Real-time classification for streaming audio
- Batch processing for multiple files
- Integration with music databases for metadata enrichment
- Custom model training endpoints
