// Daily food routine planning component
import React, { useState } from 'react';
import { Calendar, Plus, Clock, Utensils, Target, TrendingUp, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { FoodItem, Meal, DailyRoutine as DailyRoutineType } from '../../types';

const mockFoodOptions: FoodItem[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 280,
    servingSize: '1 bowl',
    nutrients: {
      protein: 8,
      carbs: 45,
      fat: 6,
      fiber: 8,
      sugar: 12,
      sodium: 5,
      vitamins: { 'Vitamin C': 15, 'B Vitamins': 25 },
      minerals: { Iron: 3, Magnesium: 60 }
    },
    imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
  },
  {
    id: '2',
    name: 'Greek Yogurt with Nuts',
    calories: 220,
    servingSize: '1 cup',
    nutrients: {
      protein: 20,
      carbs: 15,
      fat: 10,
      fiber: 2,
      sugar: 12,
      sodium: 85,
      vitamins: { 'Vitamin B12': 30, 'Calcium': 200 },
      minerals: { Potassium: 200, Phosphorus: 180 }
    },
    imageUrl: 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg'
  }
];

export const DailyRoutine: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Meal[]>([
    { type: 'breakfast', foods: [], totalCalories: 0, time: '8:00 AM' },
    { type: 'lunch', foods: [], totalCalories: 0, time: '12:30 PM' },
    { type: 'dinner', foods: [], totalCalories: 0, time: '7:00 PM' },
    { type: 'snack', foods: [], totalCalories: 0, time: '3:00 PM' }
  ]);
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  });
  const [showFoodSelector, setShowFoodSelector] = useState<{ mealIndex: number; show: boolean }>({ mealIndex: -1, show: false });
  
  const mealIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  };
  
  const mealTitles = {
    breakfast: 'Breakfast',
    lunch: 'Lunch', 
    dinner: 'Dinner',
    snack: 'Snack'
  };
  
  const addFoodToMeal = (mealIndex: number, food: FoodItem) => {
    setMeals(prev => {
      const updated = [...prev];
      updated[mealIndex].foods.push(food);
      updated[mealIndex].totalCalories += food.calories;
      return updated;
    });
    setShowFoodSelector({ mealIndex: -1, show: false });
  };
  
  const removeFoodFromMeal = (mealIndex: number, foodIndex: number) => {
    setMeals(prev => {
      const updated = [...prev];
      const removedFood = updated[mealIndex].foods[foodIndex];
      updated[mealIndex].foods.splice(foodIndex, 1);
      updated[mealIndex].totalCalories -= removedFood.calories;
      return updated;
    });
  };
  
  const updateMealTime = (mealIndex: number, time: string) => {
    setMeals(prev => {
      const updated = [...prev];
      updated[mealIndex].time = time;
      return updated;
    });
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
        total.protein += food.nutrients.protein;
        total.carbs += food.nutrients.carbs;
        total.fat += food.nutrients.fat;
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
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar size={32} className="text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Daily Food Routine</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          🌟 Let's plan a perfectly balanced day of delicious, nutritious meals that will keep you energized and healthy!
        </p>
      </div>
      
      {/* Date Selector and Goals */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Plan Your Day</h3>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mb-4"
          />
          <p className="text-gray-600 text-sm">
            Planning ahead helps you make better food choices throughout the day!
          </p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Daily Goals</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Calories</label>
              <Input
                type="number"
                value={goals.calories}
                onChange={(e) => setGoals(prev => ({ ...prev, calories: Number(e.target.value) }))}
                size="sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Protein (g)</label>
              <Input
                type="number"
                value={goals.protein}
                onChange={(e) => setGoals(prev => ({ ...prev, protein: Number(e.target.value) }))}
                size="sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Carbs (g)</label>
              <Input
                type="number"
                value={goals.carbs}
                onChange={(e) => setGoals(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                size="sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fat (g)</label>
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
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Today's Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Calories', current: totalNutrition.calories, target: goals.calories, unit: 'kcal', color: 'purple' },
            { name: 'Protein', current: totalNutrition.protein, target: goals.protein, unit: 'g', color: 'red' },
            { name: 'Carbs', current: totalNutrition.carbs, target: goals.carbs, unit: 'g', color: 'blue' },
            { name: 'Fat', current: totalNutrition.fat, target: goals.fat, unit: 'g', color: 'yellow' }
          ].map((nutrient) => {
            const percentage = getProgressPercentage(nutrient.current, nutrient.target);
            return (
              <div key={nutrient.name} className="text-center">
                <div className={`text-2xl font-bold text-${nutrient.color}-600 mb-1`}>
                  {Math.round(nutrient.current)}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {nutrient.name} • {nutrient.target}{nutrient.unit} goal
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${nutrient.color}-500 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(percentage)}%</div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Meal Planning */}
      <div className="grid gap-6">
        {meals.map((meal, mealIndex) => (
          <Card key={meal.type}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{mealIcons[meal.type]}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
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
                <div className="text-sm text-gray-600">calories</div>
              </div>
            </div>
            
            {/* Foods in this meal */}
            <div className="space-y-3 mb-4">
              {meal.foods.map((food, foodIndex) => (
                <div key={foodIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {food.imageUrl && (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-600">
                      {food.calories} cal • {food.nutrients.protein}g protein • {food.servingSize}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFoodFromMeal(mealIndex, foodIndex)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              
              {meal.foods.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Utensils size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No foods planned for this meal yet</p>
                  <p className="text-sm">Add some delicious and nutritious options!</p>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFoodSelector({ mealIndex, show: true })}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Food to {mealTitles[meal.type]}
            </Button>
          </Card>
        ))}
      </div>
      
      {/* Food Selector Modal */}
      {showFoodSelector.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Food to {mealTitles[meals[showFoodSelector.mealIndex].type]}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFoodSelector({ mealIndex: -1, show: false })}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid gap-3">
              {mockFoodOptions.map((food) => (
                <button
                  key={food.id}
                  onClick={() => addFoodToMeal(showFoodSelector.mealIndex, food)}
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors text-left"
                >
                  {food.imageUrl && (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-600">
                      {food.calories} cal • {food.nutrients.protein}g protein • {food.servingSize}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {/* Tips */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          💡 Nutrition Tips for Success
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Plan your meals the night before for better choices</li>
          <li>• Include protein in every meal to stay satisfied longer</li>
          <li>• Fill half your plate with colorful vegetables</li>
          <li>• Stay hydrated - drink water throughout the day</li>
          <li>• Listen to your body's hunger and fullness cues</li>
        </ul>
      </Card>
    </div>
  );
};