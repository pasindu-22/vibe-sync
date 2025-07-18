'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  OAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { updateUserProfile as updateBackendProfile } from '@/services/user-service';
import { apiClient } from '@/lib/api-client';

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<boolean>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    await signInWithPopup(auth, provider);
  };

  // Update user profile
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    if (!auth.currentUser) {
      throw new Error('No user is signed in');
    }
    
    const updateData: { displayName?: string; photoURL?: string } = {};
    
    if (displayName) updateData.displayName = displayName;
    if (photoURL) updateData.photoURL = photoURL;
    
    await updateProfile(auth.currentUser, updateData);
    
    // Refresh user data
    setUser({ ...auth.currentUser });
    
    // Optional: Send the updated profile to your backend
    // This would require a backend endpoint to handle profile updates
    // Removed redundant API call as we're using the apiClient below
    // This prevents making duplicate calls to update the profile

    // Update profile in backend service using the API client
    try {
      await apiClient.post('/api/proxy/user', {
        displayName: displayName ?? auth.currentUser.displayName,
        photoURL: photoURL ?? auth.currentUser.photoURL
      });
    } catch (error) {
      console.error('Failed to update profile in backend service:', error);
      // If error is due to token expiration, it's already handled by the API client
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      // Force update the user state to null immediately
      setUser(null);
      // Clear any cached user data if applicable
      localStorage.removeItem('user-profile-cache');
      sessionStorage.removeItem('user-profile-cache');
      // Return successful logout
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Listen for token expiration events
    const handleTokenExpired = () => {
      console.log('Token expired, logging out user');
      logout().catch(error => console.error('Error during auto-logout:', error));
    };

    // Add event listener for token expiration
    window.addEventListener('auth:tokenExpired', handleTokenExpired);
    
    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('auth:tokenExpired', handleTokenExpired);
    };
  }, []);

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
