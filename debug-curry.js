// Debug the exact issue with "curry" search
async function debugCurrySearch() {
  const query = 'curry';
  console.log('Debugging curry search...');
  
  try {
    // Test the exact API call
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=10`;
    console.log('Making request to:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Data received:');
      console.log('- Products array exists:', !!data.products);
      console.log('- Products type:', typeof data.products);
      
      if (data.products && Array.isArray(data.products)) {
        console.log('- Products length:', data.products.length);
        
        if (data.products.length > 0) {
          console.log('- First product name:', data.products[0].product_name || data.products[0].generic_name || 'No name');
          console.log('- First product has nutriments:', !!data.products[0].nutriments);
          
          // Test our processing logic
          const foodItems = [];
          
          for (const product of data.products) {
            try {
              if (!product.product_name && !product.generic_name) {
                console.log('Skipping product - no name');
                continue;
              }
              
              const nutriments = product.nutriments || {};
              console.log('Processing product:', product.product_name || product.generic_name);
              console.log('- Nutriments keys:', Object.keys(nutriments));
              
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
                console.log('✓ Added food item:', foodItem.name);
              } else {
                console.log('✗ Skipped food item - no valid name');
              }
            } catch (processError) {
              console.error('Error processing product:', processError);
            }
          }
          
          console.log('✅ Successfully processed', foodItems.length, 'food items');
        } else {
          console.log('⚠️ Products array is empty');
        }
      } else {
        console.log('⚠️ No products array in response');
      }
    } else {
      console.log('❌ HTTP Error:', response.status);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

debugCurrySearch();