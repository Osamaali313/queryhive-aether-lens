import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import ErrorFallback from '../ErrorFallback';

// Mock window.location
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
    href: '',
  },
  writable: true,
});

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error message', () => {
    render(<ErrorFallback error={mockError} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('shows try again button when resetError is provided', () => {
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    const tryAgainButton = screen.getByText('Try Again');
    expect(tryAgainButton).toBeInTheDocument();
    
    fireEvent.click(tryAgainButton);
    expect(mockResetError).toHaveBeenCalledOnce();
  });

  it('calls window.location.reload when reload button is clicked', () => {
    render(<ErrorFallback error={mockError} />);
    
    const reloadButton = screen.getByText('Reload Page');
    fireEvent.click(reloadButton);
    
    expect(mockReload).toHaveBeenCalledOnce();
  });

  it('navigates to home when go home button is clicked', () => {
    render(<ErrorFallback error={mockError} />);
    
    const homeButton = screen.getByText('Go Home');
    fireEvent.click(homeButton);
    
    expect(window.location.href).toBe('/');
  });
});