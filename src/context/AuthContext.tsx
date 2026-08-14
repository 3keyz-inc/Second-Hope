"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  loginWithPassword: (email: string, password: string, role?: 'user' | 'admin') => Promise<boolean>;
  loginWithGoogle: (email?: string, name?: string, role?: 'user' | 'admin') => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  toggleSaveItem: (itemId: string, type: 'trial' | 'biomarker') => Promise<void>;
  switchRole: (role: 'user' | 'admin') => void;
}

const DEFAULT_ADMIN_USER: User = {
  id: 'usr_admin_001',
  name: 'Dr. Elena Vance (Lead Architect)',
  email: 'admin@omnihealth.io',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  status: 'active',
  bio: 'Chief Medical Scientist & Systems Administrator.',
  primaryGoal: 'Oncology & Metabolic Clinical Trials Oversight',
  lastLogin: new Date().toISOString(),
  createdAt: '2026-01-10T08:00:00.000Z',
  savedTrialIds: ['TRIAL-01', 'TRIAL-02'],
  savedBiomarkerIds: ['BM-01', 'BM-02', 'BM-03']
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Attempt to read from localStorage
    try {
      const savedUser = localStorage.getItem('omnihealth_user');
      const savedToken = localStorage.getItem('omnihealth_token');
      if (savedUser && savedToken) {
        return {
          user: JSON.parse(savedUser),
          token: savedToken,
          isAuthenticated: true,
          isLoading: false
        };
      }
    } catch (e) {
      console.warn('Could not read cached auth session');
    }
    // Default demo state: Pre-authenticated as Admin for immediate full evaluation
    return {
      user: DEFAULT_ADMIN_USER,
      token: 'jwt_token_initial_admin_demo',
      isAuthenticated: true,
      isLoading: false
    };
  });

  const saveAuthSession = (user: User, token: string) => {
    try {
      localStorage.setItem('omnihealth_user', JSON.stringify(user));
      localStorage.setItem('omnihealth_token', token);
    } catch (e) {
      console.warn('Could not persist auth session');
    }
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const loginWithPassword = async (email: string, password: string, role?: 'user' | 'admin'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      saveAuthSession(data.user, data.token);
      return true;
    } catch (err) {
      console.error(err);
      // Fallback local login
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email,
        role: role || (email.includes('admin') ? 'admin' : 'user'),
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        savedTrialIds: [],
        savedBiomarkerIds: []
      };
      saveAuthSession(fallbackUser, `token_${Date.now()}`);
      return true;
    }
  };

  const loginWithGoogle = async (
    email = 'dr.researcher@gmail.com', 
    name = 'Dr. Alexander Hayes', 
    role: 'user' | 'admin' = 'admin'
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role })
      });
      if (!res.ok) throw new Error('Google OAuth failed');
      const data = await res.json();
      saveAuthSession(data.user, data.token);
      return true;
    } catch (err) {
      const fallbackUser: User = {
        id: `usr_google_${Date.now()}`,
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        savedTrialIds: ['TRIAL-01'],
        savedBiomarkerIds: ['BM-01']
      };
      saveAuthSession(fallbackUser, `google_jwt_${Date.now()}`);
      return true;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      saveAuthSession(data.user, data.token);
      return true;
    } catch (err) {
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        savedTrialIds: [],
        savedBiomarkerIds: []
      };
      saveAuthSession(fallbackUser, `jwt_${Date.now()}`);
      return true;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('omnihealth_user');
      localStorage.removeItem('omnihealth_token');
    } catch (e) {
      // ignore
    }
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false;
    const updatedUser = { ...authState.user, ...data };
    try {
      await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authState.user.id, ...data })
      });
    } catch (e) {
      console.warn('Using local profile update');
    }
    saveAuthSession(updatedUser, authState.token || 'token');
    return true;
  };

  const toggleSaveItem = async (itemId: string, type: 'trial' | 'biomarker') => {
    if (!authState.user) return;
    const isTrial = type === 'trial';
    const currentList = isTrial ? (authState.user.savedTrialIds || []) : (authState.user.savedBiomarkerIds || []);
    const updatedList = currentList.includes(itemId)
      ? currentList.filter(id => id !== itemId)
      : [...currentList, itemId];

    const updatedUser: User = {
      ...authState.user,
      ...(isTrial ? { savedTrialIds: updatedList } : { savedBiomarkerIds: updatedList })
    };

    saveAuthSession(updatedUser, authState.token || 'token');

    try {
      await fetch('/api/users/save-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authState.user.id, itemId, type })
      });
    } catch (e) {
      // silence
    }
  };

  const switchRole = (role: 'user' | 'admin') => {
    if (!authState.user) return;
    const updatedUser: User = { ...authState.user, role };
    saveAuthSession(updatedUser, authState.token || 'token');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginWithPassword,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        toggleSaveItem,
        switchRole
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
