import axios from 'axios';
import { FoodItem, HealthCondition, FoodRecommendation, ApiResponse, Nutrients } from '../types';

// USDA API configuration (alternative free API)
// const USDA_API_KEY = 'DEMO_KEY'; // USDA demo key - replace with your own for production
// const USDA_FOOD_SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

// Mock foods data
const mockFoods: FoodItem[] = [
  {
    id: 'mf-1',
    name: 'Apple',
    calories: 52,
    nutrients: {
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
      sodium: 1,
      vitamins: { 'Vitamin C': 4.6, 'Vitamin A': 3, 'Vitamin E': 0.2 },
      minerals: { Potassium: 107, Calcium: 6, Iron: 0.1 }
    },
    servingSize: '100g',
    imageUrl: ''
  },
  {
    id: 'mf-2',
    name: 'Banana',
    calories: 89,
    nutrients: {
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
      vitamins: { 'Vitamin C': 8.7, 'Vitamin B6': 0.4, 'Folate': 20 },
      minerals: { Potassium: 358, Magnesium: 27, Calcium: 5 }
    },
    servingSize: '100g',
    imageUrl: ''
  },
  {
    id: 'mf-3',
    name: 'Chicken Breast',
    calories: 165,
    nutrients: {
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      vitamins: { 'Vitamin B6': 0.6, 'Niacin': 14.8, 'Vitamin B12': 0.3 },
      minerals: { Potassium: 256, Phosphorus: 228, Selenium: 27 }
    },
    servingSize: '100g',
    imageUrl: ''
  },
  {
    id: 'mf-4',
    name: 'Broccoli',
    calories: 34,
    nutrients: {
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.7,
      sodium: 33,
      vitamins: { 'Vitamin C': 89.2, 'Vitamin K': 92.5, 'Folate': 63 },
      minerals: { Potassium: 316, Calcium: 47, Iron: 0.7 }
    },
    servingSize: '100g',
    imageUrl: ''
  },
  {
    id: 'mf-5',
    name: 'Salmon',
    calories: 208,
    nutrients: {
      protein: 20,
      carbs: 0,
      fat: 13,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      vitamins: { 'Vitamin D': 12.5, 'Vitamin B12': 3.2, 'Niacin': 7.1 },
      minerals: { Potassium: 363, Phosphorus: 252, Selenium: 36 }
    },
    servingSize: '100g',
    imageUrl: ''
  }
];

// Mock data - for health conditions and recommendations
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
    recommendedFoods: ['Honey', 'Warm broths', 'Soft foods', 'Herbal teas'],
    avoidFoods: ['Acidic foods', 'Spicy foods', 'Hard foods', 'Alcohol'],
    alternatives: ['Smoothies', 'Yogurt', 'Mashed potatoes', 'Warm milk with honey']
  }
];

class ApiService {
  // Food search using multiple free APIs with proper rate limiting and fallbacks
  async searchFood(query: string): Promise<ApiResponse<FoodItem[]>> {
    const normalizedQuery = query.toLowerCase().trim();
    
    console.log('🔍 [FoodSearch] Searching for:', normalizedQuery);
    
    // Try USDA API first (most comprehensive data)
    try {
      console.log('📡 [USDA] Attempting search...');
      const result = await this.searchUSDA(normalizedQuery);
      if (result.success && result.data.length > 0) {
        return result;
      }
    } catch (error) {
      console.log('⚠️ [USDA] Failed, trying next API...', error);
    }
    
    // Try Open Food Facts API
    try {
      console.log('📡 [OpenFoodFacts] Attempting search...');
      const result = await this.searchOpenFoodFacts(normalizedQuery);
      if (result.success && result.data.length > 0) {
        return result;
      }
    } catch (error) {
      console.log('⚠️ [OpenFoodFacts] Failed, using fallback...', error);
    }
    
    // Final fallback to comprehensive mock data for common foods
    console.log('📱 [MOCK] Using comprehensive mock data');
    return this.getComprehensiveMockData(normalizedQuery);
  }
  
