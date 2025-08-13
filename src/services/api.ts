// API service layer for external data fetching
import { FoodItem, HealthCondition, FoodRecommendation, ApiResponse } from '../types';

// Mock data - in production, this would connect to real APIs
const mockFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Apple',
    calories: 95,
    servingSize: '1 medium apple (182g)',
    nutrients: {
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4,
      sugar: 19,
      sodium: 2,
      vitamins: { 'Vitamin C': 14, 'Vitamin K': 5 },
      minerals: { Potassium: 195, Calcium: 11 }
    },
    dailyLimits: {
      maxServings: 3,
      recommendedServings: 1,
      warnings: ['High in natural sugars - limit if diabetic']
    },
    imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg'
  },
  {
    id: '2',
    name: 'Chicken Breast',
    calories: 231,
    servingSize: '100g cooked',
    nutrients: {
      protein: 43.5,
      carbs: 0,
      fat: 5,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      vitamins: { 'Vitamin B6': 30, 'Niacin': 85 },
      minerals: { Phosphorus: 228, Selenium: 27 }
    },
    dailyLimits: {
      maxServings: 2,
      recommendedServings: 1,
      warnings: ['Ensure proper cooking to avoid foodborne illness']
    },
    imageUrl: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg'
  },
  {
    id: '3',
    name: 'Spinach',
    calories: 23,
    servingSize: '100g raw',
    nutrients: {
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      sodium: 79,
      vitamins: { 'Vitamin K': 483, 'Vitamin A': 469, 'Folate': 194 },
      minerals: { Iron: 2.7, Magnesium: 79, Potassium: 558 }
    },
    dailyLimits: {
      maxServings: 3,
      recommendedServings: 1,
      warnings: ['High in oxalates - limit if prone to kidney stones']
    },
    imageUrl: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg'
  }
];

const mockConditions: HealthCondition[] = [
  {
    id: '1',
    name: 'Common Cold',
    description: 'Viral infection affecting upper respiratory tract',
    recommendedFoods: ['Chicken soup', 'Ginger tea', 'Honey', 'Citrus fruits', 'Garlic'],
    avoidFoods: ['Dairy products', 'Processed foods', 'Alcohol', 'Caffeine'],
    alternatives: ['Bone broth', 'Herbal teas', 'Warm water with lemon', 'Steamed vegetables']
  },
  {
    id: '2',
    name: 'Fever',
    description: 'Elevated body temperature due to infection or illness',
    recommendedFoods: ['Clear broths', 'Coconut water', 'Bananas', 'Rice', 'Toast'],
    avoidFoods: ['Heavy meals', 'Spicy foods', 'Alcohol', 'Caffeinated drinks'],
    alternatives: ['Electrolyte drinks', 'Popsicles', 'Watermelon', 'Crackers']
  },
  {
    id: '3',
    name: 'Diarrhea',
    description: 'Loose, watery bowel movements',
    recommendedFoods: ['BRAT diet (Bananas, Rice, Applesauce, Toast)', 'Clear broths', 'Probiotics'],
    avoidFoods: ['Dairy', 'High-fiber foods', 'Fatty foods', 'Caffeine'],
    alternatives: ['Plain crackers', 'Boiled potatoes', 'Herbal teas', 'Electrolyte solutions']
  },
  {
    id: '4',
    name: 'Sore Throat',
    description: 'Pain or scratchiness in the throat',
    recommendedFoods: ['Honey', 'Warm broths', 'Soft foods', 'Ice cream', 'Herbal teas'],
    avoidFoods: ['Acidic foods', 'Spicy foods', 'Hard foods', 'Alcohol'],
    alternatives: ['Smoothies', 'Yogurt', 'Mashed potatoes', 'Warm milk with honey']
  }
];

class ApiService {
  // Food Recognition API (mock implementation)
  async recognizeFood(image: File): Promise<ApiResponse<FoodItem[]>> {
    await this.delay(2000); // Simulate API call
    
    // Mock recognition - in production, would use Clarifai/Google Vision
    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    
    return {
      success: true,
      data: [randomFood],
      message: 'Food recognized successfully!'
    };
  }

  // Speech to Text API (mock implementation)
  async speechToText(audioBlob: Blob): Promise<ApiResponse<string>> {
    await this.delay(1500);
    
    // Mock speech recognition
    const mockTexts = ['apple', 'chicken breast', 'spinach', 'banana', 'rice'];
    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    
    return {
      success: true,
      data: randomText,
      message: 'Speech converted successfully!'
    };
  }

  // Search food by name
  async searchFood(query: string): Promise<ApiResponse<FoodItem[]>> {
    await this.delay(800);
    
    const results = mockFoods.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      data: results,
      message: results.length > 0 ? 'Foods found!' : 'No foods found matching your search.'
    };
  }

  // Get nutrition info for specific food
  async getFoodNutrition(foodId: string): Promise<ApiResponse<FoodItem>> {
    await this.delay(500);
    
    const food = mockFoods.find(f => f.id === foodId);
    
    if (!food) {
      return {
        success: false,
        data: {} as FoodItem,
        message: 'Food not found'
      };
    }
    
    return {
      success: true,
      data: food,
      message: 'Nutrition data retrieved successfully!'
    };
  }

  // Get health conditions
  async getHealthConditions(): Promise<ApiResponse<HealthCondition[]>> {
    await this.delay(300);
    
    return {
      success: true,
      data: mockConditions,
      message: 'Health conditions loaded successfully!'
    };
  }

  // Get food recommendations for health condition
  async getFoodRecommendations(conditionId: string): Promise<ApiResponse<FoodRecommendation[]>> {
    await this.delay(1000);
    
    const condition = mockConditions.find(c => c.id === conditionId);
    
    if (!condition) {
      return {
        success: false,
        data: [],
        message: 'Condition not found'
      };
    }

    // Mock recommendations based on condition
    const recommendations: FoodRecommendation[] = condition.recommendedFoods.slice(0, 3).map((foodName, index) => ({
      food: {
        ...mockFoods[index % mockFoods.length],
        name: foodName
      },
      reason: `Helps with ${condition.name.toLowerCase()} recovery`,
      portionSize: '1 serving',
      timing: 'Throughout the day',
      alternatives: condition.alternatives.slice(0, 2).map((altName, altIndex) => ({
        ...mockFoods[altIndex % mockFoods.length],
        name: altName
      }))
    }));
    
    return {
      success: true,
      data: recommendations,
      message: 'Food recommendations generated successfully!'
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiService = new ApiService();