import { useEffect } from "react";

export default function AuthSuccess({ onLogin }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");
    const role = params.get("role");
    const redirectTo = params.get("redirect");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name, email, picture, role })
      );

      // Final redirect based on role
      if (redirectTo === "host") {
        window.location.href = "/host";
      } else {
        window.location.href = "/";
      }
    } else {
      alert("Google login failed");
    }
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center text-gray-700">
      Authenticating with Google…
    </div>
  );
}

