import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Check immediately
    checkMobile();
    
    // Set up event listener for window resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Modern approach using addEventListener
    const handleChange = () => {
      checkMobile();
    };
    
    mql.addEventListener("change", handleChange);
    
    // Clean up
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return !!isMobile;
}

// Hook for detecting touch devices
export function useTouchDevice() {
  const [isTouch, setIsTouch] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };
    
    checkTouch();
  }, []);

  return !!isTouch;
}

// Hook for responsive breakpoints
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('xs');

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setBreakpoint('xs');
      } else if (width < 768) {
        setBreakpoint('sm');
      } else if (width < 1024) {
        setBreakpoint('md');
      } else if (width < 1280) {
        setBreakpoint('lg');
      } else if (width < 1536) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };
    
    checkBreakpoint();
    
    const handleResize = () => {
      checkBreakpoint();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
}

// Hook for detecting reduced motion preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setPrefersReducedMotion(mql.matches);
    };
    
    handleChange();
    mql.addEventListener('change', handleChange);
    
    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  return !!prefersReducedMotion;
}

// Hook for detecting high contrast mode
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-contrast: more)');
    
    const handleChange = () => {
      setPrefersHighContrast(mql.matches);
    };
    
    handleChange();
    mql.addEventListener('change', handleChange);
    
    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  return !!prefersHighContrast;
}