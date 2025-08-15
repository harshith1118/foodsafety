// Test our API service implementation
import { apiService } from './src/services/api';

async function testApiService() {
  console.log('Testing apiService.searchFood...');
  
  try {
    const result = await apiService.searchFood('banana');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testApiService().catch(console.error);