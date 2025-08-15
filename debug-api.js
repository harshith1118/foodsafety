// Debug test to see exactly what's happening with the API response
async function debugApiCall() {
  const query = 'apple';
  console.log('Debugging API call for:', query);
  
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=5`;
    console.log('Making request to:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Data received:');
      console.log('- Type of data:', typeof data);
      console.log('- Data keys:', Object.keys(data || {}));
      
      if (data) {
        console.log('- Has products property:', 'products' in data);
        if (data.products) {
          console.log('- Products type:', typeof data.products);
          console.log('- Products length:', data.products.length);
          if (data.products.length > 0) {
            console.log('- First product:', data.products[0]);
          }
        }
      }
    } else {
      console.log('HTTP Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

debugApiCall();