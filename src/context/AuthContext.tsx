import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, Business } from '@/types';
import { authService } from '@/services';
import { initializeData } from '@/services/mock';

interface AuthContextValue {
  user: User | null;
  business: Business | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    businessName: string;
    businessType: import('@/types').BusinessType;
    location: string;
    contactNumber: string;
  }) => Promise<void>;
  logout: () => void;
  updateBusiness: (updates: Partial<Business>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const session = authService.getCurrentSession();
    if (session) {
      setUser(session.user);
      setBusiness(session.business);
      setToken(session.token);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authService.login({ email, password });
    setUser(session.user);
    setBusiness(session.business);
    setToken(session.token);
  }, []);

  const register = useCallback(async (data: {
    fullName: string;
    email: string;
    password: string;
    businessName: string;
    businessType: import('@/types').BusinessType;
    location: string;
    contactNumber: string;
  }) => {
    const session = await authService.register(data);
    setUser(session.user);
    setBusiness(session.business);
    setToken(session.token);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setBusiness(null);
    setToken(null);
  }, []);

  const updateBusiness = useCallback(async (updates: Partial<Business>) => {
    if (!business) return;
    const updated = await authService.updateBusiness(business.businessId, updates);
    setBusiness(updated);
  }, [business]);

  return (
    <AuthContext.Provider
      value={{ user, business, token, isAuthenticated: !!token, isLoading, login, register, logout, updateBusiness }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
