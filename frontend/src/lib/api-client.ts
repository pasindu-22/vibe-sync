'use client';

import { auth } from "@/lib/firebase/firebase";

interface ApiRequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  includeAuth?: boolean;
}

// Error class for authentication errors
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * API client with automatic token handling and expiration detection
 */
export const apiClient = {
  /**
   * Make an API request with automatic token handling
   */
  async fetch<T = any>(
    url: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      includeAuth = true,
    } = options;
    
    // Prepare request headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // Add auth token if requested and user is logged in
    if (includeAuth && auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(true);
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to get auth token:', error);
        throw new AuthError('Failed to get authentication token');
      }
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include',
    };
    
    // Add body if provided
    if (body) {
      requestOptions.body = JSON.stringify(body);
    }
    
    // Make the request
    const response = await fetch(url, requestOptions);
    
    // Handle 401 Unauthorized responses (token expired)
    if (response.status === 401) {
      // Dispatch a custom event to notify the app about token expiration
      window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
      throw new AuthError('Authentication token expired');
    }
    
    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Request failed with status: ${response.status}`);
    }
    
    // Parse and return the response
    return await response.json();
  },
  
  // Convenience methods
  async get<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(url, { ...options, method: 'GET' });
  },
  
  async post<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(url, { ...options, method: 'POST', body: data });
  },
  
  async put<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(url, { ...options, method: 'PUT', body: data });
  },
  
  async delete<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(url, { ...options, method: 'DELETE' });
  },
};
