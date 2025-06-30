import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: { id: string; email: string } | null;
  session: null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: () => Promise<{ error: Error | null }>;
  signIn: () => Promise<{ error: Error | null }>;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user for demo purposes
  const mockUser = {
    id: 'demo-user',
    email: 'demo@example.com'
  };

  // Mock profile for demo purposes
  const mockProfile: UserProfile = {
    id: 'demo-user',
    first_name: 'Demo',
    last_name: 'User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    onboarding_complete: true,
    onboarding_step: 5
  };

  const clearError = () => setError(null);

  const signUp = async () => {
    // In demo mode, just return success
    return { error: null };
  };

  const signIn = async () => {
    // In demo mode, just return success
    return { error: null };
  };

  const signOut = async () => {
    // In demo mode, do nothing
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // In demo mode, just return success
    return { error: null };
  };

  const value = {
    user: mockUser,
    session: null,
    profile: mockProfile,
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