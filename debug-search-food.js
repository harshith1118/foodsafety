// Debug test to see exactly what's happening in the searchFood method
import axios from 'axios';

async function debugSearchFood() {
  const query = 'curry';
  console.log('🔍 Debugging searchFood for:', query);
  
  try {
    const normalizedQuery = query.toLowerCase().trim();
    console.log('Normalized query:', normalizedQuery);
    
    // Open Food Facts API - no authentication required
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(normalizedQuery)}&action=process&json=1&page_size=10`;
    
    console.log('📡 Making request to:', url);
    
    const response = await axios.get(url);
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response data type:', typeof response.data);
    console.log('✅ Response data keys:', response.data ? Object.keys(response.data) : 'null');
    
    // Check if we have a valid response with products
    if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
      console.log('✅ Found', response.data.products.length, 'products');
      
      const foodItems = [];
      
      // Process all products
      for (const product of response.data.products) {
        try {
          // Skip if no product name
          if (!product.product_name && !product.generic_name) {
            console.log('⚠️ Skipping product with no name');
            continue;
          }
          
          console.log('Processing product:', product.product_name || product.generic_name);
          
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
          
          // Add minerals if available
          if (nutriments.calcium_100g) {
            nutrients.minerals.Calcium = parseFloat(nutriments.calcium_100g);
          }
          if (nutriments.iron_100g) {
            nutrients.minerals.Iron = parseFloat(nutriments.iron_100g);
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
            console.log('✅ Added food item:', foodItem.name);
          } else {
            console.log('⚠️ Skipping food item with invalid name');
          }
        } catch (processError) {
          console.error('❌ Error processing product:', processError);
        }
      }
      
      console.log('✅ Successfully processed', foodItems.length, 'food items');
      
      // Return results if we have any
      if (foodItems.length > 0) {
        console.log('✅ Returning', foodItems.length, 'food items');
        const result = {
          success: true,
          data: foodItems,
          message: `Found ${foodItems.length} food item(s)!`
        };
        console.log('Result:', JSON.stringify(result, null, 2));
        return result;
      } else {
        console.log('⚠️ No valid food items after processing');
      }
    } else {
      console.log('⚠️ No valid products in response');
      if (response.data) {
        console.log('⚠️ Response data structure:', {
          hasData: !!response.data,
          hasProducts: !!(response.data && response.data.products),
          productsType: response.data && response.data.products ? typeof response.data.products : 'undefined',
          productsLength: response.data && response.data.products ? response.data.products.length : 0
        });
      }
    }
    
    console.log('⚠️ No valid foods found in response');
  } catch (error) {
    console.error('❌ API Error:', error.message);
    console.error('❌ Error details:', error);
  }
  
  console.log('📱 Using fallback mock data');
  return {
    success: true,
    data: [{
      id: 'mock-1',
      name: query.charAt(0).toUpperCase() + query.slice(1),
      calories: 200,
      nutrients: {
        protein: 10,
        carbs: 30,
        fat: 5,
        fiber: 2,
        sugar: 8,
        sodium: 100,
        vitamins: { 'Vitamin C': 10, 'Vitamin A': 150 },
        minerals: { Iron: 2, Calcium: 50, Potassium: 200 }
      },
      servingSize: '100g',
      imageUrl: ''
    }],
    message: `Showing results for "${query}" (demo data)`
  };
}

debugSearchFood();