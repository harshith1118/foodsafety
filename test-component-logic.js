// Test to verify the component logic
async function testComponentLogic() {
  const query = 'curry';
  console.log('Testing component logic for:', query);
  
  try {
    // Simulate what happens in the component
    console.log('🔍 [DEBUG] handleTextSearch called with query:', query);
    
    if (!query.trim()) {
      console.log('⚠️ [DEBUG] Empty search query, returning early');
      return;
    }
    
    console.log('🔍 [DEBUG] Calling apiService.searchFood with:', query);
    
    // This is our working implementation
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=10`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        console.log('✅ [DEBUG] Found products:', data.products.length);
        
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
            
            if (nutriments['vitamin-c_100g']) {
              nutrients.vitamins['Vitamin C'] = parseFloat(nutriments['vitamin-c_100g']);
            }
            if (nutriments['vitamin-a_100g']) {
              nutrients.vitamins['Vitamin A'] = parseFloat(nutriments['vitamin-a_100g']);
            }
            
            if (nutriments.calcium_100g) {
              nutrients.minerals.Calcium = parseFloat(nutriments.calcium_100g);
            }
            if (nutriments.iron_100g) {
              nutrients.minerals.Iron = parseFloat(nutriments.iron_100g);
            }
            
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
        
        if (foodItems.length > 0) {
          console.log('✅ [DEBUG] Search successful, data length:', foodItems.length);
          
          // This is what should happen in the component:
          console.log('✅ Setting searchResults to:', foodItems.length, 'items');
          console.log('✅ Setting error to: null');
          console.log('✅ Setting isLoading to: false');
          console.log('✅ First item name:', foodItems[0].name);
          console.log('✅ First item calories:', foodItems[0].calories);
          
          // The component should now display the results
          console.log('✅ Component should now display the search results!');
          return;
        }
      }
    }
    
    console.log('❌ [DEBUG] No results found');
  } catch (error) {
    console.error('❌ [DEBUG] Search threw exception:', error);
  }
  
  console.log('❌ Component would show "No foods found" message');
}

testComponentLogic();