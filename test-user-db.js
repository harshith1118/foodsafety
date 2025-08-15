// Simple test for user database functionality
const dbName = 'nutricare_users';

// Clear any existing test users
localStorage.removeItem(dbName);

console.log('Testing user database functionality...');

// Test creating a user
try {
  console.log('1. Testing user creation...');
  
  // Simulate the createUser function
  const users = localStorage.getItem(dbName) ? JSON.parse(localStorage.getItem(dbName)) : {};
  const email = 'test@example.com';
  
  // Check if user already exists
  if (users[email]) {
    throw new Error('User with this email already exists');
  }
  
  // Create user object
  const newUser = {
    id: `user_${Date.now()}`,
    name: 'Test User',
    email: email,
    password: 'Password123!',
    authType: 'email',
    createdAt: new Date().toISOString(),
    preferences: {
      dietaryRestrictions: [],
      allergies: [],
      healthGoals: [],
      preferredUnits: 'metric'
    }
  };
  
  // Save to database
  users[email] = newUser;
  localStorage.setItem(dbName, JSON.stringify(users));
  
  console.log('   User creation successful:', newUser);
} catch (error) {
  console.error('   User creation failed:', error);
}

// Test finding a user
try {
  console.log('2. Testing user lookup...');
  
  // Simulate the findUserByEmail function
  const users = localStorage.getItem(dbName) ? JSON.parse(localStorage.getItem(dbName)) : {};
  const email = 'test@example.com';
  const user = users[email] || null;
  
  if (user) {
    console.log('   User lookup successful:', user);
  } else {
    console.log('   User not found');
  }
} catch (error) {
  console.error('   User lookup failed:', error);
}

// Test validating password
try {
  console.log('3. Testing password validation...');
  
  // Simulate the validatePassword function
  const users = localStorage.getItem(dbName) ? JSON.parse(localStorage.getItem(dbName)) : {};
  const email = 'test@example.com';
  
  if (!users[email]) {
    console.log('   User not found');
  } else {
    const isValid = users[email].password === 'Password123!';
    console.log('   Password validation result:', isValid);
  }
} catch (error) {
  console.error('   Password validation failed:', error);
}

console.log('User database tests completed.');