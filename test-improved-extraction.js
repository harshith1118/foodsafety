// Test our improved nutrition data extraction
import axios from 'axios';

async function testImprovedExtraction() {
  const query = 'banana';
  console.log('Testing improved nutrition extraction for:', query);
  
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&action=process&json=1&page_size=1`;
    const response = await axios.get(url);
    
    if (response.data && Array.isArray(response.data.products) && response.data.products.length > 0) {
      const product = response.data.products[0];
      console.log('Product:', product.product_name || product.generic_name);
      
      if (product.nutriments) {
        // Our new improved extraction method
        const nutriments = product.nutriments;
        const nutrients = {
          protein: parseFloat(nutriments.proteins_100g) || 0,
          carbs: parseFloat(nutriments.carbohydrates_100g) || 0,
          fat: parseFloat(nutriments.fat_100g) || 0,
          fiber: parseFloat(nutriments.fiber_100g) || 0,
          sugar: parseFloat(nutriments.sugars_100g) || 0,
          sodium: parseFloat(nutriments.sodium_100g) || 0,
          vitamins: {},
          minerals: {}
        };
        
        // Extract all vitamin data from nutriments
        for (const key in nutriments) {
          if (key.includes('vitamin') || key.includes('Vitamin') || 
              key.includes('folate') || key.includes('Folate') ||
              key.includes('niacin') || key.includes('Niacin') ||
              key.includes('pantothenic') || key.includes('Pantothenic') ||
              key.includes('biotin') || key.includes('Biotin')) {
            // Convert key to readable format
            let vitaminName = key.replace(/[_-]/g, ' ')
                                .replace(/100g/g, '')
                                .replace(/unit/g, '')
                                .replace(/value/g, '')
                                .trim();
            
            // Capitalize first letter of each word
            vitaminName = vitaminName.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ').trim();
            
            // Remove extra spaces and clean up
            vitaminName = vitaminName.replace(/\s+/g, ' ').trim();
            
            if (vitaminName) {
              const value = parseFloat(nutriments[key]);
              if (!isNaN(value) && value > 0) {
                nutrients.vitamins[vitaminName] = value;
              }
            }
          }
        }
        
        // Extract all mineral data from nutriments
        for (const key in nutriments) {
          if ((key.includes('calcium') || key.includes('Calcium') ||
               key.includes('iron') || key.includes('Iron') ||
               key.includes('magnesium') || key.includes('Magnesium') ||
               key.includes('phosphorus') || key.includes('Phosphorus') ||
               key.includes('potassium') || key.includes('Potassium') ||
               key.includes('zinc') || key.includes('Zinc') ||
               key.includes('copper') || key.includes('Copper') ||
               key.includes('manganese') || key.includes('Manganese') ||
               key.includes('fluoride') || key.includes('Fluoride') ||
               key.includes('selenium') || key.includes('Selenium') ||
               key.includes('chromium') || key.includes('Chromium') ||
               key.includes('molybdenum') || key.includes('Molybdenum') ||
               key.includes('iodine') || key.includes('Iodine')) && 
              !key.includes('unit') && !key.includes('value') && key.includes('100g')) {
            // Convert key to readable format
            let mineralName = key.replace(/[_-]/g, ' ')
                                .replace(/100g/g, '')
                                .replace(/unit/g, '')
                                .replace(/value/g, '')
                                .trim();
            
            // Capitalize first letter
            mineralName = mineralName.charAt(0).toUpperCase() + mineralName.slice(1).toLowerCase();
            mineralName = mineralName.trim();
            
            if (mineralName) {
              const value = parseFloat(nutriments[key]);
              if (!isNaN(value) && value > 0) {
                nutrients.minerals[mineralName] = value;
              }
            }
          }
        }
        
        console.log('\n=== Extracted Nutrition Data ===');
        console.log('Protein:', nutrients.protein);
        console.log('Carbs:', nutrients.carbs);
        console.log('Fat:', nutrients.fat);
        console.log('Fiber:', nutrients.fiber);
        console.log('Sugar:', nutrients.sugar);
        console.log('Sodium:', nutrients.sodium);
        
        console.log('\n=== Vitamins ===');
        if (Object.keys(nutrients.vitamins).length > 0) {
          for (const [vitamin, amount] of Object.entries(nutrients.vitamins)) {
            console.log(`${vitamin}: ${amount}`);
          }
        } else {
          console.log('No vitamins found');
        }
        
        console.log('\n=== Minerals ===');
        if (Object.keys(nutrients.minerals).length > 0) {
          for (const [mineral, amount] of Object.entries(nutrients.minerals)) {
            console.log(`${mineral}: ${amount}`);
          }
        } else {
          console.log('No minerals found');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testImprovedExtraction();