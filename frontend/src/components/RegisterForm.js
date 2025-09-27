import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Phone } from 'lucide-react';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: '',
    age_group: '',
    phone: '',
    parent_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    // Prepare data for API
    const userData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      role: formData.role,
      phone: formData.phone || null,
    };
    
    // Add age_group for students
    if (formData.role === 'student') {
      userData.age_group = formData.age_group;
      if (formData.parent_email) {
        userData.parent_email = formData.parent_email;
      }
    }
    
    const result = await register(userData);
    
    if (result.success) {
      setSuccess('Registration successful! Please log in with your credentials.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user makes selection
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900" data-testid="register-title">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join TecAI Kids platform today
          </p>
        </div>
        
        <Card data-testid="register-form">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Fill in your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" data-testid="register-error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert data-testid="register-success">
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}
              
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>I am a...</Label>
                <Select onValueChange={(value) => handleSelectChange('role', value)} data-testid="role-select">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="first_name"
                      name="first_name"
                      required
                      className="pl-10"
                      placeholder="First name"
                      value={formData.first_name}
                      onChange={handleChange}
                      data-testid="first-name-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="last_name"
                      name="last_name"
                      required
                      className="pl-10"
                      placeholder="Last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      data-testid="last-name-input"
                    />
                  </div>
                </div>
              </div>
              
              {/* Age Group for Students */}
              {formData.role === 'student' && (
                <div className="space-y-2">
                  <Label>Age Group</Label>
                  <Select onValueChange={(value) => handleSelectChange('age_group', value)} data-testid="age-group-select">
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-8">5-8 years (Early Elementary)</SelectItem>
                      <SelectItem value="9-12">9-12 years (Late Elementary)</SelectItem>
                      <SelectItem value="13-16">13-16 years (Middle/High School)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Parent Email for Students */}
              {formData.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="parent_email">Parent Email (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="parent_email"
                      name="parent_email"
                      type="email"
                      className="pl-10"
                      placeholder="Parent's email address"
                      value={formData.parent_email}
                      onChange={handleChange}
                      data-testid="parent-email-input"
                    />
                  </div>
                </div>
              )}
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    data-testid="email-input"
                  />
                </div>
              </div>
              
              {/* Phone (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="pl-10"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    data-testid="phone-input"
                  />
                </div>
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    data-testid="password-input"
                  />
                </div>
              </div>
              
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="pl-10"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    data-testid="confirm-password-input"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !formData.role}
                data-testid="register-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500" data-testid="login-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};