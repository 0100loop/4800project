import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function HostManageSpot() {
  const { spotId } = useParams();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`/api/spots/${spotId}/bookings`, { credentials: "include" })
      .then((res) => res.json())
      .then(setBookings)
      .catch((err) => console.error(err));
  }, [spotId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Spot #{spotId}</h1>

      <h2 className="text-xl font-semibold mt-6">Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="border p-4 rounded-lg">
              <p><strong>User:</strong> {b.User?.name}</p>
              <p><strong>Email:</strong> {b.User?.email}</p>
              <p><strong>Start:</strong> {new Date(b.startDate).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(b.endDate).toLocaleString()}</p>
              <p><strong>Status:</strong> {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
