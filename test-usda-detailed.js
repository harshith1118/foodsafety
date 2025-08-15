// Test USDA API with more detailed nutrient information
async function testUSDADetailed() {
  const food = 'raw apple';
  
  console.log('Testing USDA API with detailed nutrient info for:', food);
  
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Total foods found:', data.foods ? data.foods.length : 0);
      
      if (data.foods && data.foods.length > 0) {
        const foodItem = data.foods[0];
        console.log('\n=== Food Details ===');
        console.log('Description:', foodItem.description);
        console.log('Data Type:', foodItem.dataType);
        console.log('Food Category:', foodItem.foodCategory || 'N/A');
        console.log('Publication Date:', foodItem.publicationDate || 'N/A');
        
        if (foodItem.foodNutrients) {
          console.log('\n=== Nutrient Count ===');
          console.log('Total nutrients:', foodItem.foodNutrients.length);
          
          // Categorize nutrients
          const categorized = {};
          foodItem.foodNutrients.forEach(nutrient => {
            if (nutrient.nutrient && nutrient.nutrient.name) {
              const category = nutrient.nutrient.name.includes('Vitamin') ? 'Vitamins' :
                             nutrient.nutrient.name.includes('Calcium') || nutrient.nutrient.name.includes('Iron') || 
                             nutrient.nutrient.name.includes('Magnesium') || nutrient.nutrient.name.includes('Phosphorus') || 
                             nutrient.nutrient.name.includes('Potassium') || nutrient.nutrient.name.includes('Zinc') ? 'Minerals' :
                             'Other';
                             
              if (!categorized[category]) categorized[category] = [];
              categorized[category].push({
                name: nutrient.nutrient.name,
                amount: nutrient.amount,
                unit: nutrient.nutrient.unitName
              });
            }
          });
          
          console.log('\n=== Nutrient Categories ===');
          Object.keys(categorized).forEach(category => {
            console.log(`${category}: ${categorized[category].length} items`);
          });
          
          // Show sample nutrients from each category
          console.log('\n=== Sample Nutrients ===');
          Object.keys(categorized).forEach(category => {
            console.log(`\n${category}:`);
            categorized[category].slice(0, 5).forEach(nutrient => {
              console.log(`  ${nutrient.name}: ${nutrient.amount} ${nutrient.unit}`);
            });
            if (categorized[category].length > 5) {
              console.log(`  ... and ${categorized[category].length - 5} more`);
            }
          });
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

testUSDADetailed();