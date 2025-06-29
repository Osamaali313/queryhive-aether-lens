import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Brain, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from '@/lib/validation';
import { toast } from 'sonner';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, profile, loading, error, clearError } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  // Redirect to app or onboarding based on user status
  useEffect(() => {
    if (!loading && user) {
      if (profile?.onboarding_complete) {
        navigate('/app');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, profile, loading, navigate]);

  // Clear any auth errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }

        toast.error(errorMessage);
      } else {
        toast.success('Welcome back! You have been successfully logged in.');
        // Navigation is handled by AuthContext
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const { error } = await signUp(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );
      
      if (error) {
        let errorMessage = 'Account creation failed. Please try again.';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }

        toast.error(errorMessage);
      } else {
        toast.success('Account created! You have been successfully registered.');
        signupForm.reset();
        // Navigation is handled by AuthContext
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  // Show loading spinner while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <LoadingSpinner size="lg" message="Preparing authentication..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to Landing Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToLanding}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Landing
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30">
              <Brain className="w-8 h-8 text-neon-blue" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            QueryHive AI
          </h1>
          <p className="text-muted-foreground mt-2">Access your intelligent analytics platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
            <Button 
              variant="link" 
              className="text-red-400 underline ml-2 p-0 h-auto" 
              onClick={() => clearError()}
            >
              Dismiss
            </Button>
          </div>
        )}

        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 glass-effect">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...loginForm.register('email')}
                        disabled={isLoading}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-400">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        {...loginForm.register('password')}
                        disabled={isLoading}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-400">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full cyber-button" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" message="Signing in..." />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="First name"
                          className="pl-10"
                          {...signupForm.register('firstName')}
                          disabled={isLoading}
                        />
                      </div>
                      {signupForm.formState.errors.firstName && (
                        <p className="text-sm text-red-400">{signupForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Last Name</Label>
                      <Input
                        id="signup-lastname"
                        type="text"
                        placeholder="Last name"
                        {...signupForm.register('lastName')}
                        disabled={isLoading}
                      />
                      {signupForm.formState.errors.lastName && (
                        <p className="text-sm text-red-400">{signupForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...signupForm.register('email')}
                        disabled={isLoading}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-red-400">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        {...signupForm.register('password')}
                        disabled={isLoading}
                      />
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-red-400">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full cyber-button" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" message="Creating account..." />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default Auth;