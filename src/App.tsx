import React, { useState, createContext } from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { Navbar } from './components/layout/Navbar';
import { Home } from './components/dashboard/Home';
import { FoodSearch } from './components/food/FoodSearch';
import { FoodDetails } from './components/food/FoodDetails';
import { HealthConditions } from './components/health/HealthConditions';
import { DailyRoutine } from './components/routine/DailyRoutine';
import { AuthContext, useAuthLogic } from './hooks/useAuth';
import { FoodItem } from './types';

function App() {
  const authValue = useAuthLogic();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  const { user } = authValue;
  
  if (!user) {
    return (
      <AuthContext.Provider value={authValue}>
        <AuthForm onSuccess={() => {}} />
      </AuthContext.Provider>
    );
  }
  
  const handleFoodSelected = (food: FoodItem) => {
    setSelectedFood(food);
  };
  
  const handleBackToSearch = () => {
    setSelectedFood(null);
  };
  
  const renderContent = () => {
    if (activeTab === 'food') {
      if (selectedFood) {
        return <FoodDetails food={selectedFood} onBack={handleBackToSearch} />;
      }
      return <FoodSearch onFoodSelected={handleFoodSelected} />;
    }
    
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'health':
        return <HealthConditions />;
      case 'routine':
        return <DailyRoutine />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };
  
  return (
    <AuthContext.Provider value={authValue}>
      <div className="min-h-screen bg-gray-50">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          {renderContent()}
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;