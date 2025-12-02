// src/pages/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../lib/api";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const avatar = params.get("avatar");

    if (token) {
      // store JWT
      setToken(token);

      // store user info for navbar / profile
      if (name) localStorage.setItem("userName", name);
      if (email) localStorage.setItem("userEmail", email);
      if (avatar) localStorage.setItem("userAvatar", avatar);
    }

    // send user to home
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700">Signing you in with Google…</p>
    </div>
  );
}

