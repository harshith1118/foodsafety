// Simple test for Open Food Facts API
import axios from 'axios';

async function testSimpleSearch() {
  const query = 'apple';
  console.log(`Testing search for: ${query}`);
  
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3`;
  
  try {
    const response = await axios.get(url);
    console.log(`Status: ${response.status}`);
    console.log(`Data type: ${typeof response.data}`);
    
    if (response.data) {
      console.log(`Products array exists: ${!!response.data.products}`);
      if (response.data.products) {
        console.log(`Number of products: ${response.data.products.length}`);
      }
    }
  } catch (error) {
    console.error(`Error:`, error.message);
  }
}

testSimpleSearch();