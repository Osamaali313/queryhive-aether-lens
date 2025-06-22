import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <Card className="glass-effect max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-red-400">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. This has been logged and our team will investigate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-950/20 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-300 font-mono break-words">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {resetError && (
              <Button 
                onClick={resetError}
                className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button 
              onClick={handleReload}
              variant="outline"
              className="flex-1 border-white/20 hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="flex-1 border-white/20 hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Error ID: {Date.now().toString(36)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;