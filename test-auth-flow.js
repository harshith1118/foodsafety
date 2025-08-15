// Test the authentication flow
console.log('Testing authentication flow...');

// Clear any existing users
localStorage.removeItem('nutricare_users');

// Test registration
try {
  console.log('1. Testing registration...');
  
  // Simulate registration
  const users = localStorage.getItem('nutricare_users') ? JSON.parse(localStorage.getItem('nutricare_users')) : {};
  const email = 'test@example.com';
  const password = 'Password123!';
  
  // Check if user already exists
  if (users[email.toLowerCase()]) {
    console.log('   User already exists');
  } else {
    // Create user object
    const newUser = {
      id: `user_${Date.now()}`,
      name: 'Test User',
      email: email.toLowerCase(),
      password: password,
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
    users[email.toLowerCase()] = newUser;
    localStorage.setItem('nutricare_users', JSON.stringify(users));
    
    console.log('   Registration successful:', newUser);
  }
} catch (error) {
  console.error('   Registration failed:', error);
}

// Test login
try {
  console.log('2. Testing login...');
  
  // Simulate login
  const users = localStorage.getItem('nutricare_users') ? JSON.parse(localStorage.getItem('nutricare_users')) : {};
  const email = 'test@example.com';
  const password = 'Password123!';
  
  // Find user
  const user = users[email.toLowerCase()] || null;
  if (!user) {
    console.log('   User not found');
  } else {
    // Validate password
    if (user.password === password) {
      console.log('   Login successful:', user);
    } else {
      console.log('   Invalid password');
    }
  }
} catch (error) {
  console.error('   Login failed:', error);
}

// Check what's in localStorage
console.log('3. Current localStorage contents:');
console.log(localStorage.getItem('nutricare_users'));