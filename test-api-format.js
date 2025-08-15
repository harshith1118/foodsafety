// Simple test to check API response format
async function testApiFormat() {
  const query = 'banana';
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3`;
  
  console.log('Testing API response format for:', query);
  console.log('URL:', url);
  
  try {
    const response = await fetch(url);
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Data structure:');
      console.log('- has products:', !!data.products);
      console.log('- products type:', typeof data.products);
      if (Array.isArray(data.products)) {
        console.log('- products length:', data.products.length);
        if (data.products.length > 0) {
          console.log('- first product keys:', Object.keys(data.products[0]));
          console.log('- first product name:', data.products[0].product_name);
          console.log('- has nutriments:', !!data.products[0].nutriments);
          if (data.products[0].nutriments) {
            console.log('- nutriments keys:', Object.keys(data.products[0].nutriments));
          }
        }
      }
    } else {
      console.log('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testApiFormat();