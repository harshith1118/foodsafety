// Test our improved search functionality
async function testImprovedSearch() {
  console.log('Testing improved search functionality...\n');
  
  // This simulates what our new searchFood method does
  const testQueries = ['apple', 'banana', 'chicken', 'salmon', 'broccoli', 'curry', 'biryani', 'paneer', 'pasta'];
  
  for (const query of testQueries) {
    console.log(`=== Testing: ${query} ===`);
    
    // Try different search strategies (like our new implementation)
    const searchStrategies = [
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`,
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=5`
    ];
    
    let foundResults = false;
    
    for (let i = 0; i < searchStrategies.length; i++) {
      try {
        const response = await fetch(searchStrategies[i]);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data && Array.isArray(data.products) && data.products.length > 0) {
            console.log(`✅ Strategy ${i + 1} - Found ${data.products.length} products`);
            
            // Show first product
            const firstProduct = data.products[0];
            console.log(`   First product: ${firstProduct.product_name || firstProduct.generic_name || 'Unknown'}`);
            
            if (firstProduct.nutriments) {
              // Count nutrients
              const nutriments = firstProduct.nutriments;
              const vitaminCount = Object.keys(nutriments).filter(key => 
                key.includes('vitamin') || key.includes('Vitamin') || 
                key.includes('folate') || key.includes('Folate')
              ).length;
              
              const mineralCount = Object.keys(nutriments).filter(key => 
                key.includes('calcium') || key.includes('Calcium') ||
                key.includes('iron') || key.includes('Iron') ||
                key.includes('magnesium') || key.includes('Magnesium') ||
                key.includes('phosphorus') || key.includes('Phosphorus') ||
                key.includes('potassium') || key.includes('Potassium') ||
                key.includes('zinc') || key.includes('Zinc') ||
                key.includes('copper') || key.includes('Copper') ||
                key.includes('manganese') || key.includes('Manganese')
              ).length;
              
              console.log(`   Macronutrients: Protein=${nutriments.proteins_100g || 'N/A'}, Carbs=${nutriments.carbohydrates_100g || 'N/A'}, Fat=${nutriments.fat_100g || 'N/A'}`);
              console.log(`   Vitamins found: ${vitaminCount}`);
              console.log(`   Minerals found: ${mineralCount}`);
            }
            
            foundResults = true;
            break;
          }
        }
      } catch (error) {
        console.log(`❌ Strategy ${i + 1} failed:`, error.message);
      }
    }
    
    if (!foundResults) {
      console.log('⚠️ No API results, using mock data');
      // This would trigger our comprehensive mock data system
    }
    
    console.log('');
  }
}

testImprovedSearch();