import { useState } from 'react';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.js';
import { Separator } from './ui/separator.js';
import { ParkingCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from './thing/ImageWithFallback.js';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app would connect to backend
    if (email && password) {
      onLogin();
    }
  };

  const handleDemoLogin = () => {
    onLogin();
  };

  return (
    <div className="size-full flex flex-col lg:flex-row">
      {/* Left Side - Hero Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A2540] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1603380530253-c7e4694869f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwc3RhZGl1bSUyMGFlcmlhbHxlbnwxfHx8fDE3NjEwMjIwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Stadium parking aerial view"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#06B6D4] rounded-xl flex items-center justify-center">
              <ParkingCircle className="w-7 h-7" />
            </div>
            <h1 className="text-4xl">ParkIt</h1>
          </div>
          <h2 className="text-3xl mb-4">Find parking near any event</h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect with local residents renting out parking spots near stadiums, theaters, and venues.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#06B6D4] rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <p>Save money with competitive prices</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#06B6D4] rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <p>Skip the hassle of venue parking</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#06B6D4] rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <p>Enjoy perks like bathroom access & EV charging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-gray-50">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#06B6D4] rounded-xl flex items-center justify-center">
            <ParkingCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl text-[#0A2540]">ParkIt</h1>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl text-[#0A2540] mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isSignUp
                ? 'Join ParkIt to find parking or list your spot'
                : 'Sign in to continue to ParkIt'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border-gray-200"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 bg-gray-50 border-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 bg-gray-50 border-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-[#06B6D4] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90 text-white"
              >
                {isSignUp ? 'Sign up' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <Separator className="my-4" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                  Or continue with
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-200"
                  onClick={handleDemoLogin}
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

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-200 bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white"
                  onClick={handleDemoLogin}
                >
                  Continue as Demo User
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#06B6D4] hover:underline"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to ParkIt's{' '}
            <a href="#" className="text-[#06B6D4] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#06B6D4] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
