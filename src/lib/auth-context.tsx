import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { User } from '../types';
import { authAPI } from './api-client';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  navigateToStoredPath: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes



  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      resetIdleTimer();
    }
    // No activeTab enforcement – each tab can have its own session
  }, []); // runs once on mount

  // Reset idle timer on user activity
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (user) {
      idleTimerRef.current = setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT);
    }
  };

  // Listen for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const resetTimer = () => resetIdleTimer();
    events.forEach(event => window.addEventListener(event, resetTimer));
    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [user]);



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
      sessionStorage.setItem('user', JSON.stringify(normalizedUser));
      sessionStorage.setItem('token', token);
      // No activeTab handling – session is per‑tab
      return normalizedUser;
    } catch (err: any) {
      console.error('Login failed:', err);
      // Re-throw the error so the LoginPage can display the specific message
      throw err;
    }
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
    localStorage.removeItem('storedPath');
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    // Force navigation to the login page
    window.location.href = '/login';
  };

  const navigateToStoredPath = () => {
    const storedPath = sessionStorage.getItem('storedPath');
    if (storedPath && storedPath !== '/' && storedPath !== '/login' && storedPath !== '/register') {
      window.location.href = storedPath;
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUserProfile, isAuthenticated: !!user, navigateToStoredPath }}>
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
