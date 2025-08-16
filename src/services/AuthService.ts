// Authentication service
import { User } from '../types';
import { userDb } from './UserDatabase';

class AuthService {
  private static instance: AuthService;
  
  private constructor() {}
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  // Validate password strength
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Validate email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Register new user
  async register(name: string, email: string, password: string): Promise<User> {
    // Validate input
    if (!name?.trim()) {
      throw new Error('Name is required');
    }
    
    if (!email?.trim()) {
      throw new Error('Email is required');
    }
    
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }
    
    // Create user in database
    const user = userDb.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      authType: 'email',
      preferences: {
        dietaryRestrictions: [],
        allergies: [],
        healthGoals: [],
        preferredUnits: 'metric'
      }
    });
    
    return user;
  }
  
  // Login user
  async login(email: string, password: string): Promise<User> {
    // Validate input
    if (!email?.trim()) {
      throw new Error('Email is required');
    }
    
    if (!password?.trim()) {
      throw new Error('Password is required');
    }
    
    // Find user
    const user = userDb.findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Validate password
    if (!userDb.validatePassword(email.toLowerCase().trim(), password)) {
      throw new Error('Invalid email or password');
    }
    
    // Return user without password
    return user;
  }
  
  // Guest login - create a temporary guest user
  async guestLogin(): Promise<User> {
    // Generate a simple guest identifier
    const guestId = `guest_${Date.now()}`;
    const guestEmail = `${guestId}@nutricare.local`;
    const guestName = `Guest`;
    
    // Check if guest user already exists (shouldn't happen with unique ID)
    let guestUser = userDb.findUserByEmail(guestEmail);
    
    if (!guestUser) {
      // Create guest user in database
      guestUser = userDb.createUser({
        name: guestName,
        email: guestEmail,
        password: '', // No password for guest users
        authType: 'guest',
        preferences: {
          dietaryRestrictions: [],
          allergies: [],
          healthGoals: [],
          preferredUnits: 'metric'
        }
      });
    }
    
    return guestUser;
  }
  
  // Update guest profile
  async updateGuestProfile(email: string, name: string, avatar?: string): Promise<User> {
    try {
      const updatedUser = userDb.updateUser(email.toLowerCase().trim(), {
        name: name.trim(),
        ...(avatar && { avatar })
      });
      return updatedUser;
    } catch (error) {
      console.error('Failed to update guest profile:', error);
      throw new Error('Failed to update guest profile. Please try again.');
    }
  }
  
  // Forgot password - simulate sending email
  async forgotPassword(email: string): Promise<void> {
    if (!email?.trim()) {
      throw new Error('Email is required');
    }
    
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    const user = userDb.findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      // Don't reveal if user exists or not for security
      // But still simulate email sending delay (reduced for faster UX)
      await new Promise(resolve => setTimeout(resolve, 100));
      return;
    }
    
    // Generate a secure reset token
    // const resetToken = Math.random().toString(36).substring(2, 15) + 
    //                   Math.random().toString(36).substring(2, 15);
    
    // In a production app, you would save the token with expiration time in a database
    // For now, we'll just log it (commented out for performance)
    // console.log(`Reset token for ${email}: ${resetToken}`);
    
    // Simulate email sending (reduced delay for faster UX)
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Reset password
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    // Validate inputs
    if (!email?.trim()) {
      throw new Error('Email is required');
    }
    
    if (!token?.trim()) {
      throw new Error('Reset token is required');
    }
    
    const passwordValidation = this.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }
    
    // In a real implementation, we would validate the token
    // For now, we'll just simulate the process
    
    const user = userDb.findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Invalid request');
    }
    
    // Update password
    userDb.changePassword(email.toLowerCase().trim(), newPassword);
  }
  
  // Change password
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    // Validate inputs
    if (!currentPassword?.trim()) {
      throw new Error('Current password is required');
    }
    
    if (!newPassword?.trim()) {
      throw new Error('New password is required');
    }
    
    const passwordValidation = this.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }
    
    // Validate current password
    if (!userDb.validatePassword(email.toLowerCase().trim(), currentPassword)) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    userDb.changePassword(email.toLowerCase().trim(), newPassword);
  }
  
  // Update user profile
  async updateProfile(email: string, userData: Partial<User>): Promise<User> {
    const user = userDb.updateUser(email.toLowerCase().trim(), userData);
    return user;
  }
  
  // Delete user account
  async deleteAccount(email: string): Promise<void> {
    userDb.deleteUser(email.toLowerCase().trim());
  }
}

export const authService = AuthService.getInstance();