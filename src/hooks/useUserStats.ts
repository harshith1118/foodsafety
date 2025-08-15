// Hook to track and manage user statistics
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserStats } from '../types';

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    foodsAnalyzed: 0,
    healthQueries: 0,
    routinesPlanned: 0,
    nutritionScore: 0
  });
  const [loading, setLoading] = useState(true);

  // Load stats from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`nutricare_stats_${user.id}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        // Initialize with some default values for new users
        const defaultStats: UserStats = {
          foodsAnalyzed: 0,
          healthQueries: 0,
          routinesPlanned: 0,
          nutritionScore: 75 // Default starting score
        };
        setStats(defaultStats);
        localStorage.setItem(`nutricare_stats_${user.id}`, JSON.stringify(defaultStats));
      }
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

  return {
    stats,
    loading,
    incrementFoodsAnalyzed,
    incrementHealthQueries,
    incrementRoutinesPlanned,
    updateLastActivity
  };
};