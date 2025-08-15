// Test different free nutrition APIs to find one with comprehensive data
async function testNutritionAPIs() {
  const food = 'apple';
  
  console.log('Testing different free nutrition APIs for:', food);
  
  // 1. Open Food Facts (already tested - limited vitamin data)
  console.log('\n=== Open Food Facts ===');
  try {
    const url1 = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(food)}&action=process&json=1&page_size=1`;
    const response1 = await fetch(url1);
    if (response1.ok) {
      const data1 = await response1.json();
      if (data1.products && data1.products.length > 0) {
        const product = data1.products[0];
        console.log('Product:', product.product_name);
        if (product.nutriments) {
          const vitamins = Object.keys(product.nutriments).filter(key => key.includes('vitamin'));
          const minerals = Object.keys(product.nutriments).filter(key => 
            ['calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'zinc'].some(mineral => key.includes(mineral))
          );
          console.log('Vitamins available:', vitamins.length);
          console.log('Minerals available:', minerals.length);
        }
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  // 2. USDA FoodData Central (Free tier)
  console.log('\n=== USDA FoodData Central ===');
  try {
    const url2 = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response2 = await fetch(url2);
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('Found foods:', data2.foods ? data2.foods.length : 0);
      if (data2.foods && data2.foods.length > 0) {
        const foodItem = data2.foods[0];
        console.log('Food:', foodItem.description);
        if (foodItem.foodNutrients) {
          const vitamins = foodItem.foodNutrients.filter(n => n.nutrient && n.nutrient.name.includes('Vitamin'));
          const minerals = foodItem.foodNutrients.filter(n => n.nutrient && 
            ['Calcium', 'Iron', 'Magnesium', 'Phosphorus', 'Potassium', 'Zinc'].some(mineral => 
              n.nutrient.name.includes(mineral)
            )
          );
          console.log('Vitamins available:', vitamins.length);
          console.log('Minerals available:', minerals.length);
          console.log('Total nutrients:', foodItem.foodNutrients.length);
        }
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  // 3. Nutritionix (Free tier)
  console.log('\n=== Nutritionix ===');
  try {
    const url3 = `https://api.nutritionix.com/v1_1/search/${encodeURIComponent(food)}?results=0:1&fields=item_name,nf_calories,nf_total_fat,nf_total_carbohydrate,nf_protein,nf_sodium,nf_dietary_fiber,nf_sugars&appId=YOUR_APP_ID&appKey=YOUR_APP_KEY`;
    // Note: We'd need real credentials for this one
    console.log('Nutritionix requires API key - would need to sign up');
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  // 4. FDC ID search for specific apple
  console.log('\n=== USDA FDC Specific Apple Search ===');
  try {
    // Search for "raw apple" specifically
    const url4 = `https://api.nal.usda.gov/fdc/v1/foods/search?query=raw+${encodeURIComponent(food)}&pageSize=1&api_key=DEMO_KEY`;
    const response4 = await fetch(url4);
    if (response4.ok) {
      const data4 = await response4.json();
      console.log('Found raw apple foods:', data4.foods ? data4.foods.length : 0);
      if (data4.foods && data4.foods.length > 0) {
        const foodItem = data4.foods[0];
        console.log('Food:', foodItem.description);
        if (foodItem.foodNutrients) {
          const vitamins = foodItem.foodNutrients.filter(n => n.nutrient && n.nutrient.name.includes('Vitamin'));
          const minerals = foodItem.foodNutrients.filter(n => n.nutrient && 
            ['Calcium', 'Iron', 'Magnesium', 'Phosphorus', 'Potassium', 'Zinc'].some(mineral => 
              n.nutrient.name.includes(mineral)
            )
          );
          console.log('Vitamins available:', vitamins.length);
          console.log('Minerals available:', minerals.length);
          if (vitamins.length > 0) {
            console.log('Sample vitamins:');
            vitamins.slice(0, 3).forEach(v => console.log(`  ${v.nutrient.name}: ${v.amount} ${v.nutrient.unitName}`));
          }
          if (minerals.length > 0) {
            console.log('Sample minerals:');
            minerals.slice(0, 3).forEach(m => console.log(`  ${m.nutrient.name}: ${m.amount} ${m.nutrient.unitName}`));
          }
        }
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testNutritionAPIs();