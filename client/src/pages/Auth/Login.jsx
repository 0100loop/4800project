import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { apiFetch, setToken } from '../../lib/api';
import { Button } from '../../ui/button';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: form,
      });

      setToken(data.token);

      // store user info
      if (data.user) {
        localStorage.setItem("name", data.user.name || "");
        localStorage.setItem("email", data.user.email || "");
        localStorage.setItem("avatar", data.user.avatar || "");
      }

      nav("/");
    } catch (error) {
      setErr(error.message || "Invalid login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1592841897894-108b4aa4f076?q=80&w=2000"
          alt="stadium"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0A2540]/65" />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold mb-6">Find parking near any event</h1>
          <p className="text-lg text-gray-200 mb-8 max-w-md">
            Connect with local residents renting out parking spots near stadiums, theaters, and venues.
          </p>

          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-3">
              <span className="text-[#06B6D4] text-2xl">✓</span>
              Save money with competitive prices
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#06B6D4] text-2xl">✓</span>
              Skip the hassle of venue parking
            </div>
          </div>

          <p className="mt-12 text-sm text-gray-300">
            Do not sell or share my personal info
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — Login Card */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">

          <h2 className="text-3xl font-bold text-[#0A2540] mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-8">Sign in to continue to ParkIt</p>

          {err && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg 
                            focus:ring-2 focus:ring-[#06B6D4] text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg 
                            focus:ring-2 focus:ring-[#06B6D4] text-gray-900 placeholder-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <Button className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-3">
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {/* GOOGLE LOGIN — EXACT MATCH */}
            <button
              type="button"
              onClick={() => (window.location.href = "http://localhost:5000/api/auth/google")}
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

            {/* SIGNUP LINK */}
            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#06B6D4] hover:underline">
                Sign up
              </Link>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
