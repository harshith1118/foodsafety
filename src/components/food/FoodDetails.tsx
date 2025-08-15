// Food details display component
import React from 'react';
import { ArrowLeft, AlertTriangle, Info, Target, Scale, Apple } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FoodItem } from '../../types';

interface FoodDetailsProps {
  food: FoodItem;
  onBack: () => void;
}

export const FoodDetails: React.FC<FoodDetailsProps> = ({ food, onBack }) => {
  console.log('FoodDetails component rendered with food:', food);
  // Filter out nutrients with zero values to avoid showing empty data
  const macronutrients = [
    { name: 'Calories', value: food.calories, unit: 'kcal', color: 'text-purple-600' },
    { name: 'Protein', value: food.nutrients.protein, unit: 'g', color: 'text-red-600' },
    { name: 'Carbohydrates', value: food.nutrients.carbs, unit: 'g', color: 'text-blue-600' },
    { name: 'Fat', value: food.nutrients.fat, unit: 'g', color: 'text-yellow-600' },
    { name: 'Fiber', value: food.nutrients.fiber, unit: 'g', color: 'text-green-600' },
    { name: 'Sugar', value: food.nutrients.sugar, unit: 'g', color: 'text-pink-600' },
  ].filter(nutrient => nutrient.value > 0);

  const vitamins = Object.entries(food.nutrients.vitamins || {})
    .map(([name, value]) => ({
      name,
      value,
      unit: name.includes('Vitamin') ? 'mg' : '',
      color: 'text-emerald-600'
    }))
    .filter(nutrient => nutrient.value > 0);

  const minerals = Object.entries(food.nutrients.minerals || {})
    .map(([name, value]) => ({
      name,
      value,
      unit: 'mg',
      color: 'text-indigo-600'
    }))
    .filter(nutrient => nutrient.value > 0);

  const nutrientCategories = [
    {
      title: 'Macronutrients',
      nutrients: macronutrients
    },
    {
      title: 'Vitamins',
      nutrients: vitamins
    },
    {
      title: 'Minerals',
      nutrients: minerals
    }
  ].filter(category => category.nutrients.length > 0); // Only show categories that have data
  
  // Calculate % of daily values (based on a 2000 calorie diet)
  const calculateDailyPercentage = (nutrient: string, value: number): number => {
    const dailyValues: { [key: string]: number } = {
      'Protein': 50, // grams
      'Carbohydrates': 300, // grams
      'Fat': 65, // grams
      'Fiber': 25, // grams
      'Sugar': 50, // grams
      'Sodium': 2300, // mg
      // Add more as needed
    };
    
    const dailyValue = dailyValues[nutrient] || 100; // default to 100 if not found
    return Math.round((value / dailyValue) * 100);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Search
        </Button>
      </div>
      
      {/* Food Header */}
      <Card>
        <div className="md:flex md:items-start md:space-x-6">
          {food.imageUrl ? (
            <div className="md:w-1/3 mb-4 md:mb-0">
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-48 md:h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNmM2Y0ZjYiIHN0cm9rZT0iI2QxZDNkNSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItaW1hZ2UiPjxwYXRoIGQ9Ik01LjUyIDUuNTdsMTIuOTYgMTIuOTZNMjEgMTJjMCA0Ljk3LTEwIDEyLTEwIDEycy0xMC03LjAzLTEwLTEyYzAtNC45NyA0LjAzLTkgOS05IDQuOTYgMCA5IDQuMDMgOSA5eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg==';
                }}
              />
            </div>
          ) : (
            <div className="md:w-1/3 mb-4 md:mb-0 flex items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center">
                <Apple size={48} className="text-gray-400" />
              </div>
            </div>
          )}
          
          <div className="md:flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{food.name}</h1>
            <div className="bg-emerald-50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <Info size={20} className="text-emerald-600 mr-2" />
                <span className="font-medium text-emerald-900">Serving Size</span>
              </div>
              <p className="text-emerald-800">{food.servingSize}</p>
            </div>
            
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {food.calories} <span className="text-lg text-gray-600">calories</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Nutritional Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {nutrientCategories.map((category) => (
          <Card key={category.title}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h2>
            <div className="space-y-3">
              {category.nutrients.map((nutrient, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{nutrient.name}</span>
                  <span className={`font-semibold ${nutrient.color}`}>
                    {nutrient.value.toFixed(1)}{nutrient.unit}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Daily Limits */}
      {food.dailyLimits && (
        <Card>
          <div className="flex items-center mb-4">
            <Target size={20} className="text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Daily Recommendations</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-1">Recommended Daily Servings</h3>
              <p className="text-2xl font-bold text-blue-700">
                {food.dailyLimits.recommendedServings}
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-1">Maximum Daily Servings</h3>
              <p className="text-2xl font-bold text-orange-700">
                {food.dailyLimits.maxServings}
              </p>
            </div>
          </div>
          
          {food.dailyLimits.warnings && food.dailyLimits.warnings.length > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900 mb-2">Important Notes</h3>
                  <ul className="space-y-1">
                    {food.dailyLimits.warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-800 text-sm">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};