  // USDA FoodData Central API search
  private async searchUSDA(query: string): Promise<ApiResponse<FoodItem[]>> {
    try {
      // Add delay to respect rate limits
      await this.delay(1000);
      
      // Try to find raw/whole foods first for better nutrition data
      const searchTerms = `raw ${query}`;
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchTerms)}&pageSize=5&api_key=DEMO_KEY`;
      
      console.log('📡 [USDA] Making request to:', url);
      
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.status === 429) {
        throw new Error('USDA API rate limit exceeded');
      }
      
      console.log('✅ [USDA] Response status:', response.status);
      
      // Check if we have a valid response with foods
      if (response.data && Array.isArray(response.data.foods) && response.data.foods.length > 0) {
        console.log('✅ [USDA] Found', response.data.foods.length, 'foods');
        
        const foodItems: FoodItem[] = [];
        
        // Process foods
        for (const food of response.data.foods) {
          try {
            // Skip if no food description
            if (!food.description) {
              continue;
            }
            
            // Extract nutrition data from USDA format
            const nutrients: Nutrients = {
              protein: 0,
              carbs: 0,
              fat: 0,
              fiber: 0,
              sugar: 0,
              sodium: 0,
              vitamins: {},
              minerals: {}
            };
            
            let calories = 0;
            const servingSize = '100g';
            
            // Process all nutrients
            if (Array.isArray(food.foodNutrients)) {
              for (const foodNutrient of food.foodNutrients) {
                // USDA API structure: foodNutrient has direct properties
                const nutrientName = foodNutrient.nutrientName || '';
                const value = parseFloat(foodNutrient.value) || 0;
                const unit = foodNutrient.unitName || '';
                
                // Skip if value is 0 or negative
                if (value <= 0) {
                  continue;
                }
                
                // Macronutrients
                if (nutrientName.includes('Protein')) {
                  nutrients.protein = value;
                } else if (nutrientName.includes('Carbohydrate') && nutrientName.includes('difference')) {
                  nutrients.carbs = value;
                } else if (nutrientName.includes('Total lipid') || nutrientName.includes('fat')) {
                  nutrients.fat = value;
                } else if (nutrientName.includes('Fiber')) {
                  nutrients.fiber = value;
                } else if (nutrientName.includes('Sugars') && !nutrientName.includes('added')) {
                  nutrients.sugar = value;
                } else if (nutrientName.includes('Sodium')) {
                  nutrients.sodium = value;
                } else if (nutrientName.includes('Energy') && unit === 'KCAL') {
                  calories = value;
                }
                // Vitamins
                else if (nutrientName.includes('Vitamin C') || nutrientName.includes('Ascorbic acid')) {
                  nutrients.vitamins['Vitamin C'] = value;
                } else if (nutrientName.includes('Vitamin A') && !nutrientName.includes('IU')) {
                  nutrients.vitamins['Vitamin A'] = value;
                } else if (nutrientName.includes('Vitamin E')) {
                  nutrients.vitamins['Vitamin E'] = value;
                } else if (nutrientName.includes('Vitamin D')) {
                  nutrients.vitamins['Vitamin D'] = value;
                } else if (nutrientName.includes('Vitamin K')) {
                  nutrients.vitamins['Vitamin K'] = value;
                } else if (nutrientName.includes('Thiamin') || nutrientName.includes('Vitamin B1')) {
                  nutrients.vitamins['Vitamin B1'] = value;
                } else if (nutrientName.includes('Riboflavin') || nutrientName.includes('Vitamin B2')) {
                  nutrients.vitamins['Vitamin B2'] = value;
                } else if (nutrientName.includes('Niacin') || nutrientName.includes('Vitamin B3')) {
                  nutrients.vitamins['Vitamin B3'] = value;
                } else if (nutrientName.includes('Vitamin B6')) {
                  nutrients.vitamins['Vitamin B6'] = value;
                } else if (nutrientName.includes('Folate') && !nutrientName.includes('DFE') && !nutrientName.includes('food')) {
                  nutrients.vitamins['Folate'] = value;
                } else if (nutrientName.includes('Vitamin B12')) {
                  nutrients.vitamins['Vitamin B12'] = value;
                } else if (nutrientName.includes('Pantothenic')) {
                  nutrients.vitamins['Pantothenic Acid'] = value;
                } else if (nutrientName.includes('Biotin') || nutrientName.includes('Vitamin B7')) {
                  nutrients.vitamins['Biotin'] = value;
                }
                // Minerals
                else if (nutrientName.includes('Calcium')) {
                  nutrients.minerals['Calcium'] = value;
                } else if (nutrientName.includes('Iron')) {
                  nutrients.minerals['Iron'] = value;
                } else if (nutrientName.includes('Magnesium')) {
                  nutrients.minerals['Magnesium'] = value;
                } else if (nutrientName.includes('Phosphorus')) {
                  nutrients.minerals['Phosphorus'] = value;
                } else if (nutrientName.includes('Potassium')) {
                  nutrients.minerals['Potassium'] = value;
                } else if (nutrientName.includes('Zinc')) {
                  nutrients.minerals['Zinc'] = value;
                } else if (nutrientName.includes('Copper')) {
                  nutrients.minerals['Copper'] = value;
                } else if (nutrientName.includes('Manganese')) {
                  nutrients.minerals['Manganese'] = value;
                } else if (nutrientName.includes('Selenium')) {
                  nutrients.minerals['Selenium'] = value;
                } else if (nutrientName.includes('Fluoride')) {
                  nutrients.minerals['Fluoride'] = value;
                } else if (nutrientName.includes('Iodine')) {
                  nutrients.minerals['Iodine'] = value;
                }
              }
            }
            
            // Fallback calories calculation if not provided
            if (calories === 0) {
              calories = Math.round(
                (nutrients.protein * 4) + 
                (nutrients.carbs * 4) + 
                (nutrients.fat * 9)
              );
            }
            
            const foodItem: FoodItem = {
              id: `usda-${food.fdcId || Date.now()}-${foodItems.length}`,
              name: food.description,
              calories: calories,
              nutrients: nutrients,
              servingSize: servingSize,
              imageUrl: ''
            };
            
            // Add item if it has a valid name
            if (foodItem.name && foodItem.name.trim() !== '') {
              foodItems.push(foodItem);
            }
          } catch (processError) {
            console.error('❌ [USDA] Error processing food:', processError);
          }
        }
        
        console.log('✅ [USDA] Successfully processed', foodItems.length, 'food items');
        
        // Return results if we have any
        if (foodItems.length > 0) {
          console.log('✅ [USDA] Returning', foodItems.length, 'food items');
          return {
            success: true,
            data: foodItems,
            message: `Found ${foodItems.length} food item(s)!`
          };
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 429) {
        console.log('⚠️ [USDA] Rate limit exceeded, will try other APIs');
        throw new Error('Rate limit exceeded');
      }
      console.error('❌ [USDA] API Error:', (error as Error).message);
      throw error;
    }
    
    return {
      success: false,
      data: [],
      message: 'No foods found in USDA database'
    };
  }
  
  // Open Food Facts API search
  private async searchOpenFoodFacts(query: string): Promise<ApiResponse<FoodItem[]>> {
    try {
      // Add delay to respect rate limits
      await this.delay(500);
      
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=10`;
      
