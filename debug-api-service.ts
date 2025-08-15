// Debug the actual apiService call
import { apiService } from './src/services/api';

async function debugApiService() {
  const query = 'apple';
  console.log('Debugging apiService.searchFood for:', query);
  
  try {
    console.log('Calling apiService.searchFood...');
    const result = await apiService.searchFood(query);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error calling apiService.searchFood:', error);
  }
}

debugApiService();