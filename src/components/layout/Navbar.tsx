// Navigation bar component
import React, { useState } from 'react';
import { Home, Search, Heart, Calendar, User } from 'lucide-react';
import { ProfilePopup } from '../profile/ProfilePopup';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'food', label: 'Food Info', icon: Search },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'routine', label: 'Routine', icon: Calendar },
  ];
  
  // Get user's first name for display
  const getUserDisplayName = () => {
    if (!user?.name) return 'User';
    return user.name.split(' ')[0];
  };
  
  // Get user avatar or default
  const getUserAvatar = () => {
    if ((user as any)?.avatar) {
      return (user as any).avatar;
    }
    return null;
  };
  
  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logos/professional-logo.svg" 
                  alt="NutriCare Logo" 
                  className="h-10 w-10 transition-transform duration-300 hover:scale-105"
                />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">NutriCare</h1>
              </div>
              
              <div className="flex space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                        ${activeTab === item.id
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  {getUserAvatar() ? (
                    <span className="text-sm">{getUserAvatar()}</span>
                  ) : (
                    <User size={16} className="text-emerald-600" />
                  )}
                </div>
                <span className="text-gray-700 font-medium">{getUserDisplayName()}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 py-2">
          <div className="flex items-center justify-center">
            <img 
              src="/logos/professional-logo.svg" 
              alt="NutriCare Logo" 
              className="h-6 w-6"
            />
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex flex-col items-center py-2 px-1 space-y-1 transition-all duration-300
                  ${activeTab === item.id
                    ? 'text-emerald-600'
                    : 'text-gray-600'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Profile Popup */}
      <ProfilePopup 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};