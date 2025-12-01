import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../lib/api";

export default function AuthSuccess() {
  const nav = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      setToken(token);

      // Store the name in localStorage
      if (name) localStorage.setItem("name", name);

      nav("/"); // redirect to home
    }
  }, [nav]);

  return <div>Signing you in...</div>;
}
