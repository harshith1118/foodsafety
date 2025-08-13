// Health conditions and recommendations component
import React, { useState, useEffect } from 'react';
import { Heart, Search, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { HealthCondition, FoodRecommendation } from '../../types';
import { apiService } from '../../services/api';

export const HealthConditions: React.FC = () => {
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<HealthCondition | null>(null);
  const [customCondition, setCustomCondition] = useState('');
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canConsumeFlags, setCanConsumeFlags] = useState<{ [key: number]: boolean | null }>({});
  
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
    setCanConsumeFlags({});
    
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
    
    const customConditionObj: HealthCondition = {
      id: 'custom',
      name: customCondition,
      description: 'Custom health condition',
      recommendedFoods: ['Plenty of water', 'Light soups', 'Rest and gentle foods'],
      avoidFoods: ['Heavy meals', 'Processed foods', 'Alcohol'],
      alternatives: ['Herbal teas', 'Fresh fruits', 'Vegetable broths']
    };
    
    handleConditionSelect(customConditionObj);
  };
  
  const handleCanConsumeResponse = (index: number, canConsume: boolean) => {
    setCanConsumeFlags(prev => ({ ...prev, [index]: canConsume }));
  };
  
  const resetView = () => {
    setSelectedCondition(null);
    setRecommendations([]);
    setCanConsumeFlags({});
    setCustomCondition('');
  };
  
  if (selectedCondition) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart size={24} className="text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">{selectedCondition.name}</h2>
          </div>
          <Button variant="ghost" onClick={resetView}>
            <X size={16} className="mr-2" />
            Back to Conditions
          </Button>
        </div>
        
        <Card>
          <p className="text-gray-600 mb-4">{selectedCondition.description}</p>
          <p className="text-emerald-700 bg-emerald-50 rounded-lg p-4">
            🌟 Hey there! I know you're not feeling your best right now, but we'll get you some 
            yummy and healing foods that will help you feel better soon! Let's take care of you! 💚
          </p>
        </Card>
        
        {isLoading ? (
          <Card className="text-center py-8">
            <LoadingSpinner text="Finding the perfect foods for you..." />
          </Card>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              🍯 Foods That Will Help You Feel Better
            </h3>
            
            {recommendations.map((rec, index) => (
              <Card key={index} padding="lg">
                <div className="md:flex md:items-start md:space-x-6">
                  {rec.food.imageUrl && (
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <img
                        src={rec.food.imageUrl}
                        alt={rec.food.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="md:flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{rec.food.name}</h4>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        {rec.food.calories} cal
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Why it helps:</p>
                        <p className="text-gray-900">{rec.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Recommended portion:</p>
                        <p className="text-gray-900">{rec.portionSize}</p>
                      </div>
                    </div>
                    
                    {/* Can you consume this food? */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="font-medium text-blue-900 mb-3">
                        Can you have {rec.food.name.toLowerCase()} right now? 🤔
                      </p>
                      
                      {canConsumeFlags[index] === null ? (
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            onClick={() => handleCanConsumeResponse(index, true)}
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Yes, I can!
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCanConsumeResponse(index, false)}
                          >
                            <X size={16} className="mr-2" />
                            No, I can't
                          </Button>
                        </div>
                      ) : canConsumeFlags[index] ? (
                        <div className="flex items-center text-green-700">
                          <CheckCircle size={20} className="mr-2" />
                          <span>Great choice! This will help you feel better! 🌟</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center text-orange-700">
                            <AlertCircle size={20} className="mr-2" />
                            <span>No worries! Here are some gentle alternatives:</span>
                          </div>
                          
                          {rec.alternatives && (
                            <div className="grid gap-2">
                              {rec.alternatives.map((alt, altIndex) => (
                                <div
                                  key={altIndex}
                                  className="bg-orange-50 border border-orange-200 rounded-lg p-3"
                                >
                                  <h5 className="font-medium text-orange-900">{alt.name}</h5>
                                  <p className="text-sm text-orange-800">
                                    {alt.calories} calories • Easy on your tummy 💚
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
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
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Feeling Under the Weather?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Hey there! 🤗 Not feeling your best? Let's find you some delicious and healing foods 
          that will help you feel better soon! Just tell me what's bothering you.
        </p>
      </div>
      
      {/* Common Conditions */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🌟 Common Conditions (Just pick what matches!)
        </h3>
        
        {isLoading ? (
          <LoadingSpinner text="Loading conditions..." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleConditionSelect(condition)}
                className="text-left p-4 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
              >
                <h4 className="font-medium text-gray-900 mb-1">{condition.name}</h4>
                <p className="text-sm text-gray-600">{condition.description}</p>
              </button>
            ))}
          </div>
        )}
      </Card>
      
      {/* Custom Condition */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          💬 Or tell me what's wrong in your own words
        </h3>
        <p className="text-gray-600 mb-4">
          Don't see your condition above? No problem! Just describe how you're feeling, 
          and I'll suggest some comforting foods for you! 
        </p>
        
        <div className="flex space-x-3">
          <Input
            placeholder="e.g., I have a headache, my stomach hurts, I'm feeling nauseous..."
            value={customCondition}
            onChange={(e) => setCustomCondition(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomCondition()}
            icon={<Search size={20} />}
            className="flex-1"
          />
          <Button onClick={handleCustomCondition} isLoading={isLoading}>
            Get Help
          </Button>
        </div>
      </Card>
      
      {/* Encouragement */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <div className="text-center">
          <span className="text-4xl mb-4 block">🌈</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            You're Going to Feel Better Soon!
          </h3>
          <p className="text-gray-700">
            Remember, good nutrition is one of the best medicines. Let's get you the right foods 
            to support your recovery! 💚
          </p>
        </div>
      </Card>
    </div>
  );
};