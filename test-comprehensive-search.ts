// Comprehensive test for the search functionality
import axios from 'axios';

async function testSearchFunctionality() {
  const testQueries = ['apple', 'chicken', 'curry', 'banana', 'bread', 'milk', 'rice', 'pasta'];
  
  console.log('Testing search functionality for various food items...\n');
  
  for (const query of testQueries) {
    console.log(`=== Testing: ${query} ===`);
    
    try {
      // Test the exact same API call that our service uses
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=20`;
      console.log(`Making request to: ${url}`);
      
      const response = await axios.get(url);
      
      console.log(`Status: ${response.status}`);
      
      if (response.data && response.data.products) {
        console.log(`Products found: ${Array.isArray(response.data.products) ? response.data.products.length : 0}`);
        
        if (Array.isArray(response.data.products) && response.data.products.length > 0) {
          // Show first few product names
          const sampleProducts = response.data.products.slice(0, 3);
          console.log('Sample products:');
          sampleProducts.forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.product_name || product.generic_name || 'Unnamed product'}`);
          });
          
          // Check nutrition data for first product
          const firstProduct = response.data.products[0];
          if (firstProduct.nutriments) {
            console.log('Nutrition data available:');
            console.log(`  Calories: ${firstProduct.nutriments.energy_value || firstProduct.nutriments.energy_100g || 'N/A'}`);
            console.log(`  Protein: ${firstProduct.nutriments.proteins_100g || 'N/A'}g`);
            console.log(`  Carbs: ${firstProduct.nutriments.carbohydrates_100g || 'N/A'}g`);
            console.log(`  Fat: ${firstProduct.nutriments.fat_100g || 'N/A'}g`);
          }
        }
      } else {
        console.log('No products data in response');
      }
    } catch (error) {
      console.error(`Error for "${query}":`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
}

testSearchFunctionality().catch(console.error);