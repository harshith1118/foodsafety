// Test the search functionality directly
import { apiService } from './src/services/api';

async function testSearch() {
  const queries = ['apple', 'banana', 'chicken biryani', 'paneer butter masala'];
  
  for (const query of queries) {
    console.log(`\n=== Testing search for: ${query} ===`);
    try {
      const result = await apiService.searchFood(query);
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      console.log('Data length:', result.data?.length || 0);
      
      if (result.data && result.data.length > 0) {
        console.log('First result:', result.data[0].name);
        console.log('Calories:', result.data[0].calories);
        console.log('Protein:', result.data[0].nutrients.protein);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

testSearch();