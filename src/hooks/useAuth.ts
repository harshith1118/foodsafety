// Authentication hook
import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { authService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updateGuestProfile: (name: string, avatar?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication logic with proper service integration
export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('nutricare_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('nutricare_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const user = await authService.login(email, password);
      setUser(user);
      localStorage.setItem('nutricare_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = async () => {
    setIsLoading(true);
    
    try {
      const user = await authService.guestLogin();
      setUser(user);
      localStorage.setItem('nutricare_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const user = await authService.register(name, email, password);
      setUser(user);
      localStorage.setItem('nutricare_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutricare_user');
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    const updatedUser = await authService.updateProfile(user.email, userData);
    setUser(updatedUser);
    localStorage.setItem('nutricare_user', JSON.stringify(updatedUser));
  };

  const updateGuestProfile = async (name: string, avatar?: string) => {
    if (!user || user.authType !== 'guest') {
      throw new Error('No guest user logged in');
    }
    
    const updatedUser = await authService.updateGuestProfile(user.email, name, avatar);
    setUser(updatedUser);
    localStorage.setItem('nutricare_user', JSON.stringify(updatedUser));
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    await authService.resetPassword(email, token, newPassword);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await authService.changePassword(user.email, currentPassword, newPassword);
  };

  return {
    user,
    isLoading,
    login,
    guestLogin,
    register,
    logout,
    updateProfile,
    updateGuestProfile,
    forgotPassword,
    resetPassword,
    changePassword
  };
};

export { AuthContext };