import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submitReset = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      setMessage(data.message || data.error);
    } catch (err) {
      console.error(err);
      setMessage("Error resetting password.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br/><br/>

      <button onClick={submitReset}>Reset Password</button>

      {message && <p>{message}</p>}
    </div>
  );
}
