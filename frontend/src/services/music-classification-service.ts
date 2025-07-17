import axios from 'axios';
import { auth } from '@/lib/firebase/firebase';
import { ClassificationResult, SupportedFormatsResponse, AvailableGenresResponse } from '@/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

class MusicClassificationService {
    private async getAuthHeaders() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const token = await user.getIdToken();
        return {
            'Authorization': `Bearer ${token}`,
        };
    }

    // Classify an uploaded audio file
    async classifyUploadedFile(
        file: File,
        segmentDuration: number = 30
    ): Promise<ClassificationResult> {
        try {
            const headers = await this.getAuthHeaders();

            const formData = new FormData();
            formData.append('file', file);
            formData.append('segment_duration', segmentDuration.toString());

            const response = await axios.post(
                `${API_BASE_URL}/api/music/classify/upload`,
                formData,
                {
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 120000, // 2 minutes timeout for large files
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Failed to classify audio file');
            }
            throw error;
        }
    }

    // Classify an audio segment
    async classifyAudioSegment(
        file: File,
        startTime: number = 0,
        duration: number = 30
    ): Promise<ClassificationResult> {
        try {
            const headers = await this.getAuthHeaders();

            const formData = new FormData();
            formData.append('file', file);
            formData.append('start_time', startTime.toString());
            formData.append('duration', duration.toString());

            const response = await axios.post(
                `${API_BASE_URL}/api/music/classify/segment`,
                formData,
                {
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 60000, // 1 minute timeout
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Failed to classify audio segment');
            }
            throw error;
        }
    }

    // Get supported audio formats
    async getSupportedFormats(): Promise<SupportedFormatsResponse> {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/music/classify/supported-formats`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error('Failed to get supported formats');
            }
            throw error;
        }
    }

    // Get available genres
    async getAvailableGenres(): Promise<AvailableGenresResponse> {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/music/classify/genres`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error('Failed to get available genres');
            }
            throw error;
        }
    }

    // Convert recorded audio blob to file
    createAudioFile(audioBlob: Blob, filename: string = 'recorded-audio.wav'): File {
        return new File([audioBlob], filename, { type: audioBlob.type });
    }
}

export const musicClassificationService = new MusicClassificationService();
