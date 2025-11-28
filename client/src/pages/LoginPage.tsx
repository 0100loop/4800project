import { useState } from "react";
import { Car, MapPin, Eye, EyeOff, Search, Home } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { loginUser, signupUser } from "../lib/api";

const GOOGLE_AUTH_URL = "http://localhost:5000/api/auth/google";

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"guest" | "host">("guest");
  const [loading, setLoading] = useState(false);

  const redirectBasedOnRole = () => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (savedUser.role === "host") {
      window.location.href = "/host";
    } else {
      window.location.href = "/";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const displayName = name || email.split("@")[0];
        await signupUser(displayName, email, password, userType);
      } else {
        await loginUser(email, password);
      }

      redirectBasedOnRole();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT HERO */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0A2540] to-[#1e3a5f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=60"
            alt="Parking lot"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-16 text-white gap-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#06B6D4] rounded-xl flex items-center justify-center shadow-lg">
              <Car className="w-8 h-8" />
            </div>
            <span className="text-4xl font-semibold">ParkIt</span>
          </div>

          <h1 className="text-5xl font-semibold leading-tight">
            Find Perfect Parking
            <br />
            Near Any Venue
          </h1>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#06B6D4] rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl text-[#0A2540] font-semibold">ParkIt</span>
          </div>

          <Card className="p-8 shadow-xl border border-gray-200 bg-white">
            <h2 className="text-3xl text-[#0A2540] font-semibold mb-2">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h2>

            <p className="text-gray-600 mb-6">
              {isSignUp
                ? "Choose how you want to use ParkIt."
                : "Sign in to your account."}
            </p>

            {/* USER TYPE SELECTOR ALWAYS SHOWN */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              {/* Event Goer */}
              <Card
                className={`p-4 cursor-pointer transition-all border-2 ${
                  userType === "guest"
                    ? "border-[#06B6D4] bg-[#06B6D4]/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setUserType("guest")}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-[#06B6D4]/20 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-[#06B6D4]" />
                  </div>
                  <div className="text-[#0A2540] font-medium">Event Goer</div>
                  <div className="text-xs text-gray-600">Find Parking</div>
                </div>
              </Card>

              {/* Host */}
              <Card
                className={`p-4 cursor-pointer transition-all border-2 ${
                  userType === "host"
                    ? "border-[#06B6D4] bg-[#06B6D4]/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setUserType("host")}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-[#06B6D4]/20 rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-[#06B6D4]" />
                  </div>
                  <div className="text-[#0A2540] font-medium">Host</div>
                  <div className="text-xs text-gray-600">List My Spot</div>
                </div>
              </Card>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 mt-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#06B6D4] hover:bg-[#0891b2] text-white"
              >
                {loading
                  ? "Please wait..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            {/* OR */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* GOOGLE BUTTON */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <span className="text-sm">Continue with Google</span>
            </Button>

            {/* SIGN IN / SIGN UP TOGGLE */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-600"
              >
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <span className="text-[#06B6D4] font-medium">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </span>
              </button>
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}
