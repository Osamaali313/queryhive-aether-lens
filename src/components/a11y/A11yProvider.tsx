import React, { createContext, useContext, useState, useEffect } from 'react';
import LiveRegion from './LiveRegion';

interface A11yContextType {
  announce: (message: string, ariaLive?: 'polite' | 'assertive') => void;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  isKeyboardUser: boolean;
}

const A11yContext = createContext<A11yContextType>({
  announce: () => {},
  prefersReducedMotion: false,
  prefersHighContrast: false,
  isKeyboardUser: false,
});

export const useA11y = () => useContext(A11yContext);

interface A11yProviderProps {
  children: React.ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const [announcement, setAnnouncement] = useState('');
  const [ariaLive, setAriaLive] = useState<'polite' | 'assertive'>('polite');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mql.matches);
    
    handleChange();
    mql.addEventListener('change', handleChange);
    
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Detect high contrast preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-contrast: more)');
    const handleChange = () => setPrefersHighContrast(mql.matches);
    
    handleChange();
    mql.addEventListener('change', handleChange);
    
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Detect keyboard users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
    
    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Add keyboard user class to body
  useEffect(() => {
    if (isKeyboardUser) {
      document.body.classList.add('keyboard-user');
    } else {
      document.body.classList.remove('keyboard-user');
    }
  }, [isKeyboardUser]);

  // Function to announce messages to screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAriaLive(priority);
    setAnnouncement(message);
  };

  return (
    <A11yContext.Provider
      value={{
        announce,
        prefersReducedMotion,
        prefersHighContrast,
        isKeyboardUser,
      }}
    >
      {children}
      <LiveRegion message={announcement} ariaLive={ariaLive} />
    </A11yContext.Provider>
  );
};

export default A11yProvider;