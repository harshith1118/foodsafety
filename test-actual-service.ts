// Test the actual apiService implementation
import { apiService } from './src/services/api';

async function testActualApiService() {
  console.log('Testing actual apiService implementation...');
  
  try {
    const result = await apiService.searchFood('apple');
    console.log('Search result:');
    console.log('- Success:', result.success);
    console.log('- Message:', result.message);
    console.log('- Data length:', result.data ? result.data.length : 0);
    
    if (result.data && result.data.length > 0) {
      console.log('- First item name:', result.data[0].name);
      console.log('- First item calories:', result.data[0].calories);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testActualApiService();