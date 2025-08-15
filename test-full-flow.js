// Test to verify the actual search is working by mimicking the exact flow
async function testFullFlow() {
  console.log('Testing full search flow...');
  
  const query = 'apple';
  
  try {
    // This is exactly what happens in the apiService.searchFood method
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=10`;
    
    console.log('Making request to:', url);
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      // This is the exact processing logic from our fixed searchFood method
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        console.log('✅ Found products:', data.products.length);
        
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
        
        console.log('✅ Successfully processed food items:', foodItems.length);
        
        if (foodItems.length > 0) {
          // This is what should be returned from the apiService
          const result = {
            success: true,
            data: foodItems,
            message: `Found ${foodItems.length} food item(s)!`
          };
          
          console.log('✅ Final result:');
          console.log('  - Success:', result.success);
          console.log('  - Message:', result.message);
          console.log('  - Data items:', result.data.length);
          console.log('  - First item name:', result.data[0].name);
          console.log('  - First item calories:', result.data[0].calories);
          
          // This is what should happen in the component
          console.log('✅ This result should update searchResults in the component');
          console.log('✅ The component should display the food information');
        }
      } else {
        console.log('⚠️ No products found');
      }
    } else {
      console.log('❌ HTTP Error:', response.status);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFullFlow();