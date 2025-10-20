import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Loading...");

  // Use env var so prod hits Nginx proxy (/api) and dev can override if needed
  const API = import.meta.env.VITE_API_URL || "/api";

  useEffect(() => {
    fetch(`${API}/health`)
      .then((res) => res.json())
      .then((data) =>
        setBackendStatus(`${data.message} | MongoDB: ${data.mongoDB}`)
      )
      .catch((err) => setBackendStatus(`Error: ${err.message}`));
  }, []);

  return (
    <div className="bg-darkblue text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-teal mb-4">Welcome to ParkIt</h1>
      <p className="text-gray-300 mb-6">
        Find and reserve nearby parking for your next event.
      </p>

      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Search for a venue or event..."
          className="p-3 rounded-md text-black w-80"
        />
        <Link
          to="/map"
          className="bg-teal hover:bg-cyan-500 text-darkblue font-semibold py-2 px-4 rounded-md"
        >
          Find Parking
        </Link>
      </div>

      <div className="mt-8 text-gray-400">
        <p>Backend health: {backendStatus}</p>
      </div>
    </div>
  );
}
