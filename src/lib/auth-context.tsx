import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from './api-client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: string): Promise<User | null> => {
    try {
      const res = await authAPI.login(email, password);
      const userData = res.user;
      // Convert role to lowercase to match frontend expectations
      const normalizedUser = {
        ...userData,
        role: userData.role.toLowerCase()
      };
      const token = res.token;
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('token', token);
      return normalizedUser;
    } catch (err) {
      console.error('Login failed:', err);
    }
    return null;
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      await authAPI.register(userData);
      // Registration successful - user needs to verify email before logging in
      return { success: true };
    } catch (err: any) {
      console.error('Registration failed:', err);

      // Extract error message from backend response
      if (err.message) {
        return { success: false, error: err.message };
      }

      // Fallback error message
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
