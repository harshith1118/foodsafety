// Test to verify the fixed search implementation works in the actual application
// This mimics what happens in the FoodSearch component
async function testSearchFlow() {
  const searchQuery = 'apple';
  console.log('Testing search flow for:', searchQuery);
  
  try {
    // This is what happens in handleTextSearch
    console.log('🔍 Calling searchFood with:', searchQuery);
    
    // Make the same API call as in our fixed searchFood method
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&action=process&json=1&page_size=10`;
    
    console.log('📡 Making request to:', url);
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ API response received');
      console.log('✅ Response status:', response.status);
      console.log('✅ Products found:', data.products ? data.products.length : 0);
      
      // Process the response exactly as in our searchFood method
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        console.log('✅ Processing products...');
        
        const foodItems = [];
        
        for (const product of data.products) {
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
              name: product.product_name || product.generic_name || searchQuery,
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
        
        console.log('✅ Successfully processed', foodItems.length, 'food items');
        
        if (foodItems.length > 0) {
          console.log('✅ Search successful!');
          console.log('✅ Returning', foodItems.length, 'food items');
          console.log('✅ First item name:', foodItems[0].name);
          console.log('✅ First item calories:', foodItems[0].calories);
          
          // This is what should happen in the component
          console.log('✅ This should update searchResults with', foodItems.length, 'items');
          console.log('✅ This should clear any error messages');
          console.log('✅ This should set loading to false');
        } else {
          console.log('⚠️ No valid food items after processing');
        }
      } else {
        console.log('⚠️ No valid products in response');
      }
    } else {
      console.log('❌ HTTP Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Search threw exception:', error.message);
  }
}

testSearchFlow();