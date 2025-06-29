import { supabase } from '@/integrations/supabase/client';

/**
 * Clear all authentication data from storage
 */
export const clearAuthData = () => {
  // Clear Supabase auth data
  localStorage.removeItem('supabase.auth.token');
  sessionStorage.removeItem('supabase.auth.token');
  
  // Clear any other auth-related data
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('supabase.auth') || key.startsWith('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    if (key.startsWith('supabase.auth') || key.startsWith('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Handle authentication errors gracefully
 */
export const handleAuthError = async (error: any) => {
  console.error('Authentication error:', error);
  
  // Handle timeout errors specifically
  if (error?.message?.includes('Auth initialization timed out')) {
    return {
      type: 'timeout',
      message: 'Connection timeout. Please check your internet connection and try again. If the problem persists, there may be a configuration issue with the authentication service.'
    };
  }
  
  if (error?.message?.includes('refresh_token_not_found') || 
      error?.message?.includes('Invalid Refresh Token') ||
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

  // Handle network errors
  if (error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('fetch')) {
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
    // Reduce timeout to 10 seconds for faster feedback
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Auth initialization timed out')), 10000);
    });
    
    // Create the actual auth promise
    const authPromise = supabase.auth.getSession();
    
    // Race the promises
    const result = await Promise.race([
      authPromise,
      timeoutPromise
    ]) as any;
    
    const { data: { session }, error } = result;
    
    if (error) {
      throw error;
    }
    
    return session;
  } catch (error) {
    console.error('Auth initialization error:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};