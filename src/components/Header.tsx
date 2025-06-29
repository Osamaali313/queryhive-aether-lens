import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useA11y } from './a11y/A11yProvider';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const { user, signOut, profile, error } = useAuth();
  const navigate = useNavigate();
  const { announce } = useA11y();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      announce('You have been signed out successfully', 'polite');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const handleHelpClick = () => {
    // Find the tour button and click it
    const tourButton = document.querySelector('[aria-label="Take Tour"]');
    if (tourButton && tourButton instanceof HTMLElement) {
      tourButton.click();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Logo size="md" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              QueryHive AI
            </h1>
            <p className="text-xs text-muted-foreground">Intelligent Data Analytics</p>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                aria-label={`User profile: ${user.email}`}
              >
                <User className="w-4 h-4 mr-1" aria-hidden="true" />
                <span className="max-w-[150px] truncate">{profile?.first_name || user.email}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleHelpClick}
                aria-label="Help and tour"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/auth')} 
              className="cyber-button"
              aria-label="Sign in"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      
      {/* Error banner */}
      {error && (
        <div className="bg-red-500/80 text-white py-2 px-4 text-center text-sm">
          {error} 
          <Button 
            variant="link" 
            className="text-white underline ml-2 p-0 h-auto" 
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;