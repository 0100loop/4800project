import { useEffect } from "react";
import { setToken } from "../../lib/api";

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const avatar = params.get("avatar");

    if (token) setToken(token);
    if (name) localStorage.setItem("name", name);
    if (email) localStorage.setItem("email", email);
    if (avatar) localStorage.setItem("avatar", avatar);

    window.location.href = "/";
  }, []);

  return <p>Signing you in...</p>;
}

