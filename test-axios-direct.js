// Simple test to check if the apiService is working correctly
import axios from 'axios';

async function testApiServiceDirect() {
  const query = 'apple';
  console.log('Testing apiService directly for:', query);
  
  try {
    // Use the exact same API call as in our fixed method
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=10`;
    
    console.log('Making request to:', url);
    
    const response = await axios.get(url);
    
    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data keys:', response.data ? Object.keys(response.data) : 'null');
    
    // Check if we have a valid response with products
    if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
      console.log('✅ Found', response.data.products.length, 'products');
      
      // Check the structure of the first product
      const firstProduct = response.data.products[0];
      console.log('First product keys:', Object.keys(firstProduct));
      console.log('First product name:', firstProduct.product_name);
      
      // Check nutriments
      if (firstProduct.nutriments) {
        console.log('Nutriments keys:', Object.keys(firstProduct.nutriments));
        console.log('Protein:', firstProduct.nutriments.proteins_100g);
        console.log('Carbs:', firstProduct.nutriments.carbohydrates_100g);
        console.log('Fat:', firstProduct.nutriments.fat_100g);
        console.log('Calories (kcal):', firstProduct.nutriments['energy-kcal_100g']);
        console.log('Calories (kj):', firstProduct.nutriments.energy_100g);
        console.log('Calories (value):', firstProduct.nutriments.energy_value);
      }
    } else {
      console.log('⚠️ No valid products in response');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApiServiceDirect();