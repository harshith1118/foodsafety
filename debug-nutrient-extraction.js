// Debug the nutrient extraction - fixed version
async function debugNutrientExtraction() {
  const food = 'raw apple';
  
  console.log('Debugging nutrient extraction for:', food);
  
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        const foodItem = data.foods[0];
        console.log('Food:', foodItem.description);
        
        if (foodItem.foodNutrients) {
          console.log('Total nutrients:', foodItem.foodNutrients.length);
          
          // Show first 10 nutrients with their structure
          console.log('\n=== First 10 Nutrients ===');
          foodItem.foodNutrients.slice(0, 10).forEach((nutrient, index) => {
            if (nutrient.nutrient) {
              console.log(`${index + 1}. Name: "${nutrient.nutrient.nutrientName}"`);
              console.log(`   Value: ${nutrient.value}`);
              console.log(`   Unit: ${nutrient.unitName}`);
              console.log(`   ID: ${nutrient.nutrient.id}`);
              console.log(`   Number: ${nutrient.nutrient.number}`);
            } else {
              console.log(`${index + 1}. Invalid nutrient structure:`, nutrient);
            }
            console.log('');
          });
          
          // Look for specific nutrients
          console.log('=== Looking for specific nutrients ===');
          const protein = foodItem.foodNutrients.find(n => n.nutrient && n.nutrient.nutrientName && n.nutrient.nutrientName.includes('Protein'));
          const carbs = foodItem.foodNutrients.find(n => n.nutrient && n.nutrient.nutrientName && n.nutrient.nutrientName.includes('Carbohydrate') && n.nutrient.nutrientName.includes('difference'));
          const fat = foodItem.foodNutrients.find(n => n.nutrient && n.nutrient.nutrientName && n.nutrient.nutrientName.includes('Total lipid'));
          const energy = foodItem.foodNutrients.find(n => n.nutrient && n.nutrient.nutrientName && n.nutrient.nutrientName.includes('Energy'));
          const vitaminC = foodItem.foodNutrients.find(n => n.nutrient && n.nutrient.nutrientName && n.nutrient.nutrientName.includes('Vitamin C'));
          const calcium = foodItem.foodNutrients.find(n => n.nutrient && n.nutrient.nutrientName && n.nutrient.nutrientName.includes('Calcium'));
          
          console.log('Protein:', protein ? `${protein.value} ${protein.unitName}` : 'Not found');
          console.log('Carbs:', carbs ? `${carbs.value} ${carbs.unitName}` : 'Not found');
          console.log('Fat:', fat ? `${fat.value} ${fat.unitName}` : 'Not found');
          console.log('Energy:', energy ? `${energy.value} ${energy.unitName}` : 'Not found');
          console.log('Vitamin C:', vitaminC ? `${vitaminC.value} ${vitaminC.unitName}` : 'Not found');
          console.log('Calcium:', calcium ? `${calcium.value} ${calcium.unitName}` : 'Not found');
        }
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

debugNutrientExtraction();