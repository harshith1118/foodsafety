// Guest Profile Setup Component
import React, { useState } from 'react';
import { User, UserPreferences } from '../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuestProfileSetupProps {
  onProfileComplete: () => void;
  onBackToLogin: () => void;
}

// Simple avatars for guests to choose from
const DEFAULT_AVATARS = [
  '👤', '🧑', '👨', '👩', '🧓', '👶'
];

export const GuestProfileSetup: React.FC<GuestProfileSetupProps> = ({ onProfileComplete, onBackToLogin }) => {
  const { user, updateGuestProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await updateGuestProfile(name, selectedAvatar || undefined);
      onProfileComplete();
    } catch (error: any) {
      console.error('Profile update error:', error);
      setErrors({ submit: error.message || 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    // Call the prop function to go back to login
    onBackToLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackButtonClick}
            className="text-gray-500 hover:text-gray-700 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Setup Profile</h1>
        </div>
        
        <div className="text-center mb-6">
          <img 
                src="/logos/new-logo.svg" 
                alt="NutriCare Logo" 
                className="w-16 h-16 mx-auto"
              />
          <p className="text-gray-700 font-medium">Personalize your experience</p>
        </div>
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Your Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            error={errors.name}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose an Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {DEFAULT_AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-xl p-2 rounded-lg border-2 transition-all duration-200 ${
                    selectedAvatar === avatar
                      ? 'border-emerald-500 bg-emerald-50 scale-110'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            size="lg"
          >
            Continue to NutriCare
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              console.log('Back to login button clicked');
              onBackToLogin();
            }}
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            Back to login
          </button>
        </div>
      </Card>
    </div>
  );
};