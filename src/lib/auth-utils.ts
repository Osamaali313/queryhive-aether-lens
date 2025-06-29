import { supabase } from '@/integrations/supabase/client';

/**
 * Clear all authentication data from storage
 */
export const clearAuthData = () => {
  try {
    // Clear Supabase auth data from localStorage
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (key.startsWith('supabase.auth') || 
          key.startsWith('sb-') || 
          key.includes('supabase') ||
          key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear Supabase auth data from sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorageKeys.forEach(key => {
      if (key.startsWith('supabase.auth') || 
          key.startsWith('sb-') || 
          key.includes('supabase') ||
          key.includes('auth')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear specific known Supabase keys
    const knownKeys = [
      'supabase.auth.token',
      'sb-ulslzvvgklvfogzejpjk-auth-token',
      'sb-project-ref-auth-token'
    ];
    
    knownKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    console.log('Successfully cleared all authentication data');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Handle authentication errors gracefully
 */
export const handleAuthError = async (error: any) => {
  console.error('Authentication error:', error);
  
  // Handle refresh token errors specifically
  if (error?.message?.includes('refresh_token_not_found') || 
      error?.message?.includes('Invalid Refresh Token') ||
      error?.message?.includes('Refresh Token Not Found') ||
      error?.message?.includes('JWT expired')) {
    
    console.warn('Invalid or expired token detected, clearing session');
    
    try {
      // Sign out to clear the session
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError);
    }
    
    // Clear all auth data
    clearAuthData();
    
    return {
      type: 'token_expired',
      message: 'Your session has expired. Please sign in again.'
    };
  }
  
  // Handle timeout errors specifically
  if (error?.message?.includes('Auth initialization timed out') || 
      error?.message?.includes('timeout')) {
    return {
      type: 'timeout',
      message: 'Connection timeout. Please check your internet connection and try again. If the problem persists, there may be a configuration issue with the authentication service.'
    };
  }

  // Handle network errors
  if (error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('fetch') ||
      error?.message?.includes('network')) {
    return {
      type: 'network',
      message: 'Network connection error. Please check your internet connection and try again.'
    };
  }

  // Generic error handling
  return {
    type: 'generic',
    message: error?.message || 'An authentication error occurred. Please try again.'
  };
};

/**
 * Initialize authentication with error handling and timeout
 */
export const initializeAuth = async () => {
  try {
    // Create the auth promise with a timeout
    const authPromise = new Promise<any>(async (resolve, reject) => {
      try {
        const result = await supabase.auth.getSession();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    // Set a timeout for the auth promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Auth initialization timed out')), 10000);
    });
    
    // Race the promises
    const result = await Promise.race([authPromise, timeoutPromise]) as any;
    
    if (result.error) {
      throw result.error;
    }
    
    return result.data.session;
  } catch (error) {
    console.error('Auth initialization error:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};