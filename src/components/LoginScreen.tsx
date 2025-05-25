
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface LoginScreenProps {
  onLogin: (user: { email: string; name: string }) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Default test credentials
  const defaultCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showForgotPassword) {
      // Simulate forgot password
      alert(`Password reset link sent to ${formData.email}`);
      setShowForgotPassword(false);
      return;
    }

    if (isLogin) {
      // Check credentials (prototype logic)
      if (formData.email === defaultCredentials.email && formData.password === defaultCredentials.password) {
        onLogin({ email: formData.email, name: 'Test User' });
      } else {
        alert('Invalid credentials. Use test@example.com / password123');
      }
    } else {
      // Registration logic (prototype)
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      onLogin({ email: formData.email, name: formData.name });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fillDefaultCredentials = () => {
    setFormData(prev => ({
      ...prev,
      email: defaultCredentials.email,
      password: defaultCredentials.password
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {showForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {showForgotPassword 
              ? 'Enter your email to receive a reset link'
              : isLogin 
                ? 'Sign in to access your AI assistant' 
                : 'Join us to start chatting with AI'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !showForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {!showForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && !showForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {isLogin && !showForgotPassword && (
              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fillDefaultCredentials}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                >
                  Use test credentials
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full">
              {showForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {!showForgotPassword && (
            <>
              <Separator />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
                  }}
                  className="text-blue-600 hover:text-blue-800 mt-1"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </Button>
              </div>
            </>
          )}

          {showForgotPassword && (
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForgotPassword(false);
                  setFormData(prev => ({ ...prev, email: '' }));
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to sign in
              </Button>
            </div>
          )}

          {isLogin && (
            <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
              <p className="font-medium mb-1">Test Credentials:</p>
              <p>Email: test@example.com</p>
              <p>Password: password123</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
