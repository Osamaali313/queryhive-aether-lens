import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { handleAuthError, initializeAuth, clearAuthData } from '@/lib/auth-utils';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authTimeoutRef = useRef<number | null>(null);

  const clearError = () => setError(null);

  const clearAuthState = () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    clearAuthData();
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set a fallback timeout to prevent infinite loading
        const timeoutId = window.setTimeout(() => {
          console.warn('Auth initialization fallback timeout after 15 seconds');
          setLoading(false);
          clearAuthState();
          setError('Authentication service is taking too long to respond. Please refresh the page and try again.');
        }, 15000); // 15 second fallback timeout
        
        authTimeoutRef.current = timeoutId;
        
        const initialSession = await initializeAuth();
        setSession(initialSession);
        
        if (initialSession?.user) {
          setUser(initialSession.user);
          const userProfile = await fetchProfile(initialSession.user.id);
          setProfile(userProfile);
        } else {
          clearAuthState();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        
        // Handle the error and get user-friendly message
        const errorInfo = await handleAuthError(error);
        setError(errorInfo.message);
        
        // Clear auth state on error
        clearAuthState();
        
        // Show toast notification for better UX
        toast.error(errorInfo.message, {
          duration: 5000,
          action: {
            label: 'Retry',
            onClick: () => {
              setError(null);
              window.location.reload();
            }
          }
        });
      } finally {
        setLoading(false);
        if (authTimeoutRef.current) {
          clearTimeout(authTimeoutRef.current);
          authTimeoutRef.current = null;
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        try {
          setSession(session);
          setError(null); // Clear any previous errors
          
          if (session?.user) {
            setUser(session.user);
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
          } else {
            clearAuthState();
          }
          
          if (event === 'SIGNED_OUT') {
            clearAuthState();
          }
          
          if (event === 'TOKEN_REFRESHED' && session) {
            setSession(session);
            setUser(session.user);
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          const errorInfo = await handleAuthError(error);
          setError(errorInfo.message);
          clearAuthState();
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        const errorInfo = await handleAuthError(error);
        setError(errorInfo.message);
        return { error };
      }

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            onboarding_complete: false,
            onboarding_step: 0,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          const errorMessage = 'Failed to create user profile';
          setError(errorMessage);
          return { error: new Error(errorMessage) };
        }

        // Fetch the created profile
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      const errorInfo = await handleAuthError(error);
      setError(errorInfo.message);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        const errorInfo = await handleAuthError(error);
        setError(errorInfo.message);
        return { error };
      }

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
      }

      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      const errorInfo = await handleAuthError(error);
      setError(errorInfo.message);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        const errorInfo = await handleAuthError(error);
        setError(errorInfo.message);
      }
      clearAuthState();
    } catch (error) {
      console.error('Failed to sign out:', error);
      const errorInfo = await handleAuthError(error);
      setError(errorInfo.message);
      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      const errorMessage = 'User not authenticated';
      setError(errorMessage);
      return { error: new Error(errorMessage) };
    }

    try {
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        const errorInfo = await handleAuthError(error);
        setError(errorInfo.message);
        return { error };
      }

      // Refresh profile
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);

      return { error: null };
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorInfo = await handleAuthError(error);
      setError(errorInfo.message);
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};