import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from './api-client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  googleLogin: () => Promise<User | null>;
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

  const googleLogin = async (): Promise<User | null> => {
    try {
      // Redirect to Google OAuth2 login
      window.location.href = 'http://localhost:8081/oauth2/authorization/google';
      return null; // This will redirect, so we don't return anything
    } catch (err) {
      console.error('Google login failed:', err);
      return null;
    }
  };

  // Handle OAuth2 redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('user');
    const role = urlParams.get('role');

    if (token && userId && role) {
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      // Set user data from OAuth2 redirect
      const oauthUser = {
        id: userId,
        email: '', // Will be fetched from backend if needed
        name: '', // Will be fetched from backend if needed
        role: role as 'patient' | 'doctor' | 'hospital' | 'admin' | 'trainer'
      };

      setUser(oauthUser);
      localStorage.setItem('user', JSON.stringify(oauthUser));
      localStorage.setItem('token', token);

      // Redirect to appropriate dashboard
      const path = role === 'admin' ? '/admin-dashboard' :
                   role === 'doctor' ? '/doctor-dashboard' :
                   role === 'hospital' ? '/hospital-dashboard' :
                   role === 'trainer' ? '/trainer-dashboard' : '/patient/dashboard';

      window.location.href = path;
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, googleLogin, isAuthenticated: !!user }}>
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
