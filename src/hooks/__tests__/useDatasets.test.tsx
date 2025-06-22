import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDatasets } from '../useDatasets';
import { useAuth } from '@/contexts/AuthContext';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('@/integrations/supabase/client');
vi.mock('@/hooks/use-toast');

const mockUseAuth = vi.mocked(useAuth);
const mockToast = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe('useDatasets', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('returns empty array when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    const { result } = renderHook(() => useDatasets(), { wrapper });

    expect(result.current.datasets).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('provides dataset management functions', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      session: null,
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    const { result } = renderHook(() => useDatasets(), { wrapper });

    expect(result.current.createDataset).toBeDefined();
    expect(result.current.insertDataRecords).toBeDefined();
    expect(typeof result.current.createDataset.mutate).toBe('function');
    expect(typeof result.current.insertDataRecords.mutate).toBe('function');
  });
});