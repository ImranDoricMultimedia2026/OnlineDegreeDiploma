import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; state?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: any) => Promise<{ success: boolean; message: string }>;
  savedPrograms: string[];
  toggleSavedProgram: (programId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.warn('Invalid user session data in localStorage, resetting');
      localStorage.removeItem('user');
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [savedPrograms, setSavedPrograms] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch logged in user profile on load
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setSavedPrograms(res.data.user.savedPrograms || []);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        setSavedPrograms(res.data.user.savedPrograms || []);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true, message: res.data.message || 'Login successful' };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Server error during login'
      };
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; state?: string }) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        return { success: true, message: res.data.message || 'Account created successfully! Please log in.' };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Server error during registration'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setSavedPrograms([]);
  };

  const updateProfile = async (data: any) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Failed to update profile' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Server error updating profile'
      };
    }
  };

  const toggleSavedProgram = async (programId: string): Promise<boolean> => {
    if (!token || !user) return false;
    try {
      const res = await api.post('/students/saved-programs', { programId });
      if (res.data.success) {
        setSavedPrograms(res.data.savedPrograms);
        setUser((prev) => (prev ? { ...prev, savedPrograms: res.data.savedPrograms } : null));
        return res.data.isSaved;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        savedPrograms,
        toggleSavedProgram
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
