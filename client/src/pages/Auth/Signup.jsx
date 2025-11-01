import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Check } from 'lucide-react';
import { apiFetch, setToken } from '../../lib/api';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      // Create account
      await apiFetch('/api/auth/signup', { method: 'POST', body: form });
      // Then log in to get token
      const login = await apiFetch('/api/auth/login', { 
        method: 'POST', 
        body: { email: form.email, password: form.password } 
      });
      setToken(login.token);
      nav('/');
    } catch (error) {
      console.error('Signup error:', error);
      setErr(error.message || 'Failed to create account. Please check that the server is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0A2540] to-[#134E6F]">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1592841897894-108b4aa4f076?q=80&w=2000')"
          }}
        />
        <div className="absolute inset-0 bg-[#0A2540]/80" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            {/* Branding */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-white text-2xl font-bold">ParkIt</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold mb-6">Join ParkIt today</h1>
            <p className="text-lg text-cyan-100 mb-12 max-w-md">
              Start renting your parking space or find convenient parking near your favorite events.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-[#06B6D4] flex-shrink-0" />
                <span className="text-lg">Earn extra income as a host</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-[#06B6D4] flex-shrink-0" />
                <span className="text-lg">Find parking near any venue</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-[#06B6D4] flex-shrink-0" />
                <span className="text-lg">Secure and trusted platform</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="text-sm text-cyan-100">Do not sell or share my personal info</p>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Welcome Message */}
            <h2 className="text-3xl font-bold text-[#0A2540] mb-2">Create your account</h2>
            <p className="text-gray-600 mb-8">Join ParkIt to find or host nearby parking</p>

            {/* Error Message */}
            {err && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="text-gray-700 mb-2 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent outline-none transition-all text-[#0A2540] bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent outline-none transition-all text-[#0A2540] bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="text-gray-700 mb-2 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange}
                    required
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent outline-none transition-all text-[#0A2540] bg-white"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Account Type Field */}
              <div>
                <Label htmlFor="role" className="text-gray-700 mb-2 block">Account Type</Label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent outline-none transition-all text-[#0A2540] bg-white"
                >
                  <option value="user">Event-goer (find parking)</option>
                  <option value="lister">Host (list your driveway)</option>
                </select>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A2540] hover:bg-[#134E6F] text-white py-3 text-base font-semibold"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                className="w-full border border-gray-300 bg-white text-[#0A2540] hover:bg-gray-50 py-3 font-medium"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#06B6D4] hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </form>

            {/* Terms and Privacy */}
            <p className="mt-6 text-xs text-center text-gray-500">
              By continuing, you agree to ParkIt's{' '}
              <Link to="/terms" className="text-[#06B6D4] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#06B6D4] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}