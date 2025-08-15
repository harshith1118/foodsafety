# NutriCare - Professional Nutrition & Health App

NutriCare is a comprehensive nutrition and health application designed to help users make informed food choices and manage their health conditions through personalized nutritional guidance.

## Features

### 🔍 Food Information Search
- **Text Search**: Search for foods by name with intelligent preprocessing and typo correction
- **Image Recognition**: Upload food photos for automatic identification
- **Comprehensive Nutritional Data**: Detailed information on calories, macronutrients, vitamins, and minerals
- **Daily Recommendations**: Serving size guidance and daily consumption limits

### 🏥 Health Condition Management
- **Condition Tracking**: Monitor common health conditions (Common Cold, Fever, Diarrhea, Sore Throat)
- **Personalized Food Recommendations**: Get tailored food suggestions based on your health condition
- **Professional Logos**: Distinctive, production-ready logos for each health condition

### 📅 Daily Routine Management
- **Meal Planning**: Organize your daily meals (breakfast, lunch, dinner, snacks)
- **Nutritional Balance Tracking**: Monitor your daily nutritional intake
- **Calorie Counting**: Keep track of your daily calorie consumption

## Authentication

NutriCare supports multiple authentication methods:

### Email/Password Authentication
- Traditional email and password registration and login
- Secure password validation with strength requirements
- Password reset functionality

### Guest Login
- One-click guest access with no registration required
- Profile setup with name and avatar selection
- Full access to all features with temporary account

## Text Search Functionality

Our enhanced text search allows users to quickly find nutritional information:

1. **User Input**: Type food names like "chicken biryani", "banana", or "paneer butter masala"
2. **Text Preprocessing**: Automatic normalization and typo correction
3. **Intelligent Matching**: Fuzzy matching to handle variations and typos
4. **Comprehensive Results**: Detailed nutritional information for each food item
5. **User-Friendly Display**: Clean, intuitive interface for easy navigation

## Professional Branding

NutriCare features production-ready branding with:
- Distinctive logos for each health condition
- Consistent color scheme and design language
- Professional favicon and main application logo
- No amateurish elements like stars or unnecessary icons

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Custom component library with lucide-react icons
- **State Management**: React Context API
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support
- **API Integration**: 
  - Primary: Edamam Food Database API
  - Fallback: USDA FoodData Central API

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up API credentials:
   - For Edamam API:
     - Sign up for a free account at [Edamam](https://developer.edamam.com/)
     - Create a new application to get your App ID and App Key
     - Replace `YOUR_EDAMAM_APP_ID` and `YOUR_EDAMAM_APP_KEY` in `src/services/api.ts` with your actual credentials
   - For USDA API:
     - The app uses a demo key by default (`DEMO_KEY`)
     - For production use, get your own API key from [USDA FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html)
4. Start the development server: `npm run dev`
5. Build for production: `npm run build`

## Troubleshooting

If the food search functionality is not working:

1. **Check API Credentials**: Ensure you have correctly set your Edamam App ID and App Key in `src/services/api.ts`
2. **Check Network Connection**: Verify that your development server can access the internet
3. **Check Browser Console**: Look for any error messages in the browser's developer console
4. **Edamam API Limits**: The free plan has rate limits. If you've exceeded them, you may need to wait or upgrade your plan

## Development Guidelines

- All logos are production-ready and professionally designed
- Text search functionality follows best practices for food identification
- Health condition management provides personalized recommendations
- Daily routine tracking helps users maintain balanced nutrition
- Authentication follows security best practices

## Documentation

- [Text Search Implementation](docs/TEXT_SEARCH.md)

## License

This project is proprietary and confidential. All rights reserved.