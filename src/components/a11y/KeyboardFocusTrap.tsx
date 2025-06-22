import React, { useEffect, useRef } from 'react';

interface KeyboardFocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  onEscape?: () => void;
}

/**
 * Component that traps keyboard focus within its children
 */
const KeyboardFocusTrap: React.FC<KeyboardFocusTrapProps> = ({
  children,
  active = true,
  initialFocus,
  onEscape,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Set initial focus
    if (initialFocus && initialFocus.current) {
      initialFocus.current.focus();
    } else if (containerRef.current) {
      // Find the first focusable element
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    // Restore focus when unmounted
    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, initialFocus]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!active || !containerRef.current) return;

    // Handle Escape key
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab key to trap focus
    if (e.key === 'Tab') {
      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element should wrap to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element should wrap to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

export default KeyboardFocusTrap;