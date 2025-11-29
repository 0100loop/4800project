import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { apiFetch, setToken } from "../../lib/api";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Handle input changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Email/password login
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: form,
      });

      // Store token
      setToken(data.token);

      // Store user info for Navbar / profile
      if (data.user) {
        localStorage.setItem("name", data.user.name || "");
        localStorage.setItem("avatar", data.user.avatar || "");
      }

      nav("/"); // redirect home
    } catch (error: any) {
      setErr(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE HERO */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0A2540] to-[#134E6F]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1592841897894-108b4aa4f076?q=80&w=2000')",
          }}
        />
        <div className="absolute inset-0 bg-[#0A2540]/75" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <h1 className="text-5xl font-bold mb-6">Find parking near any event</h1>
            <p className="text-lg text-cyan-100 mb-12 max-w-md">
              Connect with local residents renting out parking spots near stadiums, theaters,
              and venues.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-2">Welcome back</h2>
            <p className="text-gray-600 mb-6">Sign in to continue to ParkIt</p>

            {err && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* EMAIL */}
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2 block">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4] bg-white"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#06B6D4] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06B6D4]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A2540] hover:bg-[#134E6F] text-white py-3 text-base font-semibold"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* OR LINE */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* GOOGLE LOGIN BUTTON (will work after /auth-success page) */}
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "http://localhost:5000/api/auth/google")}
              className="w-full border border-gray-300 bg-white text-[#0A2540] hover:bg-gray-50 py-3 font-medium mb-4"
            >
              Continue with Google
            </Button>

            {/* SIGNUP LINK */}
            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#06B6D4] hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
