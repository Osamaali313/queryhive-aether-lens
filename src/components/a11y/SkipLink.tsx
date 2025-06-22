import React from 'react';

interface SkipLinkProps {
  targetId: string;
  label?: string;
  className?: string;
}

/**
 * Accessibility component that allows keyboard users to skip navigation
 */
const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  label = 'Skip to main content',
  className = '',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`skip-link ${className}`}
      onFocus={(e) => e.currentTarget.classList.add('focus:top-4')}
      onBlur={(e) => e.currentTarget.classList.remove('focus:top-4')}
    >
      {label}
    </a>
  );
};

export default SkipLink;