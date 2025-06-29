import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  ariaLive?: 'polite' | 'assertive' | 'off';
  ariaRelevant?: 'additions' | 'removals' | 'text' | 'all';
  clearAfter?: number; // milliseconds
  className?: string;
}

/**
 * Component for announcing dynamic content changes to screen readers
 */
const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  ariaLive = 'polite',
  ariaRelevant = 'additions',
  clearAfter = 5000,
  className = '',
}) => {
  const [announcement, setAnnouncement] = useState(message);

  useEffect(() => {
    if (!message) return;
    
    // Set the announcement
    setAnnouncement(message);

    // Clear the announcement after specified time
    if (clearAfter > 0 && message) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      className={`sr-only ${className}`}
      aria-live={ariaLive}
      aria-relevant={ariaRelevant}
      aria-atomic="true"
      data-testid="live-region"
    >
      {announcement}
    </div>
  );
};

export default LiveRegion;