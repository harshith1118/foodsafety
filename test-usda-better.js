// Test USDA API with better nutrient categorization
async function testUSDABetter() {
  const food = 'raw apple';
  
  console.log('Testing USDA API with better categorization for:', food);
  
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        const foodItem = data.foods[0];
        console.log('Description:', foodItem.description);
        console.log('Total nutrients:', foodItem.foodNutrients.length);
        
        if (foodItem.foodNutrients) {
          // Show all nutrients
          console.log('\n=== All Nutrients ===');
          foodItem.foodNutrients.forEach((nutrient, index) => {
            if (nutrient.nutrient && nutrient.nutrient.name) {
              console.log(`${index + 1}. ${nutrient.nutrient.name}: ${nutrient.amount} ${nutrient.nutrient.unitName}`);
            }
          });
          
          // Filter for vitamins and minerals specifically
          console.log('\n=== Vitamins ===');
          const vitamins = foodItem.foodNutrients.filter(n => 
            n.nutrient && n.nutrient.name && (
              n.nutrient.name.includes('Vitamin') || 
              n.nutrient.name.includes('Folate') ||
              n.nutrient.name.includes('Niacin') ||
              n.nutrient.name.includes('Riboflavin') ||
              n.nutrient.name.includes('Thiamin') ||
              n.nutrient.name.includes('Pantothenic') ||
              n.nutrient.name.includes('Biotin') ||
              n.nutrient.name.includes('Retinol') ||
              n.nutrient.name.includes('Carotene') ||
              n.nutrient.name.includes('Cryptoxanthin') ||
              n.nutrient.name.includes('Lycopene') ||
              n.nutrient.name.includes('Lutein')
            )
          );
          
          vitamins.forEach(vitamin => {
            console.log(`${vitamin.nutrient.name}: ${vitamin.amount} ${vitamin.nutrient.unitName}`);
          });
          
          console.log('\n=== Minerals ===');
          const minerals = foodItem.foodNutrients.filter(n => 
            n.nutrient && n.nutrient.name && (
              n.nutrient.name.includes('Calcium') || 
              n.nutrient.name.includes('Iron') ||
              n.nutrient.name.includes('Magnesium') ||
              n.nutrient.name.includes('Phosphorus') ||
              n.nutrient.name.includes('Potassium') ||
              n.nutrient.name.includes('Sodium') ||
              n.nutrient.name.includes('Zinc') ||
              n.nutrient.name.includes('Copper') ||
              n.nutrient.name.includes('Manganese') ||
              n.nutrient.name.includes('Selenium') ||
              n.nutrient.name.includes('Fluoride') ||
              n.nutrient.name.includes('Iodine')
            )
          );
          
          minerals.forEach(mineral => {
            console.log(`${mineral.nutrient.name}: ${mineral.amount} ${mineral.nutrient.unitName}`);
          });
          
          console.log('\n=== Macronutrients ===');
          const macros = foodItem.foodNutrients.filter(n => 
            n.nutrient && n.nutrient.name && (
              n.nutrient.name.includes('Protein') || 
              n.nutrient.name.includes('Total lipid') ||
              n.nutrient.name.includes('Carbohydrate') ||
              n.nutrient.name.includes('Fiber') ||
              n.nutrient.name.includes('Sugars') ||
              n.nutrient.name.includes('Energy')
            )
          );
          
          macros.forEach(macro => {
            console.log(`${macro.nutrient.name}: ${macro.amount} ${macro.nutrient.unitName}`);
          });
        }
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testUSDABetter();