      console.log('📡 [OpenFoodFacts] Making request to:', url);
      
      const response = await axios.get(url, { timeout: 10000 });
      
      console.log('✅ [OpenFoodFacts] Response status:', response.status);
      
      // Check if we have a valid response with products
      if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
        console.log('✅ [OpenFoodFacts] Found', response.data.products.length, 'products');
        
        const foodItems: FoodItem[] = [];
        
        // Process all products
        for (const product of response.data.products) {
          try {
            // Skip if no product name
            if (!product.product_name && !product.generic_name) {
              continue;
            }
            
            // Extract nutrition data with better error handling
            const nutriments = product.nutriments || {};
            
            // Extract ALL available vitamins and minerals from nutriments
            const nutrients: Nutrients = {
              protein: parseFloat(nutriments.proteins_100g) || 0,
              carbs: parseFloat(nutriments.carbohydrates_100g) || 0,
              fat: parseFloat(nutriments.fat_100g) || 0,
              fiber: parseFloat(nutriments.fiber_100g) || 0,
              sugar: parseFloat(nutriments.sugars_100g) || 0,
              sodium: parseFloat(nutriments.sodium_100g) || 0,
              vitamins: {},
              minerals: {}
            };
            
            // Extract all vitamin data from nutriments
            for (const key in nutriments) {
              if (key.includes('vitamin') || key.includes('Vitamin') || 
                  key.includes('folate') || key.includes('Folate') ||
                  key.includes('niacin') || key.includes('Niacin') ||
                  key.includes('pantothenic') || key.includes('Pantothenic') ||
                  key.includes('biotin') || key.includes('Biotin')) {
                // Convert key to readable format
                let vitaminName = key.replace(/[_-]/g, ' ')
                                    .replace(/100g/g, '')
                                    .replace(/unit/g, '')
                                    .replace(/value/g, '')
                                    .trim();
                
                // Capitalize first letter of each word
                vitaminName = vitaminName.split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ').trim();
                
                // Remove extra spaces and clean up
                vitaminName = vitaminName.replace(/\s+/g, ' ').trim();
                
                if (vitaminName) {
                  const value = parseFloat(nutriments[key]);
                  if (!isNaN(value) && value > 0) {
                    nutrients.vitamins[vitaminName] = value;
                  }
                }
              }
            }
            
            // Extract all mineral data from nutriments
            for (const key in nutriments) {
              if ((key.includes('calcium') || key.includes('Calcium') ||
                   key.includes('iron') || key.includes('Iron') ||
                   key.includes('magnesium') || key.includes('Magnesium') ||
                   key.includes('phosphorus') || key.includes('Phosphorus') ||
                   key.includes('potassium') || key.includes('Potassium') ||
                   key.includes('zinc') || key.includes('Zinc') ||
                   key.includes('copper') || key.includes('Copper') ||
                   key.includes('manganese') || key.includes('Manganese') ||
                   key.includes('fluoride') || key.includes('Fluoride') ||
                   key.includes('selenium') || key.includes('Selenium') ||
                   key.includes('chromium') || key.includes('Chromium') ||
                   key.includes('molybdenum') || key.includes('Molybdenum') ||
                   key.includes('iodine') || key.includes('Iodine')) && 
                  !key.includes('unit') && !key.includes('value') && key.includes('100g')) {
                // Convert key to readable format
                let mineralName = key.replace(/[_-]/g, ' ')
                                    .replace(/100g/g, '')
                                    .replace(/unit/g, '')
                                    .replace(/value/g, '')
                                    .trim();
                
                // Capitalize first letter
                mineralName = mineralName.charAt(0).toUpperCase() + mineralName.slice(1).toLowerCase();
                mineralName = mineralName.trim();
                
                if (mineralName) {
                  const value = parseFloat(nutriments[key]);
                  if (!isNaN(value) && value > 0) {
                    nutrients.minerals[mineralName] = value;
                  }
                }
              }
            }
            
            // Calculate calories if not provided
            let calories = 0;
            if (nutriments['energy-kcal_100g']) {
              calories = parseFloat(nutriments['energy-kcal_100g']);
            } else if (nutriments.energy_100g) {
              calories = parseFloat(nutriments.energy_100g);
            } else if (nutriments.energy_value) {
              calories = parseFloat(nutriments.energy_value);
            }
            
            // Fallback calculation if still 0
            if (calories === 0) {
              calories = Math.round(
                (nutrients.protein * 4) + 
                (nutrients.carbs * 4) + 
                (nutrients.fat * 9)
              );
            }
            
            const foodItem: FoodItem = {
              id: `off-${product.code || Date.now()}-${foodItems.length}`,
              name: product.product_name || product.generic_name || query,
              calories: calories,
              nutrients: nutrients,
              servingSize: product.serving_size || '100g',
              imageUrl: product.image_url || ''
            };
            
            // Add item if it has a valid name
            if (foodItem.name && foodItem.name.trim() !== '') {
              foodItems.push(foodItem);
            }
          } catch (processError) {
            console.error('❌ [OpenFoodFacts] Error processing product:', processError);
          }
        }
        
