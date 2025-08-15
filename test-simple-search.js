// Simple test for search functionality
async function testSimpleSearch() {
  const testQueries = ['apple', 'chicken', 'curry', 'banana'];
  
  console.log('Testing search functionality...\n');
  
  for (const query of testQueries) {
    console.log(`=== Testing: ${query} ===`);
    
    try {
      // Test the exact same API call that our service uses
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=5`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url);
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.products) {
          console.log(`Products found: ${Array.isArray(data.products) ? data.products.length : 0}`);
          
          if (Array.isArray(data.products) && data.products.length > 0) {
            // Show first few product names
            const sampleProducts = data.products.slice(0, 3);
            console.log('Sample products:');
            sampleProducts.forEach((product, index) => {
              console.log(`  ${index + 1}. ${product.product_name || product.generic_name || 'Unnamed product'}`);
            });
          }
        } else {
          console.log('No products data in response');
        }
      } else {
        console.log(`HTTP Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error for "${query}":`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
}

testSimpleSearch().catch(console.error);