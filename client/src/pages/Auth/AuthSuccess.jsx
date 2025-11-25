import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../lib/api";

export default function AuthSuccess() {
  const nav = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      nav("/");
    }
  }, [nav]);

  return <div>Signing you in...</div>;
}
