// Test Open Food Facts API directly
async function testOpenFoodFacts() {
  const query = 'banana';
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`;
  
  console.log('Testing Open Food Facts API for:', query);
  console.log('Making request to:', url);
  
  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Found', data.products?.length || 0, 'products');
      
      if (data.products && data.products.length > 0) {
        console.log('First product:', data.products[0].product_name);
        
        if (data.products[0].nutriments) {
          console.log('Nutrients available:');
          console.log('  Proteins:', data.products[0].nutriments.proteins_100g);
          console.log('  Carbs:', data.products[0].nutriments.carbohydrates_100g);
          console.log('  Fat:', data.products[0].nutriments.fat_100g);
          console.log('  Calories:', data.products[0].nutriments.energy_value);
        }
      }
    } else {
      console.log('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testOpenFoodFacts();