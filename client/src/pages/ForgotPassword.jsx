import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      setSent(true);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-1">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-[#06B6D4] text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600 font-medium">
            Reset link sent! Check your email.
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/login" className="text-[#06B6D4] hover:underline font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
