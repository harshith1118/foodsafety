// Test using the exact same structure as the actual application
import { apiService } from './src/services/api';

async function testRealApiService() {
  console.log('Testing the REAL apiService from the application...');
  
  try {
    const result = await apiService.searchFood('curry');
    console.log('✅ apiService.searchFood("curry") returned:');
    console.log('- success:', result.success);
    console.log('- message:', result.message);
    console.log('- data length:', result.data ? result.data.length : 0);
    
    if (result.data && result.data.length > 0) {
      console.log('- first item name:', result.data[0].name);
      console.log('- first item calories:', result.data[0].calories);
    }
    
    // This is exactly what the component does
    if (result.success) {
      console.log('✅ Component should set searchResults to:', result.data.length, 'items');
      console.log('✅ Component should set error to: null');
      console.log('✅ Component should set isLoading to: false');
      console.log('✅ Component should SHOW THE SEARCH RESULTS!');
    } else {
      console.log('❌ Component would show error:', result.message);
    }
  } catch (error) {
    console.error('❌ Error calling apiService:', error);
  }
}

testRealApiService();