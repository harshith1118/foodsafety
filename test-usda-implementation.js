// Test our new USDA-based search implementation
async function testUSDASearch() {
  const food = 'raw apple';
  
  console.log('Testing USDA-based search implementation for:', food);
  
  try {
    // This is exactly what our new searchFood method does
    console.log('📡 Making USDA API request...');
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response status:', response.status);
      console.log('✅ Foods found:', data.foods ? data.foods.length : 0);
      
      if (data.foods && data.foods.length > 0) {
        const foodItem = data.foods[0];
        console.log('🍎 Food:', foodItem.description);
        console.log('📋 Data type:', foodItem.dataType);
        
        if (foodItem.foodNutrients) {
          console.log('📊 Total nutrients:', foodItem.foodNutrients.length);
          
          // Extract nutrients like our implementation does
          const nutrients = {
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
          
          // Process all nutrients
          for (const foodNutrient of foodItem.foodNutrients) {
            if (!foodNutrient.nutrient || !foodNutrient.nutrient.nutrientName) {
              continue;
            }
            
            const nutrientName = foodNutrient.nutrient.nutrientName;
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
            } else if (nutrientName.includes('Sodium') && !nutrients.sodium) {
              nutrients.sodium = value;
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
          
          // Fallback calories calculation if not provided
          if (calories === 0) {
            calories = Math.round(
              (nutrients.protein * 4) + 
              (nutrients.carbs * 4) + 
              (nutrients.fat * 9)
            );
          }
          
          console.log('\n=== Extracted Nutrition Data ===');
          console.log('Calories:', calories);
          console.log('Protein:', nutrients.protein, 'g');
          console.log('Carbs:', nutrients.carbs, 'g');
          console.log('Fat:', nutrients.fat, 'g');
          console.log('Fiber:', nutrients.fiber, 'g');
          console.log('Sugar:', nutrients.sugar, 'g');
          console.log('Sodium:', nutrients.sodium, 'mg');
          
          console.log('\n=== Vitamins Found ===');
          Object.keys(nutrients.vitamins).forEach(vitamin => {
            console.log(`${vitamin}: ${nutrients.vitamins[vitamin]} ${vitamin.includes('Vitamin') ? 'mg' : ''}`);
          });
          
          console.log('\n=== Minerals Found ===');
          Object.keys(nutrients.minerals).forEach(mineral => {
            console.log(`${mineral}: ${nutrients.minerals[mineral]} mg`);
          });
          
          console.log('\n✅ SUCCESS: This is exactly the data structure our new implementation will return!');
        }
      }
    } else {
      console.log('❌ HTTP Error:', response.status);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testUSDASearch();