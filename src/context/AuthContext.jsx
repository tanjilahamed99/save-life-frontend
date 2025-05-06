'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecodeHook } from '@/utils/decode';

const userContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('benzo-auth-token') || '';
    const isProtectedRoute =
      pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

    if (token) {
      try {
        const { isValid, user: decodedUser } = jwtDecodeHook(token);
        if (isValid) {
          setUser(decodedUser);
        } else {
          setUser(null);
          localStorage.removeItem('benzo-auth-token');
          // Only redirect if trying to access protected routes
          if (isProtectedRoute) {
            router.push('/login');
          }
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('benzo-auth-token');
        // Only redirect if trying to access protected routes
        if (isProtectedRoute) {
          router.push('/login');
        }
      }
    } else {
      setUser(null);
      // Only redirect if trying to access protected routes
      if (isProtectedRoute) {
        router.push('/login');
      }
    }
    setLoading(false);
  }, [router, pathname]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]);

  return (
    <userContext.Provider value={{ user, loading, refreshUser: checkAuth }}>
      {!loading && children}
    </userContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
