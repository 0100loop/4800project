import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";

export function MapView({ onNavigate, viewData }) {
  const event = viewData?.event || null;

  useEffect(() => {
    // CREATE MAP
    const map = L.map("eventMap").setView([34.0522, -118.2437], 11); // Default LA

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // 1️⃣ USER LOCATION
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;

        L.marker([userLat, userLon], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [35, 35],
          }),
        })
          .addTo(map)
          .bindPopup("<b>You Are Here</b>")
          .openPopup();
      },
      () => console.warn("User denied location access.")
    );

    // 2️⃣ STADIUM LIST (static for now, can later get from DB or SeatGeek)
    const stadiums = [
      { name: "Crypto.com Arena", lat: 34.043, lon: -118.267 },
      { name: "SoFi Stadium", lat: 33.9535, lon: -118.3387 },
      { name: "Dodger Stadium", lat: 34.0739, lon: -118.2400 },
      { name: "LA Coliseum", lat: 34.0141, lon: -118.2879 },
    ];

    // 3️⃣ HOST PARKING SPOTS (mock data)
    const parking = [
      { lat: 34.0425, lon: -118.265, price: 15, stadium: "Crypto.com Arena" },
      { lat: 33.952, lon: -118.341, price: 12, stadium: "SoFi Stadium" },
      { lat: 34.075, lon: -118.238, price: 10, stadium: "Dodger Stadium" },
      { lat: 34.013, lon: -118.288, price: 8, stadium: "LA Coliseum" },
    ];

    // 4️⃣ EVENT MODE — CENTER ON SELECTED EVENT
    if (event?.venue?.location?.lat && event?.venue?.location?.lon) {
      const evLat = event.venue.location.lat;
      const evLon = event.venue.location.lon;

      map.setView([evLat, evLon], 15);

      L.marker([evLat, evLon], {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
          iconSize: [36, 36],
        }),
      })
        .addTo(map)
        .bindPopup(`<b>${event.name}</b><br>${event.venue}`);
    }

    // 5️⃣ GLOBAL MODE — SHOW ALL STADIUMS IF NO EVENT IS SELECTED
    if (!event) {
      stadiums.forEach((s) => {
        L.marker([s.lat, s.lon], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [30, 30],
          }),
        })
          .addTo(map)
          .bindPopup(`<b>${s.name}</b><br>Stadium`);
      });
    }

    // 6️⃣ SHOW PARKING SPOTS
    parking.forEach((p) => {
      L.marker([p.lat, p.lon], {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
          iconSize: [32, 32],
        }),
      })
        .addTo(map)
        .bindPopup(
          `<b>${p.stadium}</b><br>Parking Price: $${p.price}<br><i>Host Spot</i>`
        );
    });

    return () => map.remove();
  }, [event]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      <Button
        onClick={() => onNavigate("home")}
        className="mb-4 flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" /> Back to Home
      </Button>

      <h2 className="text-3xl font-bold text-[#0A2540] mb-3">
        {event ? event.name : "All Stadiums & Parking"}
      </h2>

      <p className="text-gray-600 mb-6">
        {event ? event.venue : "Showing stadiums, user location, and parking availability"}
      </p>

      <div
        id="eventMap"
        style={{
          width: "100%",
          height: "550px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      ></div>
    </div>
  );
}


