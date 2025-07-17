import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { refreshToken } from '@/services/auth.api';

/**
 * A fetch wrapper that automatically adds the access token from AuthContext
 * and handles 401 errors by attempting a silent refresh and retrying once.
 * If refresh fails, redirects to login.
 */
export function useAuthFetch() {
  const { accessToken, setAccessToken, setUser, authLoading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return useCallback(
    async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
      // Wait for authLoading to be false before making any request
      if (authLoading || !isAuthenticated) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
      }
      let token = accessToken;
      const fetchInit: RequestInit = { ...init };
      fetchInit.headers = {
        ...(fetchInit.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let response: Response;
      try {
        response = await fetch(input, fetchInit);
      } catch (err) {
        // Network or CORS error, never trigger browser popup
        return new Response(JSON.stringify({ error: 'Network error' }), { status: 500 });
      }

      if (response.status === 401) {
        // Try silent refresh
        try {
          const { accessToken: newToken, user } = await refreshToken();
          setAccessToken(newToken);
          setUser(user);
          // Retry original request with new token
          fetchInit.headers = {
            ...(fetchInit.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(input, fetchInit);
          if (response.status !== 401) return response;
        } catch {
          // Refresh failed, logout and redirect
          await logout();
          navigate('/login');
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
      }
      return response;
    },
    [accessToken, authLoading, isAuthenticated, logout, navigate, setAccessToken, setUser]
  );
}
