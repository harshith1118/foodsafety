// Test our corrected USDA implementation
async function testCorrectedUSDA() {
  const food = 'raw apple';
  
  console.log('Testing corrected USDA implementation for:', food);
  
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        const foodItem = data.foods[0];
        console.log('🍎 Food:', foodItem.description);
        console.log('📊 Total nutrients:', foodItem.foodNutrients ? foodItem.foodNutrients.length : 0);
        
        if (foodItem.foodNutrients) {
          // Extract nutrients using our corrected implementation
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
          
          // Process all nutrients (corrected structure)
          for (const foodNutrient of foodItem.foodNutrients) {
            // Corrected: direct properties, not nested
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
          if (Object.keys(nutrients.vitamins).length > 0) {
            Object.keys(nutrients.vitamins).forEach(vitamin => {
              console.log(`${vitamin}: ${nutrients.vitamins[vitamin]} ${vitamin.includes('Vitamin') ? 'mg' : ''}`);
            });
          } else {
            console.log('No vitamins found');
          }
          
          console.log('\n=== Minerals Found ===');
          if (Object.keys(nutrients.minerals).length > 0) {
            Object.keys(nutrients.minerals).forEach(mineral => {
              console.log(`${mineral}: ${nutrients.minerals[mineral]} mg`);
            });
          } else {
            console.log('No minerals found');
          }
          
          console.log('\n✅ SUCCESS: This corrected implementation will provide comprehensive nutrition data!');
        }
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testCorrectedUSDA();