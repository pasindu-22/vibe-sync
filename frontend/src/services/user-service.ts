import { auth } from "@/lib/firebase/firebase";
import { apiClient, AuthError } from "@/lib/api-client";

export interface UserProfile {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    return await apiClient.get<UserProfile>('/api/proxy/user');
  } catch (error) {
    if (error instanceof AuthError) {
      // Token expiration is already handled by the API client
      return null;
    }
    console.error('Error in fetchUserProfile:', error);
    throw error;
  }
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    return await apiClient.post<UserProfile>('/api/proxy/user', profileData);
  } catch (error) {
    if (error instanceof AuthError) {
      // Token expiration is already handled by the API client
      throw new Error('Authentication failed. Please log in again.');
    }
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}
