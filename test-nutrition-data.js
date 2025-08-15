// Test to see what nutrition data is available in the API response
import axios from 'axios';

async function testNutritionData() {
  const query = 'apple';
  console.log('Testing nutrition data availability for:', query);
  
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=1`;
    const response = await axios.get(url);
    
    if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
      const product = response.data.products[0];
      console.log('Product:', product.product_name || product.generic_name);
      
      if (product.nutriments) {
        console.log('\n=== Available Nutriments ===');
        const nutriments = Object.keys(product.nutriments);
        console.log('Total nutriments:', nutriments.length);
        
        // Show all vitamin-related nutriments
        console.log('\n=== Vitamin-related Nutriments ===');
        const vitaminNutriments = nutriments.filter(key => 
          key.includes('vitamin') || key.includes('Vitamin') || 
          key.includes('folate') || key.includes('Folate') ||
          key.includes('niacin') || key.includes('Niacin') ||
          key.includes('pantothenic') || key.includes('Pantothenic') ||
          key.includes('biotin') || key.includes('Biotin')
        );
        vitaminNutriments.forEach(key => {
          console.log(`${key}: ${product.nutriments[key]}`);
        });
        
        // Show all mineral-related nutriments
        console.log('\n=== Mineral-related Nutriments ===');
        const mineralNutriments = nutriments.filter(key => 
          key.includes('calcium') || key.includes('Calcium') ||
          key.includes('iron') || key.includes('Iron') ||
          key.includes('magnesium') || key.includes('Magnesium') ||
          key.includes('phosphorus') || key.includes('Phosphorus') ||
          key.includes('potassium') || key.includes('Potassium') ||
          key.includes('sodium') || key.includes('Sodium') ||
          key.includes('zinc') || key.includes('Zinc') ||
          key.includes('copper') || key.includes('Copper') ||
          key.includes('manganese') || key.includes('Manganese') ||
          key.includes('fluoride') || key.includes('Fluoride') ||
          key.includes('selenium') || key.includes('Selenium') ||
          key.includes('chromium') || key.includes('Chromium') ||
          key.includes('molybdenum') || key.includes('Molybdenum') ||
          key.includes('iodine') || key.includes('Iodine')
        );
        mineralNutriments.forEach(key => {
          console.log(`${key}: ${product.nutriments[key]}`);
        });
        
        // Show macronutrients (these are working)
        console.log('\n=== Macronutrients ===');
        console.log('Protein:', product.nutriments.proteins_100g);
        console.log('Carbs:', product.nutriments.carbohydrates_100g);
        console.log('Fat:', product.nutriments.fat_100g);
        console.log('Fiber:', product.nutriments.fiber_100g);
        console.log('Sugar:', product.nutriments.sugars_100g);
        console.log('Sodium:', product.nutriments.sodium_100g);
        
        // Show energy
        console.log('\n=== Energy ===');
        console.log('Energy (kcal):', product.nutriments['energy-kcal_100g']);
        console.log('Energy (kj):', product.nutriments.energy_100g);
      } else {
        console.log('No nutriments data available');
      }
    } else {
      console.log('No products found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNutritionData();