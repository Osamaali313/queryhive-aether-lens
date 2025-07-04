import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ulslzvvgklvfogzejpjk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc2x6dnZna2x2Zm9nemVqcGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzgxMzQsImV4cCI6MjA2MTUxNDEzNH0.LLA4ulosGp_Hi3VgSRzKScH37CIabt6eUKxG0TWJj7M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'queryhive-ai'
    }
  },
  realtime: {
    timeout: 30000 // Increase timeout to 30 seconds
  }
});

// Handle auth state changes and token refresh errors
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  } else if (event === 'SIGNED_OUT') {
    // Clear any cached data when user signs out
    console.log('User signed out');
    
    // Clear local storage auth data
    try {
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
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
});

// Add error handling for token refresh failures
const originalRefreshSession = supabase.auth.refreshSession;
supabase.auth.refreshSession = async function(...args) {
  try {
    return await originalRefreshSession.apply(this, args);
  } catch (error: any) {
    if (error?.message?.includes('refresh_token_not_found') || 
        error?.message?.includes('Invalid Refresh Token')) {
      console.warn('Refresh token invalid, clearing session');
      // Clear the invalid session
      await supabase.auth.signOut();
      // Clear local storage to remove corrupted tokens
      try {
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
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    throw error;
  }
};