        console.log('✅ [OpenFoodFacts] Successfully processed', foodItems.length, 'food items');
        
        // Return results if we have any
        if (foodItems.length > 0) {
          console.log('✅ [OpenFoodFacts] Returning', foodItems.length, 'food items');
          return {
            success: true,
            data: foodItems,
            message: `Found ${foodItems.length} food item(s)!`
          };
        }
      }
    } catch (error) {
      console.error('❌ [OpenFoodFacts] API Error:', (error as Error).message);
    }
    
    return {
      success: false,
      data: [],
      message: 'No foods found in OpenFoodFacts database'
    };
  }
  
  // Comprehensive mock data for common foods (no API calls)
  private getComprehensiveMockData(query: string): ApiResponse<FoodItem[]> {
    const comprehensiveMockFoods: { [key: string]: FoodItem } = {
      'apple': {
        id: 'mock-apple',
        name: 'Apple',
        calories: 52,
        nutrients: {
          protein: 0.3,
          carbs: 14,
          fat: 0.2,
          fiber: 2.4,
          sugar: 10,
          sodium: 1,
          vitamins: { 
            'Vitamin C': 4.6, 
            'Vitamin A': 3, 
            'Vitamin E': 0.2,
            'Vitamin K': 2.2,
            'Folate': 3
          },
          minerals: { 
            Potassium: 107, 
            Calcium: 6, 
            Iron: 0.1,
            Magnesium: 5,
            Phosphorus: 11,
            Zinc: 0.04
          }
        },
        servingSize: '100g',
        imageUrl: ''
      },
      'banana': {
        id: 'mock-banana',
        name: 'Banana',
        calories: 89,
        nutrients: {
          protein: 1.1,
          carbs: 23,
          fat: 0.3,
          fiber: 2.6,
          sugar: 12,
          sodium: 1,
          vitamins: { 
            'Vitamin C': 8.7, 
            'Vitamin B6': 0.4, 
            'Folate': 20,
            'Vitamin A': 3,
            'Vitamin E': 0.1,
            'Vitamin K': 0.5
          },
          minerals: { 
            Potassium: 358, 
            Magnesium: 27, 
            Calcium: 5,
            Iron: 0.3,
            Phosphorus: 22,
            Zinc: 0.2
          }
        },
        servingSize: '100g',
        imageUrl: ''
      },
      'chicken': {
        id: 'mock-chicken',
        name: 'Chicken Breast',
        calories: 165,
        nutrients: {
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
          sugar: 0,
          sodium: 74,
          vitamins: { 
            'Vitamin B6': 0.6, 
            'Niacin': 14.8, 
            'Vitamin B12': 0.3,
            'Vitamin A': 9,
            'Vitamin E': 0.3,
            'Folate': 6
          },
          minerals: { 
            Potassium: 256, 
            Phosphorus: 228, 
            Selenium: 27,
            Iron: 0.7,
            Zinc: 1.1,
            Magnesium: 25,
            Calcium: 11
          }
        },
        servingSize: '100g',
        imageUrl: ''
      },
      'salmon': {
        id: 'mock-salmon',
        name: 'Salmon',
        calories: 208,
        nutrients: {
          protein: 20,
          carbs: 0,
          fat: 13,
          fiber: 0,
          sugar: 0,
          sodium: 59,
          vitamins: { 
            'Vitamin D': 12.5, 
            'Vitamin B12': 3.2, 
            'Niacin': 7.1,
            'Vitamin B6': 0.6,
            'Vitamin A': 27,
            'Vitamin E': 1.1,
            'Folate': 14
          },
          minerals: { 
            Potassium: 363, 
            Phosphorus: 252, 
            Selenium: 36,
            Iron: 0.3,
            Zinc: 0.6,
            Magnesium: 27,
            Calcium: 12
          }
        },
        servingSize: '100g',
        imageUrl: ''
      },
      'broccoli': {
        id: 'mock-broccoli',
        name: 'Broccoli',
        calories: 34,
        nutrients: {
          protein: 2.8,
          carbs: 7,
          fat: 0.4,
          fiber: 2.6,
          sugar: 1.7,
          sodium: 33,
          vitamins: { 
            'Vitamin C': 89.2, 
            'Vitamin K': 92.5, 
            'Folate': 63,
            'Vitamin A': 31,
            'Vitamin E': 0.8,
            'Vitamin B6': 0.2
          },
          minerals: { 
            Potassium: 316, 
            Calcium: 47, 
            Iron: 0.7,
            Magnesium: 21,
            Phosphorus: 66,
            Zinc: 0.4
          }
        },
        servingSize: '100g',
        imageUrl: ''
      },
      'curry': {
        id: 'mock-curry',
        name: 'Chicken Curry',
        calories: 180,
        nutrients: {
          protein: 12,
          carbs: 8,
          fat: 10,
          fiber: 2,
          sugar: 3,
          sodium: 450,
          vitamins: { 
            'Vitamin A': 200, 
            'Vitamin C': 8,
            'Vitamin B6': 0.3,
            'Folate': 12
          },
          minerals: { 
            Iron: 2, 
            Calcium: 40, 
            Potassium: 250,
            Magnesium: 25,
            Phosphorus: 95,
            Zinc: 1.2
          }
        },
        servingSize: '100g',
        imageUrl: ''
      },
      'biryani': {
        id: 'mock-biryani',
        name: 'Chicken Biryani',
        calories: 150,
        nutrients: {
          protein: 8,
          carbs: 25,
          fat: 3,
          fiber: 1,
          sugar: 1,
          sodium: 350,
          vitamins: { 
            'Vitamin B6': 0.2, 
            'Folate': 8,
            'Vitamin A': 15,
            'Vitamin E': 0.4
          },
          minerals: { 
            Iron: 1, 
            Calcium: 20, 
            Potassium: 120,
            Magnesium: 15,
            Phosphorus: 65,
            Zinc: 0.8
          }
        },
        servingSize: '100g',
        imageUrl: ''
      },
      'paneer': {
        id: 'mock-paneer',
        name: 'Paneer Butter Masala',
        calories: 220,
        nutrients: {
          protein: 10,
          carbs: 8,
          fat: 18,
          fiber: 0,
          sugar: 6,
          sodium: 400,
          vitamins: { 
            'Vitamin A': 150, 
            'Vitamin B12': 0.5,
            'Vitamin B2': 0.3,
            'Folate': 6
          },
          minerals: { 
            Calcium: 200, 
            Iron: 1, 
            Zinc: 1,
            Phosphorus: 120,
            Magnesium: 15,
            Potassium: 110
          }
        },
        servingSize: '100g',
        imageUrl: ''
      }
    };
    
    // Check for comprehensive fallbacks first
    for (const [key, foodItem] of Object.entries(comprehensiveMockFoods)) {
      if (query.includes(key)) {
        console.log('📱 [MOCK] Using comprehensive mock food for:', key);
        return {
          success: true,
          data: [foodItem],
          message: `Showing results for "${foodItem.name}" (comprehensive mock data)`
        };
      }
    }
    
    // Fallback to generic mock food for any query
    console.log('📱 [MOCK] Using generic mock food for:', query);
    const mockFoodsResult: FoodItem[] = [
      {
        id: 'mock-1',
        name: query.charAt(0).toUpperCase() + query.slice(1),
        calories: 200,
        nutrients: {
          protein: 10,
          carbs: 30,
          fat: 5,
          fiber: 2,
          sugar: 8,
          sodium: 100,
          vitamins: { 'Vitamin C': 10, 'Vitamin A': 150 },
          minerals: { Iron: 2, Calcium: 50, Potassium: 200 }
        },
        servingSize: '100g',
        imageUrl: ''
      }
    ];
    
    return {
      success: true,
      data: mockFoodsResult,
      message: `Showing results for "${query}" (comprehensive mock data)`
    };
  }
  
  // Get nutrition info for specific food
  async getFoodNutrition(foodId: string): Promise<ApiResponse<FoodItem>> {
    // Create a timeout promise
    const timeoutPromise = new Promise<ApiResponse<FoodItem>>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000); // 5 second timeout
    });
    
    try {
      await Promise.race([
        this.delay(500),
        timeoutPromise
      ]);
      
      // If it's an Edamam food ID, we need to search for it again
      if (foodId.startsWith('edamam-')) {
        // In a real implementation, we would store the search query or use the food URI
        // For now, we'll return a generic response
        return {
          success: false,
          data: {} as FoodItem,
          message: 'Detailed nutrition data not available for this food item.'
        };
      }
      
      // For mock data, return the existing implementation
      return {
        success: false,
        data: {} as FoodItem,
        message: 'Detailed nutrition data not available for this food item.'
      };
    } catch (error) {
      if ((error as Error).message === 'Request timeout') {
        return {
          success: false,
          data: {} as FoodItem,
          message: 'Request timed out. Please try again.'
        };
      }
      
      return {
        success: false,
        data: {} as FoodItem,
        message: 'Failed to load nutrition data. Please try again.'
      };
    }
  }

  // Get health conditions
  async getHealthConditions(): Promise<ApiResponse<HealthCondition[]>> {
    // Create a timeout promise
    const timeoutPromise = new Promise<ApiResponse<HealthCondition[]>>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000); // 5 second timeout
    });
    
    try {
      await Promise.race([
        this.delay(300),
        timeoutPromise
      ]);
      
      return {
        success: true,
        data: mockConditions,
        message: 'Health conditions loaded successfully!'
      };
    } catch (error) {
      if ((error as Error).message === 'Request timeout') {
        return {
          success: false,
          data: [],
          message: 'Request timed out. Please try again.'
        };
      }
      
      return {
        success: false,
        data: [],
        message: 'Failed to load health conditions. Please try again.'
      };
    }
  }

  // Get food recommendations for health condition
  async getFoodRecommendations(conditionId: string): Promise<ApiResponse<FoodRecommendation[]>> {
    // Create a timeout promise
    const timeoutPromise = new Promise<ApiResponse<FoodRecommendation[]>>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000); // 5 second timeout
    });
    
    try {
      await Promise.race([
        this.delay(1000),
        timeoutPromise
      ]);
      
      // Handle custom conditions differently
      if (conditionId === 'custom') {
        // For custom conditions, we'll return generic but varied recommendations
        const genericRecommendations: FoodRecommendation[] = [
          {
            food: {
              id: 'custom-1',
              name: 'Warm Water',
              calories: 0,
              servingSize: '1 cup',
              nutrients: {
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                sugar: 0,
                sodium: 0,
                vitamins: { 'Vitamin C': 0 },
                minerals: { Potassium: 1 }
              }
            },
            reason: 'Helps with hydration and can ease discomfort',
            portionSize: 'As needed throughout the day',
            timing: 'Throughout the day',
            alternatives: [
              {
                id: 'alt-1',
                name: 'Herbal Tea',
                calories: 2,
                servingSize: '1 cup',
                nutrients: {
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  fiber: 0,
                  sugar: 0,
                  sodium: 0,
                  vitamins: { 'Antioxidants': 5 },
                  minerals: { Potassium: 2 }
                }
              },
              {
                id: 'alt-2',
                name: 'Clear Broth',
                calories: 15,
                servingSize: '1 bowl',
                nutrients: {
                  protein: 1,
                  carbs: 2,
                  fat: 0,
                  fiber: 0,
                  sugar: 1,
                  sodium: 150,
                  vitamins: { 'Vitamin A': 50 },
                  minerals: { Sodium: 150 }
                }
              }
            ]
          },
          {
            food: {
              id: 'custom-2',
              name: 'Bananas',
              calories: 105,
              servingSize: '1 medium',
              nutrients: {
                protein: 1.3,
                carbs: 27,
                fat: 0.4,
                fiber: 3.1,
                sugar: 14,
                sodium: 1,
                vitamins: { 'Vitamin B6': 0.4, 'Vitamin C': 10 },
                minerals: { Potassium: 422, Magnesium: 32 }
              }
            },
            reason: 'Easy to digest and provides gentle energy',
            portionSize: '1 serving',
            timing: 'When you can tolerate food',
            alternatives: [
              {
                id: 'alt-3',
                name: 'Plain Toast',
                calories: 80,
                servingSize: '1 slice',
                nutrients: {
                  protein: 2.5,
                  carbs: 15,
                  fat: 1,
                  fiber: 0.5,
                  sugar: 1,
                  sodium: 120,
                  vitamins: { 'B Vitamins': 2 },
                  minerals: { Iron: 1 }
                }
              },
              {
                id: 'alt-4',
                name: 'Apple Sauce',
                calories: 50,
                servingSize: '1/2 cup',
                nutrients: {
                  protein: 0.5,
                  carbs: 13,
                  fat: 0.2,
                  fiber: 1.5,
                  sugar: 10,
                  sodium: 1,
                  vitamins: { 'Vitamin C': 3 },
                  minerals: { Potassium: 95 }
                }
              }
            ]
          },
          {
            food: {
              id: 'custom-3',
              name: 'Ginger Tea',
              calories: 5,
              servingSize: '1 cup',
              nutrients: {
                protein: 0,
                carbs: 1,
                fat: 0,
                fiber: 0,
                sugar: 0,
                sodium: 2,
                vitamins: { 'Antioxidants': 5 },
                minerals: { Potassium: 5 }
              }
            },
            reason: 'Natural anti-inflammatory that may help with discomfort',
            portionSize: '1 cup, 2-3 times daily',
            timing: 'Between meals',
            alternatives: [
              {
                id: 'alt-5',
                name: 'Peppermint Tea',
                calories: 2,
                servingSize: '1 cup',
                nutrients: {
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  fiber: 0,
                  sugar: 0,
                  sodium: 1,
                  vitamins: { 'Antioxidants': 3 },
                  minerals: { Potassium: 3 }
                }
              },
              {
                id: 'alt-6',
                name: 'Chamomile Tea',
                calories: 2,
                servingSize: '1 cup',
                nutrients: {
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  fiber: 0,
                  sugar: 0,
                  sodium: 0,
                  vitamins: { 'Antioxidants': 4 },
                  minerals: { Potassium: 2 }
                }
              }
            ]
          }
        ];
        
        return {
          success: true,
          data: genericRecommendations,
          message: 'Personalized food recommendations generated successfully!'
        };
      }
      
      const condition = mockConditions.find(c => c.id === conditionId);
      
      if (!condition) {
        return {
          success: false,
          data: [],
          message: 'Condition not found'
        };
      }

      // Create vitamin-rich recommendations based on condition
      const conditionToVitamins: { [key: string]: string[] } = {
        'Common Cold': ['Vitamin C', 'Vitamin D', 'Zinc', 'Vitamin A'],
        'Fever': ['Vitamin C', 'Vitamin B6', 'Electrolytes', 'Antioxidants'],
        'Diarrhea': ['Potassium', 'B Vitamins', 'Probiotics', 'Electrolytes'],
        'Sore Throat': ['Vitamin C', 'Vitamin A', 'Zinc', 'Anti-inflammatory']
      };

      const vitaminToFoodGroups: { [key: string]: string[] } = {
        'Vitamin C': ['Citrus fruits', 'Berries', 'Bell peppers', 'Broccoli'],
        'Vitamin D': ['Fatty fish', 'Egg yolks', 'Fortified milk', 'Mushrooms'],
        'Vitamin A': ['Carrots', 'Sweet potatoes', 'Spinach', 'Liver'],
        'Vitamin B6': ['Bananas', 'Poultry', 'Fish', 'Potatoes'],
        'Zinc': ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas'],
        'Electrolytes': ['Coconut water', 'Bananas', 'Oranges', 'Dairy'],
        'Antioxidants': ['Berries', 'Dark chocolate', 'Green tea', 'Artichokes'],
        'Potassium': ['Bananas', 'Avocados', 'Spinach', 'Sweet potatoes'],
        'B Vitamins': ['Whole grains', 'Nuts', 'Leafy greens', 'Eggs'],
        'Probiotics': ['Yogurt', 'Kefir', 'Sauerkraut', 'Kimchi'],
        'Anti-inflammatory': ['Fatty fish', 'Turmeric', 'Ginger', 'Berries']
      };

      // Get vitamins important for this condition
      const importantVitamins = conditionToVitamins[condition.name] || ['Vitamin C', 'Vitamin D'];
      
      // Create recommendations based on vitamins
      const recommendations: FoodRecommendation[] = importantVitamins.slice(0, 3).map((vitamin, index) => {
        const foodGroups = vitaminToFoodGroups[vitamin] || ['Fruits', 'Vegetables', 'Whole grains'];
        const mainFood = foodGroups[0] || 'Nutritious foods';
        const altFood1 = foodGroups[1] || 'Healthy alternatives';
        const altFood2 = foodGroups[2] || 'Other options';
        
        // Find appropriate mock foods
        const mainFoodIndex = index % mockFoods.length;
        const altFoodIndex1 = (index + 1) % mockFoods.length;
        const altFoodIndex2 = (index + 2) % mockFoods.length;
        
        return {
          food: {
            ...mockFoods[mainFoodIndex],
            name: mainFood,
            nutrients: {
              ...mockFoods[mainFoodIndex].nutrients,
              vitamins: {
                ...mockFoods[mainFoodIndex].nutrients.vitamins,
                [vitamin]: vitamin === 'Vitamin C' ? 50 : 
                          vitamin === 'Vitamin D' ? 20 :
                          vitamin === 'Vitamin A' ? 300 :
                          vitamin === 'Vitamin B6' ? 0.5 :
                          vitamin === 'Zinc' ? 2 :
                          vitamin === 'Potassium' ? 200 :
                          vitamin === 'Electrolytes' ? 100 : 10
              }
            }
          },
          reason: `Rich in ${vitamin} which supports ${condition.name.toLowerCase()} recovery`,
          portionSize: '1 serving',
          timing: 'Throughout the day',
          alternatives: [
            {
              ...mockFoods[altFoodIndex1],
              name: altFood1,
              nutrients: {
                ...mockFoods[altFoodIndex1].nutrients,
                vitamins: {
                  ...mockFoods[altFoodIndex1].nutrients.vitamins,
                  [vitamin]: vitamin === 'Vitamin C' ? 30 : 
                            vitamin === 'Vitamin D' ? 15 :
                            vitamin === 'Vitamin A' ? 200 :
                            vitamin === 'Vitamin B6' ? 0.3 :
                            vitamin === 'Zinc' ? 1.5 :
                            vitamin === 'Potassium' ? 150 :
                            vitamin === 'Electrolytes' ? 75 : 7
                }
              }
            },
            {
              ...mockFoods[altFoodIndex2],
              name: altFood2,
              nutrients: {
                ...mockFoods[altFoodIndex2].nutrients,
                vitamins: {
                  ...mockFoods[altFoodIndex2].nutrients.vitamins,
                  [vitamin]: vitamin === 'Vitamin C' ? 20 : 
                            vitamin === 'Vitamin D' ? 10 :
                            vitamin === 'Vitamin A' ? 150 :
                            vitamin === 'Vitamin B6' ? 0.2 :
                            vitamin === 'Zinc' ? 1 :
                            vitamin === 'Potassium' ? 100 :
                            vitamin === 'Electrolytes' ? 50 : 5
                }
              }
            }
          ]
        };
      });
      
      return {
        success: true,
        data: recommendations,
        message: 'Food recommendations generated successfully!'
      };
    } catch (error) {
      if ((error as Error).message === 'Request timeout') {
        return {
          success: false,
          data: [],
          message: 'Request timed out. Please try again.'
        };
      }
      
      return {
        success: false,
        data: [],
        message: 'Failed to generate recommendations. Please try again.'
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiService = new ApiService();