// Simple debug of USDA API
async function simpleDebug() {
  const food = 'raw apple';
  
  console.log('Simple debug of USDA API for:', food);
  
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        const foodItem = data.foods[0];
        console.log('Food description:', foodItem.description);
        console.log('Has foodNutrients:', !!foodItem.foodNutrients);
        
        if (foodItem.foodNutrients) {
          console.log('Number of nutrients:', foodItem.foodNutrients.length);
          
          // Show just the first few nutrient names
          console.log('\nFirst 5 nutrient names:');
          for (let i = 0; i < Math.min(5, foodItem.foodNutrients.length); i++) {
            const nutrient = foodItem.foodNutrients[i];
            if (nutrient.nutrient && nutrient.nutrient.name) {
              console.log(`${i + 1}. ${nutrient.nutrient.name}`);
            } else {
              console.log(`${i + 1}. Nutrient object:`, nutrient);
            }
          }
        }
      } else {
        console.log('No foods found');
      }
    } else {
      console.log('HTTP Error:', response.status);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

simpleDebug();