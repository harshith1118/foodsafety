// Test our improved mock data system
async function testMockData() {
  // Simulate the searchFood function logic for mock data
  const testQueries = ['apple', 'banana', 'chicken', 'salmon', 'broccoli', 'curry', 'biryani', 'paneer', 'pasta'];
  
  const comprehensiveMockFoods = {
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
  
  console.log('Testing comprehensive mock data system...\n');
  
  for (const query of testQueries) {
    console.log(`=== Testing: ${query} ===`);
    
    // Check for comprehensive fallbacks
    let found = false;
    for (const [key, foodItem] of Object.entries(comprehensiveMockFoods)) {
      if (query.includes(key)) {
        console.log(`✅ Found mock food: ${foodItem.name}`);
        console.log(`   Calories: ${foodItem.calories}`);
        console.log(`   Protein: ${foodItem.nutrients.protein}g`);
        console.log(`   Carbs: ${foodItem.nutrients.carbs}g`);
        console.log(`   Fat: ${foodItem.nutrients.fat}g`);
        console.log(`   Vitamins: ${Object.keys(foodItem.nutrients.vitamins).length} types`);
        console.log(`   Minerals: ${Object.keys(foodItem.nutrients.minerals).length} types`);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log(`📱 Using generic mock data for: ${query}`);
    }
    
    console.log('');
  }
}

testMockData();