'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { api } from '@/lib/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock authentication - in real app, this would call your auth API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@futmap.com' && password === 'demo123') {
        const userData = await api.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('futmap_auth', 'true');
        localStorage.setItem('futmap_user', JSON.stringify(userData));
        return true;
      } else {
        setError('Email ou senha incorretos');
        return false;
      }
    } catch (err) {
      setError('Erro ao fazer login');
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, _password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock signup - in real app, this would call your auth API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f9a9f673-cce1-4ceb-a930-23f7de2c2e9c.png',
        favoriteFields: [],
        bookings: [],
        createdAt: new Date().toISOString()
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('futmap_auth', 'true');
      localStorage.setItem('futmap_user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      setError('Erro ao criar conta');
      console.error('Signup error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('futmap_auth');
    localStorage.removeItem('futmap_user');
  };

  const checkAuthStatus = async () => {
    try {
      const authStatus = localStorage.getItem('futmap_auth');
      const userData = localStorage.getItem('futmap_user');
      
      if (authStatus === 'true' && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (fieldId: string) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        favoriteFields: [...user.favoriteFields, fieldId]
      };
      setUser(updatedUser);
      localStorage.setItem('futmap_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const removeFromFavorites = async (fieldId: string) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        favoriteFields: user.favoriteFields.filter(id => id !== fieldId)
      };
      setUser(updatedUser);
      localStorage.setItem('futmap_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    addToFavorites,
    removeFromFavorites,
    clearError: () => setError(null)
  };
};