// Authentication hook
import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication service
export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('nutricare_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      authType: 'email'
    };
    
    setUser(mockUser);
    localStorage.setItem('nutricare_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '2',
      name: 'Google User',
      email: 'user@gmail.com',
      authType: 'google'
    };
    
    setUser(mockUser);
    localStorage.setItem('nutricare_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: '',
      authType: 'guest'
    };
    
    setUser(guestUser);
    localStorage.setItem('nutricare_user', JSON.stringify(guestUser));
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      authType: 'email'
    };
    
    setUser(newUser);
    localStorage.setItem('nutricare_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutricare_user');
  };

  return {
    user,
    isLoading,
    login,
    loginWithGoogle,
    continueAsGuest,
    register,
    logout
  };
};

export { AuthContext };