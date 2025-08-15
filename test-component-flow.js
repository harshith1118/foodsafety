// Test that exactly mimics what happens in the component
async function testComponentFlow() {
  const searchQuery = 'curry';
  console.log('Testing exact component flow for:', searchQuery);
  
  let isLoading = true;
  let error = null;
  let searchResults = [];
  
  console.log('Initial state:');
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);
  console.log('- searchResults.length:', searchResults.length);
  console.log('- searchQuery.trim() !== "":', searchQuery.trim() !== '');
  
  // Simulate component behavior
  console.log('\n=== Component search started ===');
  isLoading = true;
  error = null;
  searchResults = [];
  
  console.log('State after initialization:');
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);
  console.log('- searchResults.length:', searchResults.length);
  
  try {
    console.log('\n🔍 Calling apiService.searchFood with:', searchQuery);
    
    // Make the API call
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&action=process&json=1&page_size=10`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
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
        
        if (foodItems.length > 0) {
          console.log('✅ Search successful, data length:', foodItems.length);
          searchResults = foodItems;
          error = null; // Clear any previous error
        } else {
          console.log('⚠️ No valid food items processed');
          error = 'No foods found. Try searching for something else.';
        }
      } else {
        console.log('⚠️ No products in response');
        error = 'No foods found. Try searching for something else.';
      }
    } else {
      console.log('❌ HTTP Error:', response.status);
      error = 'Failed to search for foods. Please try again.';
    }
  } catch (err) {
    console.error('❌ Search threw exception:', err);
    error = 'Failed to search for foods. Please try again.';
  } finally {
    isLoading = false;
  }
  
  console.log('\n=== Final state ===');
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);
  console.log('- searchResults.length:', searchResults.length);
  console.log('- searchQuery.trim() !== "":', searchQuery.trim() !== '');
  
  // Check which UI element should be displayed
  console.log('\n=== UI Decision Logic ===');
  if (isLoading) {
    console.log('📱 Should show: Loading State');
  } else if (error) {
    console.log('❌ Should show: Error Message -', error);
  } else if (searchResults.length > 0) {
    console.log('✅ Should show: Search Results -', searchResults.length, 'items');
    console.log('   First item:', searchResults[0].name);
  } else if (searchQuery.trim() !== '' && !error) {
    console.log('⚠️ Should show: No Results Message');
  } else {
    console.log('📝 Should show: Search Interface');
  }
}

testComponentFlow();