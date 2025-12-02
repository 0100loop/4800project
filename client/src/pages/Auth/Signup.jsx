import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Check } from 'lucide-react';
import { apiFetch, setToken } from '../../lib/api';
import { Button } from '../../ui/button';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      // Create account
      await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: form,
      });

      // Log user in automatically
      const login = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { email: form.email, password: form.password },
      });

      setToken(login.token);
      nav('/');
    } catch (error) {
      console.error('Signup error:', error);
      setErr(
        error.message ||
          'Failed to create account. Please ensure the server is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0A2540] to-[#134E6F]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1592841897894-108b4aa4f076?q=80&w=2000')",
          }}
        />
        <div className="absolute inset-0 bg-[#0A2540]/80" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            {/* BRAND */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-white text-2xl font-bold">ParkIt</span>
            </div>

            {/* TEXT */}
            <h1 className="text-5xl font-bold mb-6">Join ParkIt today</h1>
            <p className="text-lg text-cyan-100 mb-12 max-w-md">
              Start renting your parking space or find convenient parking near
              your favorite events.
            </p>

            {/* FEATURES */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-[#06B6D4]" />
                <span className="text-lg">Earn extra income as a host</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-[#06B6D4]" />
                <span className="text-lg">Find parking near any venue</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-[#06B6D4]" />
                <span className="text-lg">Secure and trusted platform</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-cyan-100">
            Do not sell or share my personal info
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - SIGNUP CARD */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-2">
              Create your account
            </h2>
            <p className="text-gray-600 mb-8">
              Join ParkIt to find or host nearby parking
            </p>

            {err && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="text-gray-700 mb-2 block font-medium"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-[#06B6D4] text-[#0A2540]"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="text-gray-700 mb-2 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-[#06B6D4] text-[#0A2540]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className="text-gray-700 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange}
                    required
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-[#06B6D4] text-[#0A2540]"
                    placeholder="Create a password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* SIGN UP BUTTON */}
              <Button className="w-full bg-[#0A2540] hover:bg-[#134E6F] text-white py-3 text-base font-semibold">
                {loading ? 'Creating account...' : 'Create account'}
              </Button>

              {/* SEPARATOR */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* GOOGLE SIGN UP — FIXED + MATCHES LOGIN PAGE */}
              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    'http://localhost:5000/api/auth/google')
                }
                className="w-full flex items-center justify-center gap-3 
                           border border-gray-300 bg-white hover:bg-gray-50 
                           rounded-xl py-3 text-gray-700 font-medium"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  className="w-5 h-5"
                />
                <span>Google</span>
              </button>

              {/* LOGIN LINK */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#06B6D4] hover:underline font-medium"
                >
                  Log in
                </Link>
              </div>
            </form>

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
