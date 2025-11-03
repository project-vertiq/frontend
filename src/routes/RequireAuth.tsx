import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Protects routes from unauthenticated access. Redirects to /login if not authenticated.
 */
export default function RequireAuth() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    // Show a full-page skeleton loader
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full gap-4 p-8">
        <Skeleton className="h-8 w-1/3 max-w-xs mb-4" />
        <Skeleton className="h-6 w-1/2 max-w-md mb-2" />
        <Skeleton className="h-96 w-full max-w-2xl rounded" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
