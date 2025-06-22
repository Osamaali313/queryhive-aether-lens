import React from 'react';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * Component that visually hides content but keeps it accessible to screen readers
 */
const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  as: Component = 'span',
  className = '',
}) => {
  return (
    <Component
      className={`absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 ${className}`}
      style={{ clip: 'rect(0, 0, 0, 0)' }}
    >
      {children}
    </Component>
  );
};

export default ScreenReaderOnly;