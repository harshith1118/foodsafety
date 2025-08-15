import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { ProfessionalAuthForm } from './components/auth/ProfessionalAuthForm';
import { PasswordReset } from './components/auth/PasswordReset';
import { GuestProfileSetup } from './components/auth/GuestProfileSetup';
import { Navbar } from './components/layout/Navbar';
import { Home } from './components/dashboard/Home';
import { FoodSearch } from './components/food/FoodSearch';
import { FoodDetails } from './components/food/FoodDetails';
import { HealthConditions } from './components/health/HealthConditions';
import { DailyRoutine } from './components/routine/DailyRoutine';
import { AuthContext, useAuthLogic } from './hooks/useAuth';
import { StatsProvider } from './contexts/StatsContext';
import { FoodItem } from './types';

// Lazy load components that aren't needed immediately
// const Home = lazy(() => import('./components/dashboard/Home'));
// const FoodSearch = lazy(() => import('./components/food/FoodSearch'));
// const FoodDetails = lazy(() => import('./components/food/FoodDetails'));
// const HealthConditions = lazy(() => import('./components/health/HealthConditions'));
// const DailyRoutine = lazy(() => import('./components/routine/DailyRoutine'));

function App() {
  const authValue = useAuthLogic();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const location = useLocation();
  
  const { user } = authValue;
  
  const handleFoodSelected = (food: FoodItem) => {
    console.log('handleFoodSelected called with:', food);
    setSelectedFood(food);
    console.log('selectedFood state set to:', food);
  };
  
  const handleBackToSearch = () => {
    setSelectedFood(null);
  };
  
  const handleAuthSuccess = () => {
    // Check if it's a guest user who needs profile setup
    if (authValue.user?.authType === 'guest' && authValue.user.name === 'Guest') {
      setNeedsProfileSetup(true);
    }
  };
  
  const handleGuestLogin = () => {
    // For guest login, we always need profile setup
    setNeedsProfileSetup(true);
  };
  
  const handleProfileComplete = () => {
    setNeedsProfileSetup(false);
  };
  
  const handleBackToLogin = () => {
    // Clear any existing user and navigate to login page
    console.log('Navigating back to login page');
    // Clear user from localStorage
    localStorage.removeItem('nutricare_user');
    // Force a page reload to show the login form
    window.location.href = '/';
  };
  
  const renderContent = () => {
    console.log('renderContent called, activeTab:', activeTab, 'selectedFood:', selectedFood);
    if (activeTab === 'food') {
      if (selectedFood) {
        console.log('Rendering FoodDetails component');
        return <FoodDetails food={selectedFood} onBack={handleBackToSearch} />;
      }
      console.log('Rendering FoodSearch component');
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
  
  // Show profile setup for guest users
  if (needsProfileSetup) {
    return (
      <AuthContext.Provider value={authValue}>
        <GuestProfileSetup 
          onProfileComplete={handleProfileComplete} 
          onBackToLogin={handleBackToLogin} 
        />
      </AuthContext.Provider>
    );
  }
  
  // Check if we're on the password reset page
  if (location.pathname === '/reset-password') {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';
    
    if (!token || !email) {
      // Redirect to login if no token or email
      return <Navigate to="/" />;
    }
    
    return (
      <AuthContext.Provider value={authValue}>
        <PasswordReset 
          onBackToLogin={handleBackToLogin} 
          token={token} 
          email={email} 
        />
      </AuthContext.Provider>
    );
  }
  
  return (
    <AuthContext.Provider value={authValue}>
      <StatsProvider>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80">
          <Routes>
            <Route path="/reset-password" element={<PasswordReset onBackToLogin={handleBackToLogin} token="" email="" />} />
            <Route path="/" element={
              user ? (
                <>
                  <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
                    {renderContent()}
                  </main>
                </>
              ) : (
              <ProfessionalAuthForm 
                onSuccess={handleAuthSuccess} 
                onGuestLogin={handleGuestLogin} 
              />
            )
            } />
          </Routes>
        </div>
      </StatsProvider>
    </AuthContext.Provider>
  );
}

export default App;