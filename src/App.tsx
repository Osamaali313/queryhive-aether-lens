import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { A11yProvider } from "@/components/a11y/A11yProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import SkipLink from "@/components/a11y/SkipLink";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AnimatedBackground from "@/components/AnimatedBackground";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on client errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <A11yProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SkipLink targetId="main-content" />
                <div className="min-h-screen relative">
                  <AnimatedBackground />
                  <div className="relative z-10">
                    <Routes>
                      <Route path="/landing" element={<Landing />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/app" element={<Navigate to="/" replace />} />
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute>
                            <Index />
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                  </div>
                </div>
              </BrowserRouter>
            </A11yProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;