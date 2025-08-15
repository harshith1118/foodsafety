// Test the actual apiService directly
import axios from 'axios';

// Recreate the exact searchFood method logic
async function testActualApiService() {
  const query = 'curry';
  console.log('Testing actual apiService implementation for:', query);
  
  try {
    const normalizedQuery = query.toLowerCase().trim();
    
    console.log('🔍 [OpenFoodFacts] Searching for:', normalizedQuery);
    
    // Open Food Facts API - no authentication required
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(normalizedQuery)}&action=process&json=1&page_size=10`;
    
    console.log('📡 [OpenFoodFacts] Making request to:', url);
    
    const response = await axios.get(url);
    
    console.log('✅ [OpenFoodFacts] Response status:', response.status);
    
    // Check if we have a valid response with products
    if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
      console.log('✅ [OpenFoodFacts] Found', response.data.products.length, 'products');
      
      const foodItems = [];
      
      // Process all products
      for (const product of response.data.products) {
        try {
          // Skip if no product name
          if (!product.product_name && !product.generic_name) {
            continue;
          }
          
          // Extract nutrition data with better error handling
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
          if (nutriments['vitamin-b1_100g']) {
            nutrients.vitamins['Vitamin B1'] = parseFloat(nutriments['vitamin-b1_100g']);
          }
          if (nutriments['vitamin-b6_100g']) {
            nutrients.vitamins['Vitamin B6'] = parseFloat(nutriments['vitamin-b6_100g']);
          }
          if (nutriments['vitamin-b12_100g']) {
            nutrients.vitamins['Vitamin B12'] = parseFloat(nutriments['vitamin-b12_100g']);
          }
          
          // Add minerals if available
          if (nutriments.calcium_100g) {
            nutrients.minerals.Calcium = parseFloat(nutriments.calcium_100g);
          }
          if (nutriments.iron_100g) {
            nutrients.minerals.Iron = parseFloat(nutriments.iron_100g);
          }
          if (nutriments.potassium_100g) {
            nutrients.minerals.Potassium = parseFloat(nutriments.potassium_100g);
          }
          if (nutriments.magnesium_100g) {
            nutrients.minerals.Magnesium = parseFloat(nutriments.magnesium_100g);
          }
          
          // Calculate calories if not provided
          let calories = 0;
          if (nutriments['energy-kcal_100g']) {
            calories = parseFloat(nutriments['energy-kcal_100g']);
          } else if (nutriments.energy_100g) {
            calories = parseFloat(nutriments.energy_100g);
          } else if (nutriments.energy_value) {
            calories = parseFloat(nutriments.energy_value);
          }
          
          // Fallback calculation if still 0
          if (calories === 0) {
            calories = Math.round(
              (nutrients.protein * 4) + 
              (nutrients.carbs * 4) + 
              (nutrients.fat * 9)
            );
          }
          
          const foodItem = {
            id: `off-${product.code || Date.now()}-${foodItems.length}`,
            name: product.product_name || product.generic_name || normalizedQuery,
            calories: calories,
            nutrients: nutrients,
            servingSize: product.serving_size || '100g',
            imageUrl: product.image_url || ''
          };
          
          // Add item if it has a valid name
          if (foodItem.name && foodItem.name.trim() !== '') {
            foodItems.push(foodItem);
          }
        } catch (processError) {
          console.error('❌ [OpenFoodFacts] Error processing product:', processError);
        }
      }
      
      console.log('✅ [OpenFoodFacts] Successfully processed', foodItems.length, 'food items');
      
      // Return results if we have any
      if (foodItems.length > 0) {
        console.log('✅ [OpenFoodFacts] Returning', foodItems.length, 'food items');
        const result = {
          success: true,
          data: foodItems,
          message: `Found ${foodItems.length} food item(s)!`
        };
        console.log('✅ SUCCESS! This is what should be returned by apiService.searchFood');
        console.log('✅ Data length:', result.data.length);
        console.log('✅ First item:', result.data[0].name);
        return result;
      }
    }
  } catch (error) {
    console.error('❌ [OpenFoodFacts] API Error:', error.message);
  }
  
  console.log('❌ FAILED: No results returned');
  return null;
}

testActualApiService();