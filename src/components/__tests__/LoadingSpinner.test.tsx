import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('displays message when provided', () => {
    const message = 'Loading data...';
    render(<LoadingSpinner message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner.querySelector('svg')).toHaveClass('w-8', 'h-8');
  });

  it('applies variant classes correctly', () => {
    render(<LoadingSpinner variant="neon" />);
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner.querySelector('svg')).toHaveClass('text-neon-purple');
  });
});