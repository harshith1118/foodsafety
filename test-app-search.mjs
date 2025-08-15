// Test the exact API call that our application makes
import axios from 'axios';

async function testAppSearch() {
  const query = 'apple';
  console.log(`Testing app search for: ${query}`);
  
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;
  
  try {
    const response = await axios.get(url);
    console.log(`Status: ${response.status}`);
    
    if (response.data && response.data.products && Array.isArray(response.data.products) && response.data.products.length > 0) {
      console.log(`Found ${response.data.products.length} products`);
      
      // Process only the best matching products (up to 5)
      const productsToProcess = response.data.products.slice(0, 5);
      const foodItems = [];
      
      for (const product of productsToProcess) {
        try {
          // Extract nutrition data
          const nutrients = {
            protein: parseFloat(product.nutriments?.proteins_100g) || 0,
            carbs: parseFloat(product.nutriments?.carbohydrates_100g) || 0,
            fat: parseFloat(product.nutriments?.fat_100g) || 0,
            fiber: parseFloat(product.nutriments?.fiber_100g) || 0,
            sugar: parseFloat(product.nutriments?.sugars_100g) || 0,
            sodium: parseFloat(product.nutriments?.sodium_100g) || 0,
            vitamins: {},
            minerals: {}
          };
          
          // Add some common vitamins and minerals if available
          if (product.nutriments?.vitamin_c_100g) {
            nutrients.vitamins['Vitamin C'] = parseFloat(product.nutriments.vitamin_c_100g);
          }
          if (product.nutriments?.calcium_100g) {
            nutrients.minerals['Calcium'] = parseFloat(product.nutriments.calcium_100g);
          }
          if (product.nutriments?.iron_100g) {
            nutrients.minerals['Iron'] = parseFloat(product.nutriments.iron_100g);
          }
          if (product.nutriments?.potassium_100g) {
            nutrients.minerals['Potassium'] = parseFloat(product.nutriments.potassium_100g);
          }
          
          // Calculate calories if not provided
          let calories = parseFloat(product.nutriments?.energy_value) || 0;
          if (calories === 0 && product.nutriments?.energy_100g) {
            calories = parseFloat(product.nutriments.energy_100g);
          }
          if (calories === 0) {
            calories = Math.round(
              (nutrients.protein * 4) + 
              (nutrients.carbs * 4) + 
              (nutrients.fat * 9)
            );
          }
          
          const foodItem = {
            id: `off-${product.code || Date.now()}-0`,
            name: product.product_name || product.generic_name || query,
            calories: calories,
            nutrients: nutrients,
            servingSize: '100g',
            imageUrl: product.image_url || ''
          };
          
          // Always add items with a valid name (relax the nutrition data requirement)
          if (foodItem.name) {
            foodItems.push(foodItem);
          }
        } catch (processError) {
          console.error('Error processing product:', processError);
        }
      }
      
      console.log(`Successfully processed ${foodItems.length} food items`);
      if (foodItems.length > 0) {
        console.log('First item:', foodItems[0].name);
        console.log('Calories:', foodItems[0].calories);
        console.log('Protein:', foodItems[0].nutrients.protein);
        console.log('Carbs:', foodItems[0].nutrients.carbs);
        console.log('Fat:', foodItems[0].nutrients.fat);
      }
    } else {
      console.log('No products found');
    }
  } catch (error) {
    console.error(`Error:`, error.message);
  }
}

testAppSearch();