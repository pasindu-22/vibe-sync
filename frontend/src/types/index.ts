export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  genre: string;
  mood: string;
  isPlaying: boolean;
  // Add other properties as needed
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  cover: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    autoplay: boolean;
    volume: number;
  };
}

export interface AnalysisResults {
  genre: { label: string; confidence: number }
  mood: { label: string; confidence: number }
  tempo: number
  energy: number
  valence: number
}

export interface ClassificationResult {
  overall_prediction: {
    predicted_genre: string;
    confidence: number;
    genre_distribution: Record<string, number>;
  };
  track_info: {
    duration: number;
    num_segments_analyzed: number;
    segment_duration: number;
  };
  segment_predictions: Array<{
    predicted_genre: string;
    confidence: number;
    start_time: number;
    duration: number;
    genre_probabilities: Record<string, number>;
  }>;
  genre_votes: Record<string, number>;
  file_info: {
    filename: string;
    file_size: number;
    user_id: string;
  };
}

export interface SupportedFormatsResponse {
  supported_formats: string[];
  max_file_size: string;
  max_segment_duration: number;
  default_segment_duration: number;
  note: string;
}

export interface AvailableGenresResponse {
  genres: string[];
  total_genres: number;
  model_type: string;
  note: string;
}

export interface UseAudioRecorderOptions {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onRecordingError?: (error: Error) => void;
  mimeType?: string;
}

export interface AudioRecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
  audioLevel: number;
  error: string | null;
}

export interface AudioRecorderActions {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearError: () => void;
}
