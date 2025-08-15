// Simple test for specific searches
import axios from 'axios';

async function testSimpleSearch() {
  const query = 'banana';
  console.log('Testing search for:', query);
  
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=1`;
    const response = await axios.get(url);
    
    if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
      const product = response.data.products[0];
      console.log('Product:', product.product_name || product.generic_name);
      
      if (product.nutriments) {
        console.log('Nutriments count:', Object.keys(product.nutriments).length);
        
        // Check for vitamins
        const vitaminKeys = Object.keys(product.nutriments).filter(key => 
          key.includes('vitamin') || key.includes('Vitamin') || key.includes('folate')
        );
        console.log('Vitamin keys found:', vitaminKeys);
        
        // Check for minerals
        const mineralKeys = Object.keys(product.nutriments).filter(key => 
          key.includes('calcium') || key.includes('iron') || key.includes('magnesium') || 
          key.includes('phosphorus') || key.includes('potassium') || key.includes('zinc') ||
          key.includes('copper') || key.includes('manganese')
        );
        console.log('Mineral keys found:', mineralKeys);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSimpleSearch();