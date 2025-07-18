'use client';

import { useTokenRefresh } from '@/lib/firebase/use-token-refresh';

/**
 * This component sets up token refresh functionality.
 * Include it in your app layout or other top-level component.
 */
export function AuthTokenRefresher() {
  // Use the token refresh hook
  useTokenRefresh();
  
  // This component doesn't render anything
  return null;
}
