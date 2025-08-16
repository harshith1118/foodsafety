// Context for managing user statistics across the application
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserStats } from '../types';

interface StatsContextType {
  stats: UserStats;
  incrementFoodsAnalyzed: () => void;
  incrementHealthQueries: () => void;
  incrementRoutinesPlanned: () => void;
  updateLastActivity: (activity: string) => void;
  loading: boolean;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Initialize stats with default values
  const getDefaultStats = (): UserStats => ({
    foodsAnalyzed: 0,
    healthQueries: 0,
    routinesPlanned: 0,
    nutritionScore: 75,
    lastActivity: undefined
  });

  const [stats, setStats] = useState<UserStats>(getDefaultStats());

  // Load stats from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`nutricare_stats_${user.id}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        // For new users, initialize with fresh stats
        const freshStats = getDefaultStats();
        setStats(freshStats);
        // Save fresh stats to localStorage for this user
        localStorage.setItem(`nutricare_stats_${user.id}`, JSON.stringify(freshStats));
      }
      setLoading(false);
    } else {
      // No user, reset to default stats
      setStats(getDefaultStats());
      setLoading(false);
    }
  }, [user]);

  // Update stats in localStorage whenever they change
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`nutricare_stats_${user.id}`, JSON.stringify(stats));
    }
  }, [stats, user, loading]);

  // Function to update stats when user performs actions
  const incrementFoodsAnalyzed = () => {
    setStats(prev => ({
      ...prev,
      foodsAnalyzed: prev.foodsAnalyzed + 1,
      nutritionScore: Math.min(100, prev.nutritionScore + 1) // Increase score slightly
    }));
  };

  const incrementHealthQueries = () => {
    setStats(prev => ({
      ...prev,
      healthQueries: prev.healthQueries + 1,
      nutritionScore: Math.min(100, prev.nutritionScore + 2) // Increase score more for health queries
    }));
  };

  const incrementRoutinesPlanned = () => {
    setStats(prev => ({
      ...prev,
      routinesPlanned: prev.routinesPlanned + 1,
      nutritionScore: Math.min(100, prev.nutritionScore + 3) // Increase score most for planning routines
    }));
  };

  const updateLastActivity = (activity: string) => {
    setStats(prev => ({
      ...prev,
      lastActivity: activity
    }));
  };

  const value = {
    stats,
    incrementFoodsAnalyzed,
    incrementHealthQueries,
    incrementRoutinesPlanned,
    updateLastActivity,
    loading
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};