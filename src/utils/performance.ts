import { useCallback, useRef } from 'react';

// Debounce hook for performance optimization
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const observer = useRef<IntersectionObserver>();

  const observe = useCallback(
    (element: Element) => {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      });
      
      observer.current.observe(element);
    },
    [callback, options]
  );

  const disconnect = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
    }
  }, []);

  return { observe, disconnect };
};

// Memory usage monitoring
export const getMemoryUsage = (): MemoryInfo | null => {
  if ('memory' in performance) {
    return (performance as any).memory;
  }
  return null;
};

// Performance timing utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Bundle size analyzer helper
export const analyzeBundleSize = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalSize: navigation.transferSize,
    };
  }
  
  return null;
};

// Image optimization utilities
export const optimizeImageLoading = (src: string, options?: { 
  width?: number; 
  height?: number; 
  quality?: number; 
}) => {
  const { width, height, quality = 80 } = options || {};
  
  // For production, you might want to use a service like Cloudinary or ImageKit
  // This is a placeholder for image optimization logic
  let optimizedSrc = src;
  
  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    
    // This would be replaced with your actual image optimization service
    optimizedSrc = `${src}?${params.toString()}`;
  }
  
  return optimizedSrc;
};

// Lazy loading component wrapper
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType
) => {
  return React.lazy(async () => {
    // Add artificial delay for demonstration (remove in production)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { default: Component };
  });
};

// Data chunking for large datasets
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Virtual scrolling utilities
export const calculateVisibleRange = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 5
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return { startIndex, endIndex };
};