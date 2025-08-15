// Test the API service directly
import { apiService } from './dist/services/api';

async function testApiService() {
  const queries = ['apple', 'banana', 'chicken'];
  
  for (const query of queries) {
    console.log(`\n=== Testing API service for: ${query} ===`);
    
    try {
      const response = await apiService.searchFood(query);
      console.log(`Success: ${response.success}`);
      console.log(`Message: ${response.message}`);
      console.log(`Data length: ${response.data?.length || 0}`);
      
      if (response.data && response.data.length > 0) {
        console.log(`First item: ${response.data[0].name}`);
        console.log(`Calories: ${response.data[0].calories}`);
      }
    } catch (error) {
      console.error(`Error:`, error);
    }
  }
}

testApiService();