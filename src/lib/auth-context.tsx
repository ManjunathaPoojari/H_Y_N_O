import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import axios from 'axios';
import { API_URL } from './config';

const API_BASE = API_URL;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
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

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      if (res.status === 200) {
        const userData = res.data.user;
        // Convert role to lowercase to match frontend expectations
        const normalizedUser = {
          ...userData,
          role: userData.role.toLowerCase() === 'admin' ? 'admin' : userData.role.toLowerCase()
        };
        const token = res.data.token;
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('token', token);
        return true;
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, userData);
      if (res.status === 200) {
        // After successful registration, automatically log them in
        return await login(userData.email, userData.password, userData.role);
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
    return false;
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
