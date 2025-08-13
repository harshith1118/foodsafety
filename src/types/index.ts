// Core types for the NutriCare application
export interface User {
  id: string;
  name: string;
  email: string;
  authType: 'email' | 'google' | 'guest';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  healthGoals: string[];
  preferredUnits: 'metric' | 'imperial';
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  nutrients: Nutrients;
  servingSize: string;
  dailyLimits?: DailyLimits;
  imageUrl?: string;
}

export interface Nutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: { [key: string]: number };
  minerals: { [key: string]: number };
}

export interface DailyLimits {
  maxServings: number;
  recommendedServings: number;
  warnings?: string[];
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  recommendedFoods: string[];
  avoidFoods: string[];
  alternatives: string[];
}

export interface FoodRecommendation {
  food: FoodItem;
  reason: string;
  portionSize: string;
  timing: string;
  alternatives?: FoodItem[];
}

export interface DailyRoutine {
  userId: string;
  meals: Meal[];
  totalCalories: number;
  nutritionalBalance: Nutrients;
  createdAt: Date;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  time?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}