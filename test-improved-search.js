// Test the improved search functionality
async function testImprovedSearch() {
  const queries = ['curry', 'banana', 'chicken biryani', 'paneer butter masala'];
  
  for (const query of queries) {
    console.log(`\n=== Testing search for: ${query} ===`);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3`;
    
    try {
      const response = await fetch(url);
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Found ${data.products?.length || 0} products`);
        
        if (data.products && data.products.length > 0) {
          console.log('Sample products:');
          data.products.slice(0, 2).forEach((product, index) => {
            console.log(`${index + 1}. ${product.product_name || product.generic_name || 'Unknown product'}`);
          });
        }
      } else {
        console.log('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error(`Error searching for ${query}:`, error.message);
    }
  }
}

testImprovedSearch();