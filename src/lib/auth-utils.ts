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
    
    // Redirect to auth page if we're not already there
    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth';
    }
  }
};

/**
 * Initialize authentication with error handling and timeout
 */
export const initializeAuth = async () => {
  try {
    // Create a promise that rejects after timeout (increased to 30 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Auth initialization timed out')), 30000);
    });
    
    // Create the actual auth promise
    const authPromise = supabase.auth.getSession();
    
    // Race the promises
    const result = await Promise.race([
      authPromise,
      timeoutPromise.then(() => {
        throw new Error('Auth initialization timed out');
      })
    ]) as any;
    
    const { data: { session }, error } = result;
    
    if (error) {
      await handleAuthError(error);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Auth initialization error:', error);
    await handleAuthError(error);
    return null;
  }
};