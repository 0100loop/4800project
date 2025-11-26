import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../lib/api";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");

    // Save auth token
    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
    }

    // Save profile info from Google (if provided by backend)
    if (name) localStorage.setItem("name", name);
    if (email) localStorage.setItem("email", email);
    if (picture) localStorage.setItem("avatar", picture);

    // Go to home
    navigate("/");
  }, [navigate]);

  return (
    <div style={{ padding: "40px", fontSize: "20px", color: "#333" }}>
      Signing you in...
    </div>
  );
}

