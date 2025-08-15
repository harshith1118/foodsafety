// Test authentication functionality
import { authService } from './src/services/AuthService';
import { userDb } from './src/services/UserDatabase';

// Clear any existing test users
localStorage.removeItem('nutricare_users');

console.log('Testing authentication functionality...');

// Test 1: Register a new user
try {
  console.log('1. Testing user registration...');
  const user = await authService.register('Test User', 'test@example.com', 'Password123!');
  console.log('   Registration successful:', user);
} catch (error) {
  console.error('   Registration failed:', error);
}

// Test 2: Login with correct credentials
try {
  console.log('2. Testing login with correct credentials...');
  const user = await authService.login('test@example.com', 'Password123!');
  console.log('   Login successful:', user);
} catch (error) {
  console.error('   Login failed:', error);
}

// Test 3: Login with incorrect credentials
try {
  console.log('3. Testing login with incorrect credentials...');
  await authService.login('test@example.com', 'WrongPassword');
  console.log('   ERROR: Login should have failed but did not');
} catch (error) {
  console.log('   Login correctly failed:', error.message);
}

// Test 4: Try to register the same user again
try {
  console.log('4. Testing duplicate user registration...');
  await authService.register('Test User 2', 'test@example.com', 'Password123!');
  console.log('   ERROR: Registration should have failed but did not');
} catch (error) {
  console.log('   Registration correctly failed:', error.message);
}

console.log('Authentication tests completed.');