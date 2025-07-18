import { useState, useRef, useCallback } from 'react';
import { AudioRecorderState, UseAudioRecorderOptions } from '@/types';

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
    const {
        onRecordingComplete,
        onRecordingError,
        mimeType = 'audio/wav'
    } = options;

    const [state, setState] = useState<AudioRecorderState>({
        isRecording: false,
        isProcessing: false,
        recordingTime: 0,
        audioLevel: 0,
        error: null
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const updateAudioLevel = useCallback(() => {
        if (!analyserRef.current || !mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1

        setState(prev => ({ ...prev, audioLevel: normalizedLevel }));

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
    }, []);

    const startTimer = useCallback(() => {
        setState(prev => ({ ...prev, recordingTime: 0 }));
        timerRef.current = setInterval(() => {
            setState(prev => ({ ...prev, recordingTime: prev.recordingTime + 1 }));
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, error: null, isProcessing: true }));

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });

            streamRef.current = stream;

            // Set up audio context for visualization
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);

            // Set up media recorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'audio/webm'
            });

            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                console.log('MediaRecorder stopped');
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mediaRecorder.mimeType
                });

                // Ensure final state update
                setState(prev => ({
                    ...prev,
                    isRecording: false,
                    isProcessing: false,
                    audioLevel: 0
                }));

                onRecordingComplete?.(audioBlob);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();

            setState(prev => ({
                ...prev,
                isRecording: true,
                isProcessing: false,
                recordingTime: 0
            }));

            startTimer();
            updateAudioLevel();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isRecording: false,
                isProcessing: false
            }));
            onRecordingError?.(error instanceof Error ? error : new Error(errorMessage));
        }
    }, [mimeType, onRecordingComplete, onRecordingError, startTimer, updateAudioLevel]);

    const stopRecording = useCallback(() => {
        console.log('stopRecording called');
        console.log('mediaRecorderRef.current:', mediaRecorderRef.current);
        console.log('mediaRecorder state:', mediaRecorderRef.current?.state);

        // Force stop the recording regardless of state
        if (mediaRecorderRef.current) {
            console.log('Stopping recording...');

            // Immediately update state to show we're stopping
            setState(prev => ({
                ...prev,
                isRecording: false,
                isProcessing: true
            }));

            // Stop the media recorder if it's recording or paused
            if (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused') {
                console.log('MediaRecorder is in recording/paused state, calling stop()');
                mediaRecorderRef.current.stop();
            } else {
                console.log('MediaRecorder is not in recording state, forcing completion');
                // Force completion if not recording
                setTimeout(() => {
                    setState(prev => ({
                        ...prev,
                        isRecording: false,
                        isProcessing: false,
                        audioLevel: 0
                    }));

                    // Create audio blob from collected chunks
                    const audioBlob = new Blob(audioChunksRef.current.length > 0 ? audioChunksRef.current : [], {
                        type: 'audio/wav'
                    });
                    onRecordingComplete?.(audioBlob);
                }, 100);
            }

            stopTimer();

            // Clean up audio visualization
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            // Clean up stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            // Clean up audio context
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        } else {
            console.log('Cannot stop recording - no mediaRecorder');
            // If no mediaRecorder, just reset state
            setState(prev => ({
                ...prev,
                isRecording: false,
                isProcessing: false,
                audioLevel: 0
            }));
        }
    }, [stopTimer, onRecordingComplete]);

    // Function to check if recording can be stopped (minimum 30 seconds)
    const canStopRecording = useCallback(() => {
        const canStop = state.recordingTime >= 30;
        return canStop;
    }, [state.recordingTime]);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Cleanup on unmount
    const cleanup = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            stopRecording();
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, [stopRecording]);

    return {
        ...state,
        startRecording,
        stopRecording,
        canStopRecording,
        clearError,
        cleanup
    };
}
