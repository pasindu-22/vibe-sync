"""
Music Genre Classification Service
Handles music genre prediction using the trained EfficientNetB0 model.
"""
import os
import pickle
import numpy as np
import cv2
import librosa
import matplotlib.pyplot as plt
from pydub import AudioSegment
from pydub.utils import which
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.applications import EfficientNetB0
from typing import List, Dict, Optional, Tuple
import tempfile
import logging
from pathlib import Path
import subprocess
import shutil

logger = logging.getLogger(__name__)

class MusicGenreClassifier:
    def __init__(self, model_path: str, label_encoder_path: str):
        """
        Initialize the music genre classifier.
        
        Args:
            model_path: Path to the trained .h5 model
            label_encoder_path: Path to the label encoder pickle file
        """
        self.model_path = model_path
        self.label_encoder_path = label_encoder_path
        self.model = None
        self.label_encoder = None
        self.genres = None
        self.feature_extractor = None  # EfficientNetB0 feature extractor
        
        # Check for FFmpeg dependency
        self._check_ffmpeg()
        
        # Load model and encoder
        self._load_model_and_encoder()
    
    def _check_ffmpeg(self):
        """Check if FFmpeg is available on the system."""
        try:
            # Check for ffmpeg and ffprobe
            ffmpeg_path = which("ffmpeg") or shutil.which("ffmpeg")
            ffprobe_path = which("ffprobe") or shutil.which("ffprobe")
            
            if not ffmpeg_path or not ffprobe_path:
                logger.warning("FFmpeg not found in PATH. Attempting to set AudioSegment converter paths.")
                
                # Try common Windows FFmpeg locations
                possible_paths = [
                    r"C:\ffmpeg\bin\ffmpeg.exe",
                    r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
                    r"C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe",
                    os.path.join(os.getcwd(), "ffmpeg", "bin", "ffmpeg.exe"),
                ]
                
                for path in possible_paths:
                    if os.path.exists(path):
                        ffmpeg_dir = os.path.dirname(path)
                        AudioSegment.converter = os.path.join(ffmpeg_dir, "ffmpeg.exe")
                        AudioSegment.ffmpeg = os.path.join(ffmpeg_dir, "ffmpeg.exe") 
                        AudioSegment.ffprobe = os.path.join(ffmpeg_dir, "ffprobe.exe")
                        logger.info(f"Found FFmpeg at: {ffmpeg_dir}")
                        return
                
                # If FFmpeg not found, warn but don't fail - try to continue
                logger.warning(
                    "FFmpeg not found. Some audio formats may not be supported. "
                    "Please install FFmpeg and add it to your PATH for full format support. "
                    "Download from: https://ffmpeg.org/download.html"
                )
            else:
                logger.info("FFmpeg found in system PATH")
                
        except Exception as e:
            logger.warning(f"FFmpeg check failed: {str(e)}")
    
    def _load_model_and_encoder(self):
        """Load the trained model and label encoder."""
        try:
            # Load the trained model (classifier only)
            self.model = load_model(self.model_path)
            logger.info(f"Model loaded successfully from {self.model_path}")
            
            # Load EfficientNetB0 feature extractor (frozen)
            self.feature_extractor = EfficientNetB0(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
            self.feature_extractor.trainable = False
            logger.info("EfficientNetB0 feature extractor loaded successfully")
            
            # Load label encoder
            with open(self.label_encoder_path, 'rb') as f:
                self.label_encoder = pickle.load(f)
            
            self.genres = self.label_encoder.classes_.tolist()
            logger.info(f"Label encoder loaded. Genres: {self.genres}")
            
        except Exception as e:
            logger.error(f"Error loading model or encoder: {str(e)}")
            raise
    
    def _convert_audio_with_ffmpeg(self, input_path: str, output_path: str) -> bool:
        """
        Convert audio using FFmpeg directly.
        
        Args:
            input_path: Path to input audio file
            output_path: Path to output WAV file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Check if FFmpeg is available
            ffmpeg_path = which("ffmpeg") or shutil.which("ffmpeg")
            if not ffmpeg_path:
                # Try Windows-specific paths
                possible_paths = [
                    r"C:\ffmpeg\bin\ffmpeg.exe",
                    r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
                    r"C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe",
                ]
                for path in possible_paths:
                    if os.path.exists(path):
                        ffmpeg_path = path
                        break
                else:
                    logger.warning("FFmpeg not found, cannot convert audio directly")
                    return False
            
            # Use FFmpeg to convert to WAV
            cmd = [
                ffmpeg_path,
                '-i', input_path,
                '-acodec', 'pcm_s16le',
                '-ar', '22050',
                '-ac', '1',  # mono
                '-y',  # overwrite output file
                output_path
            ]
            
            logger.info(f"Running FFmpeg command: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                logger.info("FFmpeg conversion successful")
                return True
            else:
                logger.error(f"FFmpeg conversion failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            logger.error("FFmpeg conversion timed out")
            return False
        except Exception as e:
            logger.error(f"FFmpeg conversion error: {str(e)}")
            return False
    
    def _try_moviepy_conversion(self, input_path: str, output_path: str) -> bool:
        """
        Try to convert audio using moviepy.
        
        Args:
            input_path: Path to input file
            output_path: Path to output WAV file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            import moviepy.editor as mp
            logger.info("Using moviepy for audio conversion...")
            
            # Determine if it's a video or audio file
            file_ext = os.path.splitext(input_path)[1].lower()
            
            if file_ext in ['.mp4', '.webm', '.avi', '.mkv', '.mov']:
                # Video file
                video = mp.VideoFileClip(input_path)
                audio = video.audio
                
                if audio is None:
                    video.close()
                    logger.error("No audio stream found in video file")
                    return False
                
                # Write audio to WAV
                audio.write_audiofile(output_path, verbose=False, logger=None)
                audio.close()
                video.close()
                
            else:
                # Audio file
                audio = mp.AudioFileClip(input_path)
                audio.write_audiofile(output_path, verbose=False, logger=None)
                audio.close()
            
            logger.info("moviepy conversion successful")
            return True
            
        except ImportError:
            logger.warning("moviepy not available")
            return False
        except Exception as e:
            logger.error(f"moviepy conversion failed: {str(e)}")
            return False
    
    def _try_pydub_conversion(self, input_path: str, output_path: str) -> bool:
        """
        Try to convert audio using pydub.
        
        Args:
            input_path: Path to input file
            output_path: Path to output WAV file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            from pydub import AudioSegment
            logger.info("Using pydub for audio conversion...")
            
            # Try to load the audio file
            audio_segment = AudioSegment.from_file(input_path)
            
            # Export to WAV
            audio_segment.export(output_path, format='wav')
            
            logger.info("pydub conversion successful")
            return True
            
        except Exception as e:
            logger.error(f"pydub conversion failed: {str(e)}")
            return False
    
    def _convert_to_wav(self, input_path: str) -> str:
        """
        Convert audio file to WAV format using multiple methods.
        
        Args:
            input_path: Path to input audio file
            
        Returns:
            Path to converted WAV file
        """
        # Create temporary WAV file
        temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        output_path = temp_wav.name
        temp_wav.close()
        
        # Try multiple conversion methods
        conversion_methods = [
            ("FFmpeg", self._convert_audio_with_ffmpeg),
            ("moviepy", self._try_moviepy_conversion),
            ("pydub", self._try_pydub_conversion),
        ]
        
        for method_name, method_func in conversion_methods:
            logger.info(f"Attempting conversion with {method_name}...")
            try:
                if method_func(input_path, output_path):
                    # Verify the output file exists and is valid
                    if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                        logger.info(f"Successfully converted audio using {method_name}")
                        return output_path
                    else:
                        logger.warning(f"{method_name} produced empty or invalid output")
            except Exception as e:
                logger.error(f"{method_name} conversion failed with exception: {str(e)}")
        
        # If all methods failed, clean up and raise exception
        try:
            os.unlink(output_path)
        except:
            pass
        
        raise Exception("All audio conversion methods failed")
    
    def audio_to_melspectrogram(self, audio_path: str, duration: int = 30) -> np.ndarray:
        """
        Convert audio file to mel spectrogram and extract features.
        
        Args:
            audio_path: Path to audio file
            duration: Duration in seconds to analyze
            
        Returns:
            Extracted features from EfficientNetB0 as numpy array
        """
        try:
            # Load audio file
            y, sr = librosa.load(audio_path, duration=duration, sr=22050)
            
            # Generate mel spectrogram
            mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
            mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
            
            # Create image from spectrogram
            fig = plt.figure(figsize=(10, 4))
            plt.imshow(mel_spec_db, aspect='auto', origin='lower', cmap='viridis')
            plt.axis('off')
            plt.tight_layout()
            
            # Save to temporary file and read as image
            tmp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
            tmp_file_path = tmp_file.name
            tmp_file.close()  # Close the file handle immediately
            
            try:
                plt.savefig(tmp_file_path, bbox_inches='tight', pad_inches=0, dpi=100)
                plt.close(fig)  # Explicitly close the figure
                
                # Load image and resize
                img = cv2.imread(tmp_file_path)
                if img is None:
                    raise Exception("Failed to load generated spectrogram image")
                img = cv2.resize(img, (224, 224))
                
                # Preprocess for EfficientNetB0
                img_array = np.array([img.astype('float32')])
                img_array = preprocess_input(img_array)
                
                # Extract features using EfficientNetB0
                features = self.feature_extractor.predict(img_array, verbose=0)
                
                return features
                
            finally:
                # Clean up - now safe to delete on Windows
                try:
                    os.unlink(tmp_file_path)
                except OSError:
                    pass  # Ignore if file doesn't exist or can't be deleted
                
        except Exception as e:
            logger.error(f"Error creating mel spectrogram: {str(e)}")
            raise
    
    def predict_genre_from_audio_segment(self, audio_path: str, start_time: int = 0, duration: int = 30) -> Dict:
        """
        Predict genre from a specific audio segment.
        
        Args:
            audio_path: Path to audio file
            start_time: Start time in seconds
            duration: Duration in seconds
            
        Returns:
            Dictionary with prediction results
        """
        try:
            # Use librosa to load audio segment directly (more reliable than pydub)
            try:
                y, sr = librosa.load(audio_path, sr=22050, offset=start_time, duration=duration)
                if len(y) == 0:
                    raise Exception("Could not load audio segment - segment appears to be empty")
            except Exception as e:
                logger.error(f"Failed to load audio segment from {audio_path}: {str(e)}")
                raise Exception(f"Cannot read audio segment. The file might be corrupted or in an unsupported format: {str(e)}")
            
            # Create mel spectrogram directly from the audio data
            mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
            mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
            
            # Create image from spectrogram
            fig = plt.figure(figsize=(10, 4))
            plt.imshow(mel_spec_db, aspect='auto', origin='lower', cmap='viridis')
            plt.axis('off')
            plt.tight_layout()
            
            # Save to temporary file and read as image
            tmp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
            tmp_file_path = tmp_file.name
            tmp_file.close()  # Close the file handle immediately
            
            try:
                plt.savefig(tmp_file_path, bbox_inches='tight', pad_inches=0, dpi=100)
                plt.close(fig)  # Explicitly close the figure
                
                # Load image and resize
                img = cv2.imread(tmp_file_path)
                if img is None:
                    raise Exception("Failed to load generated spectrogram image")
                img = cv2.resize(img, (224, 224))
                
                # Preprocess for EfficientNetB0
                img_array = np.array([img.astype('float32')])
                img_array = preprocess_input(img_array)
                
                # Extract features using EfficientNetB0
                features = self.feature_extractor.predict(img_array, verbose=0)
                
                # Predict using the trained classifier
                predictions = self.model.predict(features, verbose=0)
                predicted_class = np.argmax(predictions[0])
                confidence = float(predictions[0][predicted_class])
                predicted_genre = self.genres[predicted_class]
                
                # Get all probabilities
                genre_probabilities = {
                    genre: float(prob) for genre, prob in zip(self.genres, predictions[0])
                }
                
                return {
                    'predicted_genre': predicted_genre,
                    'confidence': confidence,
                    'start_time': start_time,
                    'duration': duration,
                    'genre_probabilities': genre_probabilities
                }
                
            finally:
                # Clean up - now safe to delete on Windows
                try:
                    os.unlink(tmp_file_path)
                except OSError:
                    pass  # Ignore if file doesn't exist or can't be deleted
                
        except Exception as e:
            logger.error(f"Error predicting genre from segment: {str(e)}")
            raise
    
    def classify_full_track(self, audio_path: str, segment_duration: int = 30) -> Dict:
        """
        Classify genre of full track by analyzing multiple segments.
        
        Args:
            audio_path: Path to audio file
            segment_duration: Duration of each segment in seconds
            
        Returns:
            Dictionary with overall prediction and segment details
        """
        try:
            # Verify file exists
            if not os.path.exists(audio_path):
                raise Exception(f"Audio file not found: {audio_path}")
            
            temp_wav_cleanup = None  # Track if we need to cleanup a temp WAV file
            
            # Get audio duration using librosa with better error handling
            try:
                # Try loading with librosa first
                y, sr = librosa.load(audio_path, sr=None)
                if len(y) == 0:
                    raise Exception("Audio file appears to be empty or corrupted")
                total_duration = len(y) / sr  # Convert to seconds
                logger.info(f"Successfully loaded audio with librosa: {total_duration:.2f} seconds")
            except Exception as librosa_error:
                logger.warning(f"Librosa failed to load {audio_path}: {str(librosa_error)}")
                
                # If librosa fails, try converting to WAV first
                try:
                    logger.info("Converting audio to WAV format...")
                    temp_wav_path = self._convert_to_wav(audio_path)
                    temp_wav_cleanup = temp_wav_path
                    audio_path = temp_wav_path
                    
                    # Now try librosa again
                    y, sr = librosa.load(audio_path, sr=None)
                    total_duration = len(y) / sr
                    logger.info(f"Successfully loaded converted audio: {total_duration:.2f} seconds")
                    
                except Exception as conversion_error:
                    logger.error(f"Audio conversion failed: {str(conversion_error)}")
                    raise Exception(f"Cannot read audio file. Librosa error: {str(librosa_error)}, conversion error: {str(conversion_error)}")
            
            logger.info(f"Analyzing track with duration: {total_duration:.2f} seconds")
            
            # Calculate number of segments
            num_segments = max(1, int(total_duration // segment_duration))
            
            # If track is shorter than segment_duration, use the whole track
            if total_duration < segment_duration:
                segment_duration = int(total_duration)
                num_segments = 1
            
            segment_predictions = []
            genre_votes = {genre: 0 for genre in self.genres}
            total_confidence = 0
            
            # Analyze each segment
            for i in range(num_segments):
                start_time = i * segment_duration
                
                # Ensure we don't go beyond track duration
                if start_time + segment_duration > total_duration:
                    start_time = max(0, total_duration - segment_duration)
                
                segment_result = self.predict_genre_from_audio_segment(
                    audio_path, start_time, segment_duration
                )
                
                segment_predictions.append(segment_result)
                genre_votes[segment_result['predicted_genre']] += 1
                total_confidence += segment_result['confidence']
            
            # Determine overall genre by majority vote
            predicted_genre = max(genre_votes, key=genre_votes.get)
            average_confidence = total_confidence / num_segments
            
            # Calculate genre distribution
            genre_distribution = {
                genre: votes / num_segments for genre, votes in genre_votes.items()
            }
            
            return {
                'overall_prediction': {
                    'predicted_genre': predicted_genre,
                    'confidence': average_confidence,
                    'genre_distribution': genre_distribution
                },
                'track_info': {
                    'duration': total_duration,
                    'num_segments_analyzed': num_segments,
                    'segment_duration': segment_duration
                },
                'segment_predictions': segment_predictions,
                'genre_votes': genre_votes
            }
            
        except Exception as e:
            logger.error(f"Error classifying full track: {str(e)}")
            raise
        finally:
            # Cleanup temporary WAV file if we created one
            if temp_wav_cleanup and os.path.exists(temp_wav_cleanup):
                try:
                    os.unlink(temp_wav_cleanup)
                    logger.info("Cleaned up temporary WAV file")
                except:
                    pass
    
    def classify_from_url(self, url: str) -> Dict:
        """
        Download and classify audio from URL (YouTube, etc.).
        
        Args:
            url: URL to audio/video
            
        Returns:
            Classification results
        """
        import yt_dlp
        
        try:
            # Create temporary directory for download
            with tempfile.TemporaryDirectory() as temp_dir:
                output_path = os.path.join(temp_dir, 'audio.%(ext)s')
                
                # yt-dlp options - prioritize audio-only formats that don't need post-processing
                ydl_opts = {
                    'format': 'bestaudio[ext=webm]/bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio[acodec=opus]/bestaudio[acodec=vorbis]/bestaudio/best[height<=480]',
                    'outtmpl': output_path,
                    # Add user agent and other headers to avoid 403 errors
                    'http_headers': {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    # Additional options to avoid blocks
                    'extractor_retries': 3,
                    'fragment_retries': 3,
                    'skip_unavailable_fragments': True,
                    'noplaylist': True,
                    # Prefer audio-only formats
                    'prefer_free_formats': True,
                }
                
                # Download the video/audio
                try:
                    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                        info = ydl.extract_info(url, download=True)
                        
                        if info is None:
                            raise Exception("Failed to extract video information")
                        
                        # Find the downloaded file
                        downloaded_files = [f for f in os.listdir(temp_dir) if f.startswith('audio.')]
                        if not downloaded_files:
                            raise Exception("No audio file was downloaded")
                        
                        audio_file = os.path.join(temp_dir, downloaded_files[0])
                        
                        # Verify the file exists and is readable
                        if not os.path.exists(audio_file):
                            raise Exception(f"Downloaded audio file not found: {audio_file}")
                        
                        # Check file size
                        file_size = os.path.getsize(audio_file)
                        if file_size == 0:
                            raise Exception("Downloaded file is empty")
                        
                        file_ext = os.path.splitext(downloaded_files[0])[1].lower()
                        logger.info(f"Successfully downloaded: {downloaded_files[0]} ({file_size} bytes, format: {file_ext})")
                        
                        # Copy the file outside the temp directory to avoid access issues
                        persistent_audio = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
                        persistent_audio_path = persistent_audio.name
                        persistent_audio.close()
                        
                        try:
                            shutil.copy2(audio_file, persistent_audio_path)
                            logger.info(f"Copied audio file to persistent location: {persistent_audio_path}")
                            
                            # Get track info
                            track_info = {
                                'title': info.get('title', 'Unknown'),
                                'uploader': info.get('uploader', 'Unknown'),
                                'duration': info.get('duration', 0),
                                'url': url
                            }
                            
                            # Classify the downloaded audio
                            result = self.classify_full_track(persistent_audio_path)
                            result['source_info'] = track_info
                            
                            return result
                            
                        finally:
                            # Clean up the persistent copy
                            try:
                                os.unlink(persistent_audio_path)
                                logger.info("Cleaned up persistent audio file")
                            except:
                                pass
                        
                except Exception as e:
                    logger.error(f"Download failed: {str(e)}")
                    raise Exception(f"Unable to download audio from URL. This might be due to: 1) Video restrictions, 2) Regional blocks, 3) Private/unavailable video, 4) Network issues. Error: {str(e)}")
                    
        except Exception as e:
            logger.error(f"Error classifying from URL: {str(e)}")
            raise
    
    def get_supported_formats(self) -> List[str]:
        """Get list of supported audio formats."""
        return ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aac', '.mp4', '.webm']
    
    def validate_audio_file(self, file_path: str) -> bool:
        """Validate if the file is a supported audio format."""
        try:
            file_ext = Path(file_path).suffix.lower()
            return file_ext in self.get_supported_formats()
        except:
            return False