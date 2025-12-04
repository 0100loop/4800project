import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); // prevent page reload
    setMsg("");
    setLoading(true);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setMsg(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Save token for authenticated requests
      localStorage.setItem("token", data.token);

      setMsg("✅ Logged in!");
      setLoading(false);

      // Example: redirect after login
      // window.location.href = "/dashboard";
    } catch (err) {
      setMsg("Network error, please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: "18px 0 28px" }}>
      <form
        className="card"
        style={{ display: "grid", gap: 12, maxWidth: 520 }}
        onSubmit={submit}
      >
        <h2>Login</h2>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {msg && <div style={{ color: "#9FE2F0" }}>{msg}</div>}
      </form>
    </div>
  );
}