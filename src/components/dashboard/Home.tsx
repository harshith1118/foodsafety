// Home dashboard component
import React from 'react';
import { Utensils, Heart, Calendar, TrendingUp, Award, Target, Dumbbell } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useStats } from '../../contexts/StatsContext';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { stats } = useStats();
  
  const quickActions = [
    {
      icon: Utensils,
      title: 'Find Food Info',
      description: 'Search to discover nutrition facts',
      action: () => onNavigate('food'),
      color: 'emerald',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      icon: Heart,
      title: 'Feeling Unwell?',
      description: 'Get personalized food recommendations for your health',
      action: () => onNavigate('health'),
      color: 'red',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Plan Your Day',
      description: 'Create a balanced daily food routine',
      action: () => onNavigate('routine'),
      color: 'blue',
      gradient: 'from-blue-400 to-indigo-500'
    }
  ];
  
  const statsData = [
    { label: 'Foods Analyzed', value: stats.foodsAnalyzed.toString(), icon: TrendingUp, color: 'purple' },
    { label: 'Health Queries', value: stats.healthQueries.toString(), icon: Heart, color: 'red' },
    { label: 'Routines Planned', value: stats.routinesPlanned.toString(), icon: Calendar, color: 'blue' },
    { label: 'Nutrition Score', value: `${stats.nutritionScore}%`, icon: Award, color: 'emerald' }
  ];
  
  // Get user's first name for greeting
  const getUserFirstName = () => {
    if (!user?.name) return 'there';
    return user.name.split(' ')[0];
  };
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img 
              src="/logos/vibrant-main-logo.svg" 
              alt="NutriCare Logo" 
              className="w-16 h-16 rounded-2xl shadow-lg"
            />
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to NutriCare, {getUserFirstName()}! 👋
        </h1>
        <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Start your personalized nutrition journey today. Discover foods that fuel your body, support your wellness goals, and taste amazing!
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const colorClasses = {
            emerald: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-200',
            red: 'bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-red-200',
            blue: 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-blue-200'
          };
          
          return (
            <Card
              key={index}
              hover
              className="text-center cursor-pointer group flex flex-col h-full border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={action.action}
            >
              <div className={`w-20 h-20 ${colorClasses[action.color as keyof typeof colorClasses].split(' ')[0]} ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <Icon size={36} className="text-white drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{action.title}</h3>
              <p className="text-base text-gray-700 mb-5 flex-grow px-2">{action.description}</p>
              <Button 
                variant="primary" 
                className="w-full mt-auto py-3 font-semibold bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black"
                onClick={(e) => {
                  e.stopPropagation();
                  action.action();
                }}
              >
                Get Started
              </Button>
            </Card>
          );
        })}
      </div>
      
      {/* Stats Overview */}
      <Card className="border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Dumbbell className="mr-3 text-emerald-600" size={28} />
            Your NutriCare Journey
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">All time</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              purple: 'bg-purple-100 text-purple-600',
              red: 'bg-red-100 text-red-600',
              blue: 'bg-blue-100 text-blue-600',
              emerald: 'bg-emerald-100 text-emerald-600'
            };
            
            return (
              <div key={index} className="text-center p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                <div className={`w-14 h-14 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[0]} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={24} className={colorClasses[stat.color as keyof typeof colorClasses].split(' ')[1]} />
                </div>
                <div className={`text-2xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[1]} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Daily Motivation */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Today's Goal 🎯</h3>
              <p className="text-emerald-800 mb-3">
                Try to learn about one new nutritious food today! Knowledge is the key to better health.
              </p>
              <Button size="sm" onClick={() => onNavigate('food')}>
                Explore Foods
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Health Tip 💡</h3>
              <p className="text-blue-800 mb-3">
                Remember: Small, consistent changes in your eating habits lead to big improvements in your health!
              </p>
              <Button size="sm" variant="secondary" onClick={() => onNavigate('health')}>
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-emerald-600" size={24} />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {stats.lastActivity ? (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Utensils size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{stats.lastActivity}</p>
                <p className="text-sm text-gray-600">Just now</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No recent activity yet</p>
              <p className="text-gray-400 text-sm mt-1">Start exploring to see your activity here</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
