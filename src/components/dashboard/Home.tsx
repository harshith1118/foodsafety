// Home dashboard component
import React from 'react';
import { Utensils, Heart, Calendar, TrendingUp, Award, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  
  const quickActions = [
    {
      icon: Utensils,
      title: 'Find Food Info',
      description: 'Search, snap, or speak to discover nutrition facts',
      action: () => onNavigate('food'),
      color: 'emerald',
      emoji: '🔍'
    },
    {
      icon: Heart,
      title: 'Feeling Unwell?',
      description: 'Get personalized food recommendations for your health',
      action: () => onNavigate('health'),
      color: 'red',
      emoji: '💊'
    },
    {
      icon: Calendar,
      title: 'Plan Your Day',
      description: 'Create a balanced daily food routine',
      action: () => onNavigate('routine'),
      color: 'blue',
      emoji: '📋'
    }
  ];
  
  const stats = [
    { label: 'Foods Analyzed', value: '247', icon: TrendingUp, color: 'purple' },
    { label: 'Health Queries', value: '18', icon: Heart, color: 'red' },
    { label: 'Routines Planned', value: '12', icon: Calendar, color: 'blue' },
    { label: 'Nutrition Score', value: '85%', icon: Award, color: 'emerald' }
  ];
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🥗</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.name}! 🌟
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ready to discover amazing foods, get health-focused recommendations, 
          and plan your perfect nutrition routine? Let's make today deliciously healthy! 
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              hover
              className="text-center cursor-pointer group"
              onClick={action.action}
            >
              <div className={`w-16 h-16 bg-${action.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{action.emoji}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <Button variant="outline" className="w-full">
                <Icon size={16} className="mr-2" />
                Get Started
              </Button>
            </Card>
          );
        })}
      </div>
      
      {/* Stats Overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your NutriCare Journey 📊</h2>
          <span className="text-sm text-gray-500">All time</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={20} className={`text-${stat.color}-600`} />
                </div>
                <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Daily Motivation */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
              <Target size={24} className="text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Today's Goal 🎯</h3>
              <p className="text-emerald-800 mb-3">
                Try to learn about one new nutritious food today! Knowledge is the key to better health.
              </p>
              <Button size="sm" onClick={() => onNavigate('food')}>
                Explore Foods
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Health Tip 💡</h3>
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
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity 📈</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Utensils size={16} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">Analyzed nutrition for "Chicken Breast"</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Heart size={16} className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">Got food recommendations for "Common Cold"</p>
              <p className="text-sm text-gray-600">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">Created daily routine for tomorrow</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};