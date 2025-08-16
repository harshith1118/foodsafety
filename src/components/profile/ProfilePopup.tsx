// User profile popup component
import React, { useState } from 'react';
import { X, User, Mail, Calendar, Shield, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile, updateGuestProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: (user as User & { avatar?: string })?.avatar || ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Simplified default avatars for selection
  const DEFAULT_AVATARS = [
    '👨‍⚕️', '👩‍⚕️', // Medical
    '👨‍🍳', '👩‍🍳', // Cooking
    '👨‍🌾', '👩‍🌾', // Agriculture
    '👨‍🔬', '👩‍🔬', // Science
    '👨‍🎓', '👩‍🎓', // Education
    '👨‍💼', '👩‍💼'  // Business
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      if (user?.authType === 'guest') {
        await updateGuestProfile(editData.name, editData.avatar || undefined);
      } else {
        await updateProfile({
          name: editData.name,
          email: editData.email
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Format the creation date
  const formatCreationDate = () => {
    if (!user?.createdAt) return 'Recently joined';
    try {
      return new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recently joined';
    }
  };

  // Get user avatar or default
  const getUserAvatar = () => {
    if (user && (user as User & { avatar?: string })?.avatar) {
      return (user as User & { avatar?: string }).avatar;
    }
    return '👤';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">{getUserAvatar()}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <div className="flex items-center mt-1">
                <Shield size={16} className="text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-600 font-medium capitalize">
                  {user?.authType === 'google' ? 'Google Account' : 
                   user?.authType === 'guest' ? 'Guest Account' : 'Email Account'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                error={errors.name}
              />
              
              {user?.authType !== 'google' && (
                <Input
                  label="Email Address"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  error={errors.email}
                  disabled={user?.authType === 'google'}
                />
              )}
              
              {(user?.authType === 'guest' || !user?.authType) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DEFAULT_AVATARS.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setEditData({ ...editData, avatar })}
                        className={`text-xl p-2 rounded-lg border-2 transition-all duration-200 ${
                          editData.avatar === avatar
                            ? 'border-emerald-500 bg-emerald-50 scale-110'
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditData({
                      name: user?.name || '',
                      email: user?.email || '',
                      avatar: (user as User & { avatar?: string })?.avatar || ''
                    });
                    setIsEditing(true);
                  }}
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">{formatCreationDate()}</p>
                  </div>
                </div>
              </div>
              
              {(user?.authType === 'guest' || !user?.authType) && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-lg">{getUserAvatar()}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avatar</p>
                      <p className="font-medium text-gray-900">Personal Avatar</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditData({
                        name: user?.name || '',
                        email: user?.email || '',
                        avatar: (user as User & { avatar?: string })?.avatar || ''
                      });
                      setIsEditing(true);
                    }}
                    className="text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Account Actions */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};