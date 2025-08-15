// Password Reset Component
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

interface PasswordResetProps {
  onBackToLogin: () => void;
  token: string;
  email: string;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ onBackToLogin, token, email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { resetPassword } = useAuth();
  
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
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = calculatePasswordStrength(formData.password);
      if (passwordValidation.score < 3) {
        newErrors.password = 'Password is too weak. ' + passwordValidation.errors.join(', ');
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
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
    
    try {
      await resetPassword(email, token, formData.password);
      setResetSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setAuthError(error.message || 'Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
  };
  
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
            <p className="text-gray-700 mb-8">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Button
              onClick={onBackToLogin}
              className="w-full"
              size="lg"
            >
              Back to Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm">
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{authError}</p>
          </div>
        )}
        
        <div className="flex items-center mb-6">
          <button
            onClick={onBackToLogin}
            className="text-gray-500 hover:text-gray-700 mr-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-gray-700">
            Enter your new password below. Make sure it's strong and secure.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            value={email}
            disabled
            icon={<Mail size={20} />}
          />
          
          <div className="relative">
            <Input
              label="New Password"
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
                <span className={`font-medium ${calculatePasswordStrength(formData.password).color.includes('red') ? 'text-red-500' : calculatePasswordStrength(formData.password).color.includes('orange') ? 'text-orange-500' : calculatePasswordStrength(formData.password).color.includes('yellow') ? 'text-yellow-500' : calculatePasswordStrength(formData.password).color.includes('blue') ? 'text-blue-500' : calculatePasswordStrength(formData.password).color.includes('green') ? 'text-green-500' : calculatePasswordStrength(formData.password).color.includes('emerald') ? 'text-emerald-500' : 'text-gray-500'}`}>
                  {calculatePasswordStrength(formData.password).label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${calculatePasswordStrength(formData.password).color}`}
                  style={{ width: `${(calculatePasswordStrength(formData.password).score / 5) * 100}%` }}
                ></div>
              </div>
              {calculatePasswordStrength(formData.password).errors && calculatePasswordStrength(formData.password).errors.length > 0 && (
                <div className="text-xs text-gray-500">
                  Requirements: {calculatePasswordStrength(formData.password).errors.join(', ')}
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
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};