// Health conditions and recommendations component
import React, { useState, useEffect } from 'react';
import { Heart, Search, X, Thermometer, Wind, Activity, Droplets, Zap, Stethoscope, Pill, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { HealthCondition, FoodRecommendation } from '../../types';
import { apiService } from '../../services/api';
import { useStats } from '../../contexts/StatsContext';

export const HealthConditions: React.FC = () => {
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<HealthCondition | null>(null);
  const [customCondition, setCustomCondition] = useState('');
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { incrementHealthQueries, updateLastActivity } = useStats();
  
  // Function to get appropriate icon for each condition
  const getConditionIcon = (conditionName: string) => {
    const name = conditionName.toLowerCase();
    
    if (name.includes('cold') || name.includes('respiratory')) {
      return <Wind className="w-6 h-6 text-blue-500" />;
    }
    
    if (name.includes('fever') || name.includes('temperature')) {
      return <Thermometer className="w-6 h-6 text-red-500" />;
    }
    
    if (name.includes('diarrhea') || name.includes('bowel')) {
      return <Droplets className="w-6 h-6 text-green-500" />;
    }
    
    if (name.includes('throat') || name.includes('sore')) {
      return <Activity className="w-6 h-6 text-purple-500" />;
    }
    
    // Default icon
    return <Heart className="w-6 h-6 text-pink-500" />;
  };
  
  useEffect(() => {
    loadConditions();
  }, []);
  
  const loadConditions = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getHealthConditions();
      setConditions(response.data);
    } catch (error) {
      console.error('Failed to load conditions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConditionSelect = async (condition: HealthCondition) => {
    setSelectedCondition(condition);
    incrementHealthQueries();
    updateLastActivity(`Checked health recommendations for "${condition.name}"`);
    
    setIsLoading(true);
    try {
      const response = await apiService.getFoodRecommendations(condition.id);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCustomCondition = async () => {
    if (!customCondition.trim()) return;
    
    // Create intelligent generic recommendations based on symptom keywords
    let recommendedFoods, avoidFoods, alternatives;
    let conditionName = customCondition;
    let description = 'Personalized health support based on your description';
    
    // Simple keyword matching to customize suggestions
    const conditionText = customCondition.toLowerCase();
    
    if (conditionText.includes('headache') || conditionText.includes('migraine')) {
      recommendedFoods = ['Ginger tea', 'Peppermint tea', 'Bananas', 'Almonds', 'Dark chocolate'];
      avoidFoods = ['Aged cheese', 'Processed meats', 'Excess caffeine', 'Alcohol'];
      alternatives = ['Warm water with lemon', 'Herbal infusions', 'Crackers', 'Rice cakes'];
      conditionName = 'Headache Relief';
    } else if (conditionText.includes('stomach') || conditionText.includes('nausea') || conditionText.includes('upset')) {
      recommendedFoods = ['Ginger tea', 'Clear broths', 'Plain rice', 'Bananas', 'Toast'];
      avoidFoods = ['Dairy products', 'Fried foods', 'Spicy items', 'Carbonated drinks'];
      alternatives = ['Peppermint tea', 'Apple sauce', 'Crackers', 'Chamomile tea'];
      conditionName = 'Stomach Comfort';
    } else if (conditionText.includes('fever') || conditionText.includes('temperature')) {
      recommendedFoods = ['Coconut water', 'Clear soups', 'Popsicles', 'Bananas', 'Herbal teas'];
      avoidFoods = ['Alcohol', 'Caffeine', 'Heavy proteins', 'Spicy foods'];
      alternatives = ['Electrolyte drinks', 'Fruit juices', 'Gelatin', 'Ice chips'];
      conditionName = 'Fever Support';
    } else if (conditionText.includes('cold') || conditionText.includes('cough')) {
      recommendedFoods = ['Chicken soup', 'Honey tea', 'Citrus fruits', 'Garlic', 'Ginger'];
      avoidFoods = ['Dairy products', 'Sugary foods', 'Alcohol', 'Caffeine'];
      alternatives = ['Ginger tea', 'Warm broths', 'Herbal infusions', 'Warm water with honey'];
      conditionName = 'Cold & Cough Relief';
    } else if (conditionText.includes('sore throat') || conditionText.includes('throat')) {
      recommendedFoods = ['Honey', 'Warm broths', 'Soft foods', 'Herbal teas', 'Popsicles'];
      avoidFoods = ['Acidic foods', 'Spicy foods', 'Hard foods', 'Alcohol'];
      alternatives = ['Smoothies', 'Mashed potatoes', 'Warm milk with honey', 'Gelatin'];
      conditionName = 'Sore Throat Comfort';
    } else if (conditionText.includes('back pain') || conditionText.includes('body ache') || conditionText.includes('muscle')) {
      recommendedFoods = ['Anti-inflammatory foods', 'Fatty fish', 'Leafy greens', 'Berries', 'Nuts'];
      avoidFoods = ['Processed foods', 'Sugary items', 'Excess salt', 'Fried foods'];
      alternatives = ['Turmeric tea', 'Green smoothies', 'Oatmeal', 'Vegetable soups'];
      conditionName = 'Muscle & Body Ache Relief';
    } else if (conditionText.includes('fatigue') || conditionText.includes('tired') || conditionText.includes('energy')) {
      recommendedFoods = ['Iron-rich foods', 'Complex carbs', 'Protein', 'Fresh fruits', 'Nuts'];
      avoidFoods = ['Sugar crashes', 'Heavy meals', 'Excess caffeine', 'Processed snacks'];
      alternatives = ['Green tea', 'Fresh fruit', 'Nut butters', 'Whole grain crackers'];
      conditionName = 'Energy Boost';
    } else {
      // Generic recommendations for any other condition with a gentle message
      recommendedFoods = ['Warm water', 'Light broths', 'Fresh fruits', 'Vegetables', 'Lean proteins'];
      avoidFoods = ['Processed foods', 'Heavy meals', 'Excess sugar', 'Alcohol'];
      alternatives = ['Herbal teas', 'Vegetable soups', 'Bananas', 'Plain crackers'];
      conditionName = customCondition;
      description = "While I don't have specific information for this condition, here are some generally beneficial foods that might help you feel better. Please consult with a healthcare professional for personalized advice.";
    }
    
    const customConditionObj: HealthCondition = {
      id: 'custom',
      name: conditionName,
      description: description,
      recommendedFoods,
      avoidFoods,
      alternatives
    };
    
    handleConditionSelect(customConditionObj);
  };
  
  const resetView = () => {
    setSelectedCondition(null);
    setRecommendations([]);
    setCustomCondition('');
  };
  
  if (selectedCondition) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Pill size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedCondition.name}</h2>
              <p className="text-gray-700 text-sm sm:text-base">Personalized food recommendations</p>
            </div>
          </div>
          <Button variant="ghost" onClick={resetView} className="self-start sm:self-auto">
            <X size={16} className="mr-2" />
            Back to Conditions
          </Button>
        </div>
        
        <Card className="border border-gray-200 shadow-sm">
          <p className="text-gray-700 mb-4">{selectedCondition.description}</p>
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 border border-emerald-100">
            <p className="text-emerald-700">
              {selectedCondition.id === 'custom' && !selectedCondition.description.includes('Personalized health support') 
                ? "🌟 These are general food suggestions that may help. Remember to listen to your body and consult with a healthcare professional for persistent or serious symptoms. Let's take care of you with love! 💚" 
                : "🌟 Hey there! I know you're not feeling your best right now, but we'll get you some yummy and healing foods that will help you feel better soon! Let's take care of you with love! 💚"}
            </p>
          </div>
        </Card>
        
        {isLoading ? (
          <Card className="text-center py-8 border border-gray-200 shadow-sm">
            <LoadingSpinner text="Finding the perfect foods for you..." />
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Pill size={20} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Healing Foods Just for You
              </h3>
            </div>
            
            {recommendations.map((rec, index) => (
              <Card key={index} padding="lg" className="border border-gray-200 shadow-sm">
                <div className="md:flex md:items-start md:space-x-6">
                  <div className="md:flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{rec.food.name}</h4>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        {rec.food.calories} cal
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-blue-600 mb-1 font-medium">✨ Why it helps:</p>
                        <p className="text-gray-800">{rec.reason}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <p className="text-sm text-purple-600 mb-1 font-medium">🍽️ Recommended portion:</p>
                        <p className="text-gray-800">{rec.portionSize}</p>
                      </div>
                    </div>
                    
                    {/* Vitamin Information */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100 mb-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">🍊</span>
                        <h5 className="text-lg font-bold text-yellow-800">Vitamin & Nutrient Profile</h5>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(rec.food.nutrients.vitamins).map(([vitamin, amount]) => (
                          <div key={vitamin} className="bg-white bg-opacity-70 rounded-lg p-2 text-center border border-yellow-100">
                            <div className="text-xs font-medium text-yellow-700">{vitamin}</div>
                            <div className="text-sm font-bold text-yellow-900">{amount.toFixed(1)}{vitamin.includes('Vitamin') ? 'mg' : ''}</div>
                          </div>
                        ))}
                        {Object.entries(rec.food.nutrients.minerals).slice(0, 3).map(([mineral, amount]) => (
                          <div key={mineral} className="bg-white bg-opacity-70 rounded-lg p-2 text-center border border-orange-100">
                            <div className="text-xs font-medium text-orange-700">{mineral}</div>
                            <div className="text-sm font-bold text-orange-900">{amount.toFixed(1)}mg</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Gentle alternatives */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">🍯</span>
                        <h5 className="text-lg font-bold text-orange-800">Gentle Alternatives</h5>
                      </div>
                      <p className="text-orange-700 mb-3">If you're not ready for this yet, try these soothing options:</p>
                      
                      {rec.alternatives && (
                        <div className="grid gap-3 md:grid-cols-2">
                          {rec.alternatives.map((alt, altIndex) => (
                            <div
                              key={altIndex}
                              className="bg-white border border-orange-200 rounded-lg p-3 shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <h6 className="font-medium text-orange-900">{alt.name}</h6>
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  {alt.calories} cal
                                </span>
                              </div>
                              <div className="mt-2">
                                <div className="text-xs text-gray-600 mb-1">Key nutrients:</div>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(alt.nutrients.vitamins).slice(0, 2).map(([vitamin, amount]) => (
                                    <span key={vitamin} className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0.5 rounded">
                                      {vitamin}: {amount.toFixed(1)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-orange-600 mt-1">Easy on your tummy 💚</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Stethoscope size={32} className="text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Feeling Under the Weather?
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We've got your back with gentle, nourishing food suggestions that can help you feel better. 
            Let's find some comforting options together! 💚
          </p>
        </div>
      </div>
      
      {/* Common Conditions */}
      <Card className="border-2 border-gray-200 shadow-sm p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left space-x-0 sm:space-x-3 gap-4 sm:gap-0 mb-6">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Zap className="text-emerald-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Common Conditions
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">Just pick what matches your symptoms</p>
          </div>
        </div>
        
        {isLoading ? (
          <LoadingSpinner text="Loading conditions..." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleConditionSelect(condition)}
                className="flex items-start p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-left w-full border border-gray-100 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex-shrink-0 mt-1 p-3 bg-gray-100 rounded-xl">
                  {getConditionIcon(condition.name)}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    {condition.name}
                  </h4>
                  <p className="text-gray-700 text-sm">{condition.description}</p>
                </div>
                <div className="flex-shrink-0 ml-2 text-gray-400">
                  <Zap size={20} />
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
      
      {/* Custom Condition */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start space-x-0 sm:space-x-4 gap-4 sm:gap-0">
          <div className="bg-purple-100 rounded-xl p-3 flex-shrink-0">
            <span className="text-2xl">💬</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-800 mb-5">
              No worries! Just tell me how you're feeling in your own words, and I'll suggest some 
              comforting foods that might help. I'm here to support you! 💚
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-white bg-opacity-70 text-purple-800 text-xs px-3 py-1 rounded-full">
                  🤕 Headache
                </span>
                <span className="bg-white bg-opacity-70 text-purple-800 text-xs px-3 py-1 rounded-full">
                  🤢 Nausea
                </span>
                <span className="bg-white bg-opacity-70 text-purple-800 text-xs px-3 py-1 rounded-full">
                  😩 Fatigue
                </span>
                <span className="bg-white bg-opacity-70 text-purple-800 text-xs px-3 py-1 rounded-full">
                  🥴 Dizziness
                </span>
                <span className="bg-white bg-opacity-70 text-purple-800 text-xs px-3 py-1 rounded-full">
                  🌡️ Fever
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Input
                  placeholder="Describe how you're feeling... (e.g., upset stomach, body aches, etc.)"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomCondition()}
                  icon={<Search size={20} />}
                  className="flex-1"
                />
                <Button onClick={handleCustomCondition} isLoading={isLoading} className="w-full sm:w-auto">
                  Get Suggestions
                </Button>
              </div>
              
              <p className="text-xs text-gray-600 mt-2">
                💡 Tip: Be as specific as you can! The more details you share, the better I can help.
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Encouragement */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start space-x-0 sm:space-x-4 gap-4 sm:gap-0">
          <div className="bg-emerald-100 rounded-xl p-3 flex-shrink-0">
            <span className="text-2xl">🌈</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-lg font-bold text-gray-900 mb-3">
              Remember, You're Doing Great! 🌟
            </h3>
            <p className="text-gray-800 mb-3">
              Taking care of yourself is an act of self-love. Every small step you take toward feeling 
              better matters. You're stronger than you know, and brighter days are ahead! 💪✨
            </p>
            <p className="text-gray-700 text-sm italic">
              "The best doctor is sunshine, sleep, and love." - Unknown
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};