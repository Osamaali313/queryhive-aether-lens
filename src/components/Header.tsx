
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { User, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  user?: any;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
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

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#dashboard" className="text-sm hover:text-neon-blue transition-colors">Dashboard</a>
          <a href="#analytics" className="text-sm hover:text-neon-blue transition-colors">Analytics</a>
          <a href="#reports" className="text-sm hover:text-neon-blue transition-colors">Reports</a>
          <a href="#ai-chat" className="text-sm hover:text-neon-blue transition-colors">AI Assistant</a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <User className="w-4 h-4 mr-1" />
                {user.email}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin} className="cyber-button">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
