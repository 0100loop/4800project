

import { useEffect, useState } from "react";

export default function HomePage() {
  // Ticketmaster events
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        console.log("Events loaded:", data);
        setEvents(data || []);
      })
      .catch((err) => console.error("Events fetch error:", err));
  }, []);

  // Backend health check
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <section style={styles.wrap}>
      <h1>Welcome to ParkIt</h1>
      <p>Backend Health:</p>

      <pre style={styles.code}>
        {error
          ? `Error: ${error}`
          : JSON.stringify(health, null, 2) || "Loading..."}
      </pre>

      {/* Featured Events Section */}
      <h2 style={styles.sectionTitle}>Featured Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
            <div key={event.id} style={styles.card}>
              {/* Event Image */}
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  style={styles.image}
                />
              )}

              <h3 style={styles.eventTitle}>{event.name}</h3>

              <p style={styles.eventInfo}>
                📅 {event.date || "TBA"}
              </p>
              <p style={styles.eventInfo}>
                📍 {event.venue || "Unknown Venue"}
              </p>
              <p style={styles.eventCity}>{event.city}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  wrap: {
    maxWidth: 960,
    margin: "16px auto",
    padding: "0 16px",
  },
  code: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    padding: "12px",
    borderRadius: 8,
    overflow: "auto",
    marginBottom: 32,
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 16,
    fontSize: "24px",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 16,
    background: "#fff",
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventInfo: {
    margin: 0,
    marginBottom: 4,
  },
  eventCity: {
    color: "#6b7280",
    fontSize: "14px",
  },
};
