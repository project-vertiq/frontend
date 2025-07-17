import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, signup, refreshToken, logout, oidcGoogleLogin } from '../services/auth.api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  loginWithGoogle: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!accessToken && !!user;

  // On mount, try to refresh token (silent login) if not on login/signup
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      (async () => {
        setAuthLoading(true);
        try {
          const { accessToken, user } = await refreshToken();
          setAccessToken(accessToken);
          setUser(user);
        } catch {
          setAccessToken(null);
          setUser(null);
          navigate('/login');
        } finally {
          setAuthLoading(false);
        }
      })();
    } else {
      setAuthLoading(false);
    }
  }, []);

  const loginHandler = useCallback(async (credentials: { email: string; password: string }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { accessToken, user } = await login(credentials);
      setAccessToken(accessToken);
      setUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
      setAccessToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, [navigate]);

  const signupHandler = useCallback(async (data: any) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signup(data);
      // Optionally auto-login or redirect
      navigate('/login');
    } catch (err: any) {
      setAuthError(err.message || 'Signup failed');
    } finally {
      setAuthLoading(false);
    }
  }, [navigate]);

  const logoutHandler = useCallback(async () => {
    setAuthLoading(true);
    try {
      await logout();
    } catch {}
    setAccessToken(null);
    setUser(null);
    setAuthLoading(false);
    navigate('/login');
  }, [navigate]);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { accessToken, user } = await oidcGoogleLogin({ idToken });
      setAccessToken(accessToken);
      setUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Google login failed');
      setAccessToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user && user.id) {
      sessionStorage.setItem('vertiq_user_id', user.id);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        authLoading,
        authError,
        login: loginHandler,
        signup: signupHandler,
        logout: logoutHandler,
        setAccessToken,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
