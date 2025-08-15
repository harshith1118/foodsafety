// Simple test to check if our fixed API service is working
async function testApiDirectly() {
  const query = 'apple';
  console.log('Testing API directly for:', query);
  
  try {
    // Make the same request as in our fixed service
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=10`;
    
    console.log('Making request to:', url);
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response received successfully');
      console.log('Products found:', data.products ? data.products.length : 0);
      
      // Check if we have the expected structure
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        console.log('✓ API is working correctly');
        console.log('✓ Found products array with', data.products.length, 'items');
        console.log('✓ First product name:', data.products[0].product_name || 'No name');
      } else {
        console.log('✗ Unexpected response structure');
      }
    } else {
      console.log('HTTP Error:', response.status);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testApiDirectly();