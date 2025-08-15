// Professional authentication form component
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Key } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

interface ProfessionalAuthFormProps {
  onSuccess: () => void;
  onGuestLogin: () => void;
}

export const ProfessionalAuthForm: React.FC<ProfessionalAuthFormProps> = ({ onSuccess, onGuestLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
    errors: string[];
  }>({ score: 0, label: '', color: '', errors: [] });
  
  const { login, register, forgotPassword, guestLogin } = useAuth();
  
  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const errors: string[] = [];
    
    if (password.length >= 8) score += 1;
    else errors.push('At least 8 characters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else errors.push('One uppercase letter');
    
    if (/[a-z]/.test(password)) score += 1;
    else errors.push('One lowercase letter');
    
    if (/\d/.test(password)) score += 1;
    else errors.push('One number');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else errors.push('One special character');
    
    const strengthLevels = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-orange-500' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-blue-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-emerald-500' }
    ];
    
    return {
      score,
      label: strengthLevels[score].label,
      color: strengthLevels[score].color,
      errors
    };
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if ((mode === 'login' || mode === 'register') && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (mode === 'register' && formData.password.trim()) {
      const passwordValidation = calculatePasswordStrength(formData.password);
      if (passwordValidation.score < 3) {
        newErrors.password = 'Password is too weak. ' + passwordValidation.errors.join(', ');
      }
    }
    
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setAuthError(null);
    setSuccessMessage(null);
    
    try {
      switch (mode) {
        case 'login':
          await login(formData.email, formData.password);
          break;
          
        case 'register':
          await register(formData.name, formData.email, formData.password);
          break;
          
        case 'forgot-password':
          await forgotPassword(formData.email);
          setSuccessMessage('Password reset instructions have been sent to your email. Please check your inbox (and spam folder).');
          setIsLoading(false);
          return; // Don't call onSuccess() for forgot password
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
    // Handle Guest login
  const handleGuestLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setSuccessMessage(null);
    
    try {
      await guestLogin();
      // Always show profile setup for guest users
      onGuestLogin();
    } catch (error: any) {
      console.error('Guest login error:', error);
      setAuthError(error.message || 'Guest login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    
    if (password) {
      const strength = calculatePasswordStrength(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', errors: [] });
    }
  };
  
  // Render form based on mode
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return renderLoginForm();
      case 'register':
        return renderRegisterForm();
      case 'forgot-password':
        return renderForgotPasswordForm();
    }
  };
  
  // Login form
  const renderLoginForm = () => (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img src="/logos/navbar-logo.svg" alt="NutriCare Logo" className="w-12 h-12" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2 shadow-md">
              <span className="text-white text-xs">✨</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-700 font-medium">Sign in to continue your nutrition journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          icon={<Mail size={20} />}
          error={errors.email}
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter your password"
            icon={<Lock size={20} />}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setMode('forgot-password')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Forgot Password?
          </button>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          size="lg"
        >
          Sign In
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-600 font-medium">Or continue as</span>
          </div>
        </div>
        
        <div className="mt-5 space-y-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleGuestLogin}
            isLoading={isLoading}
          >
            <User size={20} className="mr-2" />
            Guest User
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrors({});
            setAuthError(null);
            setSuccessMessage(null);
          }}
          className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </>
  );
  
  // Register form
  const renderRegisterForm = () => (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img src="/logos/navbar-logo.svg" alt="NutriCare Logo" className="w-12 h-12" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2 shadow-md">
              <span className="text-white text-xs">✨</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-gray-700 font-medium">Start your personalized nutrition journey today</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your full name"
          icon={<User size={20} />}
          error={errors.name}
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          icon={<Mail size={20} />}
          error={errors.email}
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="Create a strong password"
            icon={<Lock size={20} />}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {formData.password && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Password Strength:</span>
              <span className={`font-medium ${passwordStrength.color.includes('red') ? 'text-red-500' : passwordStrength.color.includes('orange') ? 'text-orange-500' : passwordStrength.color.includes('yellow') ? 'text-yellow-500' : passwordStrength.color.includes('blue') ? 'text-blue-500' : passwordStrength.color.includes('green') ? 'text-green-500' : passwordStrength.color.includes('emerald') ? 'text-emerald-500' : 'text-gray-500'}`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              ></div>
            </div>
            {passwordStrength.errors && passwordStrength.errors.length > 0 && (
              <div className="text-xs text-gray-500">
                Requirements: {passwordStrength.errors.join(', ')}
              </div>
            )}
          </div>
        )}
        
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            icon={<Lock size={20} />}
            error={errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          size="lg"
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-600 font-medium">Or continue as</span>
          </div>
        </div>
        
        <div className="mt-5 space-y-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleGuestLogin}
            isLoading={isLoading}
          >
            <User size={20} className="mr-2" />
            Guest User
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrors({});
            setAuthError(null);
            setSuccessMessage(null);
          }}
          className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300"
        >
          Already have an account? Sign in
        </button>
      </div>
    </>
  );
  
  // Forgot password form
  const renderForgotPasswordForm = () => (
    <>
      <div className="flex items-center mb-6">
        <button
          onClick={() => {
            setMode('login');
            setErrors({});
            setAuthError(null);
            setSuccessMessage(null);
          }}
          className="text-gray-500 hover:text-gray-700 mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
      </div>
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-700">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Check your inbox (and spam folder) for the reset link.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          icon={<Mail size={20} />}
          error={errors.email}
        />
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          size="lg"
        >
          Send Reset Link
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrors({});
            setAuthError(null);
            setSuccessMessage(null);
          }}
          className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300"
        >
          Back to Sign In
        </button>
      </div>
    </>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm">
        {/* Show error messages */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{authError}</p>
          </div>
        )}
        
        {/* Show success messages */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}
        
        {renderForm()}
      </Card>
    </div>
  );
};