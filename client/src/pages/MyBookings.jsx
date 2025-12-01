import React, { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings/me", { credentials: "include" })
      .then((res) => res.json())
      .then(setBookings)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="border rounded p-4 mb-4">
            <h3 className="font-bold text-lg">{b.Spot?.title || "Spot"}</h3>
            <p>{b.Spot?.address}</p>
            <p><strong>Start:</strong> {new Date(b.startDate).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(b.endDate).toLocaleString()}</p>
            <p><strong>Price:</strong> ${b.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
