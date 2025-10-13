'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Verify token by fetching user info
          const userData = await api.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Token verification failed:', error);
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setToken(response.token);
    localStorage.setItem('auth_token', response.token);
    
    // Fetch user info
    const userData = await api.getMe();
    setUser(userData);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await api.register(email, password, name);
    setToken(response.token);
    localStorage.setItem('auth_token', response.token);
    
    // Fetch user info
    const userData = await api.getMe();
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
