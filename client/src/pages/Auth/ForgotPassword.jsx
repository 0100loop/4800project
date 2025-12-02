import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { Button } from "../../ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });

      setSent(true);
    } catch (error) {
      setErr(error.message || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-[#0A2540] mb-2">
          Forgot password?
        </h2>
        <p className="text-gray-600 mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {err && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {err}
          </div>
        )}

        {sent ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            If an account exists with <b>{email}</b>, a password reset link was sent.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            {/* EMAIL INPUT */}
            <div>
              <label className="text-gray-700 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-[#06B6D4] text-gray-900"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-3">
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}

        {/* BACK TO LOGIN */}
        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/login" className="text-[#06B6D4] hover:underline font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
