# NutriCare - Professional Nutrition & Health App

## Text Search Functionality

Our enhanced text search feature allows users to quickly find nutritional information for foods by name. The search follows a robust process to ensure accurate results:

### 1. Text Entry Approach

Users can enter food names directly into the search field. Examples include:
- "chicken biryani"
- "banana"
- "paneer butter masala"

### 2. Text Preprocessing

Before searching, the system normalizes the input:
- Converts text to lowercase
- Removes extra spaces
- Handles common typos with fuzzy matching

### 3. Matching to Nutritional Database

The system searches our comprehensive food database which includes:
- USDA FoodData Central data
- Edamam Nutrition API information
- Open Food Facts data

### 4. Output Information

For each food item, we display:
- Calories per serving
- Macronutrients (protein, carbs, fat)
- Vitamins and minerals
- Standard serving size
- Daily consumption recommendations
- Important health warnings

### 5. User Interface

The clean, intuitive interface makes it easy for users to:
- Enter food names
- View search results
- Select foods for detailed information
- Navigate back to search

This implementation follows best practices for food search applications and provides users with accurate, actionable nutritional information.