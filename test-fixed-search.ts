// Test our fixed search implementation directly
import axios from 'axios';

async function testFixedSearch() {
  const query = 'apple';
  console.log('Testing fixed search implementation for:', query);
  
  try {
    // Use the exact same API call as in our fixed method
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=10`;
    console.log('Making request to:', url);
    
    const response = await axios.get(url);
    console.log('Response status:', response.status);
    
    // Process the response exactly as in our fixed method
    if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
      console.log('Found', response.data.products.length, 'products');
      
      const foodItems = [];
      
      for (const product of response.data.products) {
        try {
          if (!product.product_name && !product.generic_name) {
            continue;
          }
          
          const nutriments = product.nutriments || {};
          
          const nutrients = {
            protein: parseFloat(nutriments.proteins_100g) || 0,
            carbs: parseFloat(nutriments.carbohydrates_100g) || 0,
            fat: parseFloat(nutriments.fat_100g) || 0,
            fiber: parseFloat(nutriments.fiber_100g) || 0,
            sugar: parseFloat(nutriments.sugars_100g) || 0,
            sodium: parseFloat(nutriments.sodium_100g) || 0,
            vitamins: {},
            minerals: {}
          };
          
          // Add vitamins if available
          if (nutriments['vitamin-c_100g']) {
            nutrients.vitamins['Vitamin C'] = parseFloat(nutriments['vitamin-c_100g']);
          }
          if (nutriments['vitamin-a_100g']) {
            nutrients.vitamins['Vitamin A'] = parseFloat(nutriments['vitamin-a_100g']);
          }
          
          // Add minerals if available
          if (nutriments.calcium_100g) {
            nutrients.minerals.Calcium = parseFloat(nutriments.calcium_100g);
          }
          if (nutriments.iron_100g) {
            nutrients.minerals.Iron = parseFloat(nutriments.iron_100g);
          }
          
          // Calculate calories
          let calories = 0;
          if (nutriments['energy-kcal_100g']) {
            calories = parseFloat(nutriments['energy-kcal_100g']);
          } else if (nutriments.energy_100g) {
            calories = parseFloat(nutriments.energy_100g);
          } else if (nutriments.energy_value) {
            calories = parseFloat(nutriments.energy_value);
          }
          
          if (calories === 0) {
            calories = Math.round(
              (nutrients.protein * 4) + 
              (nutrients.carbs * 4) + 
              (nutrients.fat * 9)
            );
          }
          
          const foodItem = {
            id: `off-${product.code || Date.now()}-${foodItems.length}`,
            name: product.product_name || product.generic_name || query,
            calories: calories,
            nutrients: nutrients,
            servingSize: product.serving_size || '100g',
            imageUrl: product.image_url || ''
          };
          
          if (foodItem.name && foodItem.name.trim() !== '') {
            foodItems.push(foodItem);
          }
        } catch (processError) {
          console.error('Error processing product:', processError);
        }
      }
      
      console.log('Successfully processed', foodItems.length, 'food items');
      
      if (foodItems.length > 0) {
        console.log('First item:');
        console.log('- Name:', foodItems[0].name);
        console.log('- Calories:', foodItems[0].calories);
        console.log('- Protein:', foodItems[0].nutrients.protein);
        console.log('- Carbs:', foodItems[0].nutrients.carbs);
        console.log('- Fat:', foodItems[0].nutrients.fat);
      }
    } else {
      console.log('No valid products found');
    }
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testFixedSearch();