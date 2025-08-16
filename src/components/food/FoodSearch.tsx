// Food search component with text entry approach
// Food search component with text entry approach
import React, { useState } from 'react';
import { Search, X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { FoodItem } from '../../types';
import { apiService } from '../../services/api';
import { useStats } from '../../contexts/StatsContext';

interface FoodSearchProps {
  onFoodSelected: (food: FoodItem) => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onFoodSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { incrementFoodsAnalyzed, updateLastActivity } = useStats();
  
  // Helper method to get nutrition highlights
  const getNutritionHighlights = (food: FoodItem) => {
    const highlights: string[] = [];
    const nutrients = food.nutrients;
    
    // Protein highlights
    if (nutrients.protein > 20) {
      highlights.push('High in protein - great for muscle building');
    } else if (nutrients.protein > 10) {
      highlights.push('Good source of protein');
    }
    
    // Carb highlights
    if (nutrients.carbs > 30) {
      highlights.push('High in carbohydrates - good energy source');
    } else if (nutrients.carbs < 5) {
      highlights.push('Low in carbohydrates');
    }
    
    // Fat highlights
    if (nutrients.fat > 15) {
      highlights.push('High in fat content');
    } else if (nutrients.fat < 3) {
      highlights.push('Low in fat');
    }
    
    // Fiber highlights
    if (nutrients.fiber > 5) {
      highlights.push('High in dietary fiber - aids digestion');
    } else if (nutrients.fiber > 2) {
      highlights.push('Contains beneficial fiber');
    }
    
    // Sugar highlights
    if (nutrients.sugar > 15) {
      highlights.push('High in natural sugars');
    } else if (nutrients.sugar < 2) {
      highlights.push('Low in sugar');
    }
    
    // Sodium highlights
    if (nutrients.sodium > 400) {
      highlights.push('High in sodium - consume in moderation');
    } else if (nutrients.sodium < 100) {
      highlights.push('Low in sodium');
    }
    
    // Vitamin highlights
    const vitaminC = nutrients.vitamins['Vitamin C'] || 0;
    if (vitaminC > 30) {
      highlights.push('Rich in Vitamin C - boosts immunity');
    }
    
    const vitaminA = nutrients.vitamins['Vitamin A'] || 0;
    if (vitaminA > 200) {
      highlights.push('High in Vitamin A - good for eyes');
    }
    
    // Mineral highlights
    const potassium = nutrients.minerals.Potassium || 0;
    if (potassium > 300) {
      highlights.push('Rich in potassium - heart healthy');
    }
    
    const calcium = nutrients.minerals.Calcium || 0;
    if (calcium > 100) {
      highlights.push('Good source of calcium - bone health');
    }
    
    const iron = nutrients.minerals.Iron || 0;
    if (iron > 5) {
      highlights.push('Contains iron - prevents anemia');
    }
    
    // Calorie density
    if (food.calories > 300) {
      highlights.push('Calorie dense food');
    } else if (food.calories < 100) {
      highlights.push('Low calorie density');
    }
    
    // If no specific highlights, add general ones
    if (highlights.length === 0) {
      highlights.push('Well-balanced nutrition profile');
      highlights.push('Provides essential macronutrients');
    }
    
    return highlights.slice(0, 4); // Return top 4 highlights
  };
  
  // Text search
  const handleTextSearch = async (query?: string) => {
    const searchQueryToUse = query || searchQuery;
    
    console.log('🔍 [DEBUG] handleTextSearch called with query:', searchQueryToUse);
    
    if (!searchQueryToUse.trim()) {
      console.log('⚠️ [DEBUG] Empty search query, returning early');
      return;
    }
    
    // Set the submitted search query for display in results
    setSubmittedSearchQuery(searchQueryToUse);
    
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    
    try {
      console.log('🔍 [DEBUG] Calling apiService.searchFood with:', searchQueryToUse);
      const response = await apiService.searchFood(searchQueryToUse);
      console.log('✅ [DEBUG] apiService.searchFood returned:', response);
      
      if (response.success) {
        console.log('✅ [DEBUG] Search successful, data length:', response.data.length);
        setSearchResults(response.data);
        // Update last activity when search is successful
        updateLastActivity(`Searched for "${searchQueryToUse}"`);
        incrementFoodsAnalyzed();
        // Show a message if we're using demo data
        if (response.message && response.message.includes('demo data')) {
          setError('Showing demo data. For more accurate results, try searching for specific food products.');
        }
      } else {
        console.log('❌ [DEBUG] Search failed with message:', response.message);
        setError(response.message || 'No foods found. Try searching for something else.');
      }
    } catch (error) {
      console.error('❌ [DEBUG] Search threw exception:', error);
      setError('Failed to search for foods. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearResults = () => {
    setSearchResults([]);
    setSearchQuery('');
  };
  
  const handleExampleSearch = (query: string) => {
    handleTextSearch(query);
  };
  
  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="border border-gray-200 shadow-sm">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Search className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Search by Name</h3>
                <p className="text-gray-600 text-sm md:text-base">Discover nutrition facts for any food</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="e.g., apple, chicken breast, spinach..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                  icon={<Search size={20} />}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={() => handleTextSearch()} 
                isLoading={isLoading}
                className="px-4 py-2 md:px-6 md:py-2"
                size="lg"
              >
                Search
              </Button>
            </div>
            
            {/* Search Guidance */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mt-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="font-bold text-blue-800 text-lg mb-3 flex items-center">
                    <span className="bg-blue-500 text-white rounded-lg w-6 h-6 flex items-center justify-center mr-2 text-sm">🔍</span>
                    What to Search For
                  </h4>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Whole foods:</strong> apple, banana, chicken breast, salmon</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Recipes/Dishes:</strong> chicken biryani, paneer butter masala, pasta</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Prepared foods:</strong> oatmeal, yogurt, whole grain bread</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-green-800 text-lg mb-3 flex items-center">
                    <span className="bg-green-500 text-white rounded-lg w-6 h-6 flex items-center justify-center mr-2 text-sm">💡</span>
                    What You'll Learn
                  </h4>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Complete nutrition profile (all vitamins & minerals)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Calorie content and macronutrient breakdown</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Health benefits and nutritional highlights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
            
            {/* Search Examples */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <Search size={16} className="mr-2" />
                Try searching for:
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleExampleSearch('chicken biryani')}
                  disabled={isLoading}
                  className="text-sm bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 disabled:from-gray-100 disabled:to-gray-100 text-emerald-800 disabled:text-gray-500 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  chicken biryani
                </button>
                <button 
                  onClick={() => handleExampleSearch('banana')}
                  disabled={isLoading}
                  className="text-sm bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 disabled:from-gray-100 disabled:to-gray-100 text-emerald-800 disabled:text-gray-500 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  banana
                </button>
                <button 
                  onClick={() => handleExampleSearch('paneer butter masala')}
                  disabled={isLoading}
                  className="text-sm bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 disabled:from-gray-100 disabled:to-gray-100 text-emerald-800 disabled:text-gray-500 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  paneer butter masala
                </button>
                <button 
                  onClick={() => handleExampleSearch('curry')}
                  disabled={isLoading}
                  className="text-sm bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 disabled:from-gray-100 disabled:to-gray-100 text-emerald-800 disabled:text-gray-500 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  curry
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Error Message */}
      {error && (
        <Card className="bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-center text-red-800 p-4">
            <AlertTriangle size={24} className="mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Search Error</h3>
              <p className="mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setError(null)}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <Card className="text-center py-12 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Analyzing your food...</h3>
          <p className="text-gray-600 text-lg">We're searching our database for the best nutritional information</p>
          <div className="mt-6 flex justify-center">
            <div className="w-48 bg-emerald-200 rounded-full h-2.5">
              <div className="bg-emerald-600 h-2.5 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm">
                1
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">{submittedSearchQuery}</h3>
                <p className="text-gray-600 text-sm">Search Results</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearResults} className="self-start sm:self-auto">
              <X size={16} className="mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="space-y-6">
            {searchResults.slice(0, 1).map((food) => (
                                          <Card
                key={food.id}
                padding="lg"
                className="border-2 border-emerald-200 bg-white shadow-sm"
              >
                <div className="text-center mb-6">
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{submittedSearchQuery}</h4>
                  <div className="text-lg md:text-xl font-bold text-emerald-600 bg-emerald-50 py-2 px-4 rounded-lg inline-block">
                    {food.calories} calories per {food.servingSize}
                  </div>
                </div>
                
                {/* Detailed Nutrition Information */}
                <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
                  {/* Macronutrients */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h5 className="font-bold text-blue-800 text-lg mb-3 flex items-center">
                      <span className="bg-blue-500 text-white rounded-lg w-6 h-6 flex items-center justify-center mr-2 text-sm">M</span>
                      Macronutrients
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Protein</span>
                        <span className="font-bold text-lg text-blue-900">{food.nutrients.protein.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Carbohydrates</span>
                        <span className="font-bold text-lg text-blue-900">{food.nutrients.carbs.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Fat</span>
                        <span className="font-bold text-lg text-blue-900">{food.nutrients.fat.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Fiber</span>
                        <span className="font-bold text-lg text-blue-900">{food.nutrients.fiber.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Sugar</span>
                        <span className="font-bold text-lg text-blue-900">{food.nutrients.sugar.toFixed(1)}g</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vitamins & Minerals */}
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <h5 className="font-bold text-purple-800 text-lg mb-3 flex items-center">
                        <span className="bg-purple-500 text-white rounded-lg w-6 h-6 flex items-center justify-center mr-2 text-sm">V</span>
                        Key Vitamins
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(food.nutrients.vitamins).length > 0 ? (
                          Object.entries(food.nutrients.vitamins).map(([vitamin, amount]) => (
                            <div key={vitamin} className="flex justify-between items-center bg-white bg-opacity-50 rounded-lg p-2">
                              <span className="text-purple-700 text-sm">{vitamin}</span>
                              <span className="font-bold text-purple-900">{amount.toFixed(1)}{vitamin.includes('Vitamin') ? 'mg' : ''}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-purple-600 text-sm col-span-2 text-center py-2">No significant vitamins</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                      <h5 className="font-bold text-orange-800 text-lg mb-3 flex items-center">
                        <span className="bg-orange-500 text-white rounded-lg w-6 h-6 flex items-center justify-center mr-2 text-sm">M</span>
                        Key Minerals
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(food.nutrients.minerals).length > 0 ? (
                          Object.entries(food.nutrients.minerals).map(([mineral, amount]) => (
                            <div key={mineral} className="flex justify-between items-center bg-white bg-opacity-50 rounded-lg p-2">
                              <span className="text-orange-700 text-sm">{mineral}</span>
                              <span className="font-bold text-orange-900">{amount.toFixed(1)}mg</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-orange-600 text-sm col-span-2 text-center py-2">No significant minerals</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Nutrition Highlights */}
                <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <h5 className="font-bold text-emerald-800 text-lg mb-3 flex items-center">
                    <span className="bg-emerald-500 text-white rounded-lg w-6 h-6 flex items-center justify-center mr-2 text-sm">⭐</span>
                    Nutrition Highlights
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {getNutritionHighlights(food).map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span className="text-emerald-700 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                
              </Card>
            ))}
          </div>
        </Card>
      )}
      
      {/* No Results Message */}
      {!isLoading && searchQuery.trim() !== '' && searchResults.length === 0 && !error && (
        <Card className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-5">
              <Search size={40} className="text-blue-600 mx-auto" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No foods found</h3>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            We couldn't find any foods matching "<span className="font-semibold text-blue-600">{searchQuery}</span>". 
            Try searching for something else like "apple", "chicken", or "broccoli".
          </p>
          <div className="mt-8">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 text-lg"
            >
              Clear Search
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};