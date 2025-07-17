'use client';

import { useEffect } from 'react';
import { auth } from '@/lib/firebase/firebase';

/**
 * Hook to automatically refresh Firebase token before it expires
 */
export function useTokenRefresh() {
  useEffect(() => {
    // Firebase tokens expire after 1 hour (3600 seconds)
    // We'll refresh the token every 45 minutes (2700 seconds)
    const REFRESH_INTERVAL = 45 * 60 * 1000; // 45 minutes in milliseconds
    
    const refreshToken = async () => {
      if (auth.currentUser) {
        try {
          // Force refresh the token
          await auth.currentUser.getIdToken(true);
          console.log('Firebase token refreshed');
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
      }
    };
    
    // Set up the interval to refresh the token
    const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
}
