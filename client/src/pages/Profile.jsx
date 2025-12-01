import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  const updateProfile = () => {
    fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile),
    })
      .then((r) => r.json())
      .then((data) => alert("Profile updated!"));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <label className="block">Name:</label>
      <input
        className="border p-2 w-full"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />

      <label className="block mt-4">Email:</label>
      <input
        className="border p-2 w-full"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />

      <button
        onClick={updateProfile}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
}

