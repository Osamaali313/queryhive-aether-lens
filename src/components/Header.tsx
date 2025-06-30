import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useA11y } from './a11y/A11yProvider';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { announce } = useA11y();

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
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              aria-label="Demo User"
            >
              <span className="max-w-[150px] truncate">Demo User</span>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;