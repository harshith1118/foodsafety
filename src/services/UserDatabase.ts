// User database service
import { User } from '../types';

// Mock database using localStorage
class UserDatabase {
  private static instance: UserDatabase;
  private dbName = 'nutricare_users';
  
  private constructor() {}
  
  static getInstance(): UserDatabase {
    if (!UserDatabase.instance) {
      UserDatabase.instance = new UserDatabase();
    }
    return UserDatabase.instance;
  }
  
  // Get all users
  getUsers(): Record<string, any> {
    const users = localStorage.getItem(this.dbName);
    return users ? JSON.parse(users) : {};
  }
  
  // Save users to database
  saveUsers(users: Record<string, any>): void {
    localStorage.setItem(this.dbName, JSON.stringify(users));
  }
  
  // Find user by email
  findUserByEmail(email: string): User | null {
    const users = this.getUsers();
    const userEmail = email.toLowerCase();
    return users[userEmail] || null;
  }
  
  // Create new user
  createUser(userData: { 
    name: string; 
    email: string; 
    password: string; 
    authType: 'email' | 'google'; 
    preferences?: any 
  }): User {
    const users = this.getUsers();
    const email = userData.email.toLowerCase();
    
    // Check if user already exists
    if (users[email]) {
      throw new Error('User with this email already exists');
    }
    
    // Create user object
    const newUser: any = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: email,
      password: userData.password, // In a real app, this should be hashed
      authType: userData.authType,
      createdAt: new Date().toISOString(),
      preferences: userData.preferences || {
        dietaryRestrictions: [],
        allergies: [],
        healthGoals: [],
        preferredUnits: 'metric'
      }
    };
    
    // Save to database
    users[email] = newUser;
    this.saveUsers(users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }
  
  // Update user
  updateUser(email: string, userData: Partial<User>): User {
    const users = this.getUsers();
    const userEmail = email.toLowerCase();
    
    if (!users[userEmail]) {
      throw new Error('User not found');
    }
    
    // Update user data
    users[userEmail] = {
      ...users[userEmail],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveUsers(users);
    
    // Return updated user without password
    const { password, ...userWithoutPassword } = users[userEmail];
    return userWithoutPassword as User;
  }
  
  // Validate password
  validatePassword(email: string, password: string): boolean {
    const users = this.getUsers();
    const userEmail = email.toLowerCase();
    
    if (!users[userEmail]) {
      return false;
    }
    
    return users[userEmail].password === password;
  }
  
  // Change password
  changePassword(email: string, newPassword: string): void {
    const users = this.getUsers();
    const userEmail = email.toLowerCase();
    
    if (!users[userEmail]) {
      throw new Error('User not found');
    }
    
    users[userEmail].password = newPassword;
    this.saveUsers(users);
  }
  
  // Delete user
  deleteUser(email: string): void {
    const users = this.getUsers();
    const userEmail = email.toLowerCase();
    
    delete users[userEmail];
    this.saveUsers(users);
  }
  
  // Check if user exists
  userExists(email: string): boolean {
    const users = this.getUsers();
    const userEmail = email.toLowerCase();
    return !!users[userEmail];
  }
}

export const userDb = UserDatabase.getInstance();