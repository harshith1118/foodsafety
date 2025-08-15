// Daily food routine planning component
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Utensils, X, Sun, Cloud, Coffee, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useStats } from '../../contexts/StatsContext';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  time?: string;
}

export const DailyRoutine: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Meal[]>([
    { type: 'breakfast', foods: [], totalCalories: 0, time: '8:00 AM' },
    { type: 'lunch', foods: [], totalCalories: 0, time: '1:00 PM' },
    { type: 'snack', foods: [], totalCalories: 0, time: '5:00 PM' },
    { type: 'dinner', foods: [], totalCalories: 0, time: '8:00 PM' }
  ]);
  
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  });
  
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: ''
  });
  
  const { incrementRoutinesPlanned, updateLastActivity } = useStats();
  const [hasTrackedActivity, setHasTrackedActivity] = useState(false);
  
  // Track when a routine is planned
  useEffect(() => {
    // Only track once per session when the user has added foods
    if (!hasTrackedActivity && meals.some(meal => meal.foods.length > 0)) {
      incrementRoutinesPlanned();
      updateLastActivity('Planned daily nutrition routine');
      setHasTrackedActivity(true);
    }
  }, [meals, hasTrackedActivity, incrementRoutinesPlanned, updateLastActivity]);
  
  const mealTitles = {
    breakfast: 'Breakfast',
    lunch: 'Lunch', 
    snack: 'Evening Snack',
    dinner: 'Dinner'
  };
  
  const mealIcons = {
    breakfast: <Sun className="text-amber-500" size={24} />,
    lunch: <Cloud className="text-blue-500" size={24} />,
    snack: <Coffee className="text-amber-700" size={24} />,
    dinner: <Moon className="text-indigo-500" size={24} />
  };
  
  const handleAddFood = (mealIndex: number) => {
    if (newFood.name.trim() !== '') {
      // Create a truly unique ID
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${mealIndex}`;
      
      const foodItem: FoodItem = {
        id: uniqueId,
        name: newFood.name,
        calories: newFood.calories ? Number(newFood.calories) : 0,
        protein: newFood.protein ? Number(newFood.protein) : 0,
        carbs: newFood.carbs ? Number(newFood.carbs) : 0,
        fat: newFood.fat ? Number(newFood.fat) : 0,
        servingSize: newFood.servingSize
      };
      
      setMeals(prevMeals => {
        const updatedMeals = [...prevMeals];
        const meal = {...updatedMeals[mealIndex]};
        
        // Add the new food item
        meal.foods = [...meal.foods, foodItem];
        
        // Recalculate total calories
        meal.totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
        
        // Update the meal in the array
        updatedMeals[mealIndex] = meal;
        
        return updatedMeals;
      });
      
      // Reset form
      setNewFood({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        servingSize: ''
      });
    }
  };
  
  const removeFoodFromMeal = (mealIndex: number, foodId: string) => {
    setMeals(prevMeals => {
      // Create a deep copy of the meals array
      const updatedMeals = JSON.parse(JSON.stringify(prevMeals));
      const meal = updatedMeals[mealIndex];
      
      // Find and remove the food item
      const foodIndex = meal.foods.findIndex((food: FoodItem) => food.id === foodId);
      
      if (foodIndex !== -1) {
        meal.foods.splice(foodIndex, 1);
        
        // Recalculate total calories
        meal.totalCalories = meal.foods.reduce((sum: number, food: FoodItem) => sum + food.calories, 0);
      }
      
      return updatedMeals;
    });
  };
  
  const updateMealTime = (mealIndex: number, time: string) => {
    setMeals(prevMeals => {
      const updatedMeals = [...prevMeals];
      updatedMeals[mealIndex].time = time;
      return updatedMeals;
    });
  };
  
  const updateNewFood = (field: string, value: string) => {
    setNewFood(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const getTotalNutrition = () => {
    const total = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    meals.forEach(meal => {
      meal.foods.forEach(food => {
        total.calories += food.calories;
        total.protein += food.protein;
        total.carbs += food.carbs;
        total.fat += food.fat;
      });
    });
    
    return total;
  };
  
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };
  
  const totalNutrition = getTotalNutrition();
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar size={40} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2 shadow-md">
              <Utensils size={16} className="text-white" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Daily Food Routine</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Plan a perfectly balanced day of delicious, nutritious meals that will keep you energized and healthy!
        </p>
      </div>
      
      {/* Date Selector and Goals */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Plan Your Day</h3>
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mb-4"
          />
          <p className="text-gray-700 text-sm">
            Planning ahead helps you make better food choices throughout the day!
          </p>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Daily Goals</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-700 mb-1">Calories</label>
              <Input
                type="number"
                value={goals.calories}
                onChange={(e) => setGoals(prev => ({ ...prev, calories: Number(e.target.value) }))}
                size="sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Protein (g)</label>
              <Input
                type="number"
                value={goals.protein}
                onChange={(e) => setGoals(prev => ({ ...prev, protein: Number(e.target.value) }))}
                size="sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Carbs (g)</label>
              <Input
                type="number"
                value={goals.carbs}
                onChange={(e) => setGoals(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                size="sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Fat (g)</label>
              <Input
                type="number"
                value={goals.fat}
                onChange={(e) => setGoals(prev => ({ ...prev, fat: Number(e.target.value) }))}
                size="sm"
              />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Progress Overview */}
      <Card className="border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <span className="text-emerald-600 text-xl">📊</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Today's Progress</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Calories', current: totalNutrition.calories, target: goals.calories, unit: 'kcal', color: 'purple' },
            { name: 'Protein', current: totalNutrition.protein, target: goals.protein, unit: 'g', color: 'red' },
            { name: 'Carbs', current: totalNutrition.carbs, target: goals.carbs, unit: 'g', color: 'blue' },
            { name: 'Fat', current: totalNutrition.fat, target: goals.fat, unit: 'g', color: 'yellow' }
          ].map((nutrient) => {
            const percentage = getProgressPercentage(nutrient.current, nutrient.target);
            const colorClasses = {
              purple: 'text-purple-600 bg-purple-500',
              red: 'text-red-600 bg-red-500',
              blue: 'text-blue-600 bg-blue-500',
              yellow: 'text-yellow-600 bg-yellow-500'
            };
            
            return (
              <div key={nutrient.name} className="text-center p-4 bg-white rounded-xl border border-gray-100">
                <div className={`text-2xl font-bold ${colorClasses[nutrient.color as keyof typeof colorClasses].split(' ')[0]} mb-1`}>
                  {Math.round(nutrient.current)}
                </div>
                <div className="text-sm text-gray-700 mb-2 font-medium">
                  {nutrient.name} • {nutrient.target}{nutrient.unit} goal
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${colorClasses[nutrient.color as keyof typeof colorClasses].split(' ')[1]} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{Math.round(percentage)}%</div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Meal Planning */}
      <div className="space-y-6">
        {meals.map((meal, mealIndex) => (
          <Card key={meal.type} className="border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  {mealIcons[meal.type]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {mealTitles[meal.type]}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <Input
                      type="time"
                      value={meal.time?.replace(/\s(AM|PM)/, '') || ''}
                      onChange={(e) => updateMealTime(mealIndex, e.target.value)}
                      className="text-sm w-24 p-1 h-auto"
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{meal.totalCalories}</div>
                <div className="text-sm text-gray-700">calories</div>
              </div>
            </div>
            
            {/* Add Food Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">Add Food</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-800 mb-1">Food Name</label>
                  <Input
                    type="text"
                    value={newFood.name}
                    onChange={(e) => updateNewFood('name', e.target.value)}
                    placeholder={
                      meal.type === 'breakfast' ? "e.g., Oats, Idli, Paratha" :
                      meal.type === 'lunch' ? "e.g., Rice, Dal, Curry" :
                      meal.type === 'snack' ? "e.g., Tea, Coffee, Nuts" :
                      "e.g., Roti, Vegetables, Soup"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-800 mb-1">Calories</label>
                  <Input
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => updateNewFood('calories', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-800 mb-1">Protein (g)</label>
                  <Input
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => updateNewFood('protein', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-800 mb-1">Carbs (g)</label>
                  <Input
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => updateNewFood('carbs', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-800 mb-1">Fat (g)</label>
                  <Input
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => updateNewFood('fat', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-800 mb-1">Serving Size (optional)</label>
                  <Input
                    type="text"
                    value={newFood.servingSize}
                    onChange={(e) => updateNewFood('servingSize', e.target.value)}
                    placeholder="e.g., 1 cup, 100g, 1 bowl"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button 
                    onClick={() => handleAddFood(mealIndex)}
                    disabled={!newFood.name.trim()}
                    className="w-full"
                    size="lg"
                  >
                    <Plus size={16} className="mr-2" />
                    Add to {mealTitles[meal.type]}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Foods in this meal */}
            <div className="space-y-3 mb-4">
              {meal.foods.map((food) => (
                <div key={food.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{food.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {food.calories > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {food.calories} cal
                        </span>
                      )}
                      {food.protein > 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {food.protein}g protein
                        </span>
                      )}
                      {food.carbs > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {food.carbs}g carbs
                        </span>
                      )}
                      {food.fat > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          {food.fat}g fat
                        </span>
                      )}
                      {food.servingSize && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {food.servingSize}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFoodFromMeal(mealIndex, food.id)}
                    className="text-gray-500 hover:text-red-500 ml-2 flex-shrink-0 p-1"
                    aria-label="Remove food"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              {meal.foods.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No foods added yet</p>
                  <p className="text-gray-500 text-sm mt-1">Add your {mealTitles[meal.type].toLowerCase()} items above</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Tips */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <span className="text-emerald-600 text-xl">🥗</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Healthy Eating Guide
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-emerald-600 font-bold text-lg">50%</div>
            <div className="text-xs text-gray-700 font-medium">Carbs</div>
            <div className="text-xs text-gray-600 mt-1">(Rice, Roti)</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-red-600 font-bold text-lg">20%</div>
            <div className="text-xs text-gray-700 font-medium">Protein</div>
            <div className="text-xs text-gray-600 mt-1">(Dal, Eggs)</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-yellow-600 font-bold text-lg">20%</div>
            <div className="text-xs text-gray-700 font-medium">Vegetables</div>
            <div className="text-xs text-gray-600 mt-1">(2 handfuls)</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-purple-600 font-bold text-lg">10%</div>
            <div className="text-xs text-gray-700 font-medium">Fats</div>
            <div className="text-xs text-gray-600 mt-1">(Oils, Ghee)</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-800">
          <p className="mb-2">💡 <span className="font-bold">Tip:</span> Fill 1/2 your plate with vegetables, 1/4 with carbs, 1/4 with protein</p>
          <p>💧 <span className="font-bold">Hydration:</span> Drink 8-10 glasses of water daily</p>
        </div>
      </Card>
    </div>
  );
};