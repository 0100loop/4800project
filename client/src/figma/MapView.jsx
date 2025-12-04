import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet.markercluster";
import "leaflet.markercluster.css";
import "leaflet.markercluster.default.css";

import { stadiums } from "../data/stadiums";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";

// Fix Leaflet icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

// ⭐ Custom Team Logo Marker
function logoMarker(url) {
  return L.icon({
    iconUrl: url,
    iconSize: [45, 45],
    popupAnchor: [0, -20],
  });
}

// ⭐ Haversine Distance Function
function getDistanceMiles(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function MapView({ onNavigate, viewData }) {
  const event = viewData?.event || null;
  const [filter, setFilter] = useState("ALL");
  const [parkingSpots, setParkingSpots] = useState([]);
  const [userCoords, setUserCoords] = useState(null);

  // ⭐ Extract event location
  function getEventCoords(e) {
    if (e?.venue?.lat && e?.venue?.lon) {
      return { lat: e.venue.lat, lon: e.venue.lon };
    }
    if (e?.performers?.[0]?.location?.lat && e?.performers?.[0]?.location?.lon) {
      return {
        lat: e.performers[0].location.lat,
        lon: e.performers[0].location.lon,
      };
    }
    return null;
  }

  // ⭐ Load host parking spots for the stadium
  async function loadNearbyParking(stadiumName) {
    try {
      const res = await fetch(
        `/api/spots/near?stadium=${encodeURIComponent(stadiumName)}`
      );
      const data = await res.json();
      setParkingSpots(data || []);
    } catch (err) {
      console.error("Parking load error:", err);
    }
  }

  useEffect(() => {
    const map = L.map("eventMap").setView([39.8283, -98.5795], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // ⭐ Automatic location popup
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ latitude, longitude });

        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("<b>You Are Here</b>")
          .openPopup();

        // map.setView([latitude, longitude], 12);  // Keep U.S. view first
      },
      () => console.warn("Location blocked.")
    );

    // ⭐ EVENT MODE
    const coords = getEventCoords(event);
    if (coords) {
      map.setView([coords.lat, coords.lon], 15);

      L.marker([coords.lat, coords.lon])
        .addTo(map)
        .bindPopup(`<b>${event.title}</b><br>${event.venue?.name}`);

      // Load parking near this stadium
      loadNearbyParking(event.venue?.name);
    }

    // ⭐ Cluster group for stadiums
    const cluster = L.markerClusterGroup();

    // ⭐ Stadium markers
    stadiums
      .filter((s) => filter === "ALL" || s.league === filter)
      .forEach((s) => {
        const marker = L.marker([s.lat, s.lon], {
          icon: logoMarker(s.logo),
        }).bindPopup(`
          <b>${s.name}</b><br>${s.team}<br>
          <a target="_blank" href="https://www.google.com/maps?q=${s.lat},${s.lon}">Open in Maps</a>
        `);

        cluster.addLayer(marker);
      });

    map.addLayer(cluster);

    return () => map.remove();
  }, [event, filter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* BACK BUTTON */}
      <Button
        onClick={() => onNavigate("home")}
        className="mb-4 flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" /> Back to Home
      </Button>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["ALL", "NFL", "NBA", "MLB", "NHL"].map((l) => (
          <Button
            key={l}
            onClick={() => setFilter(l)}
            className={
              filter === l
                ? "bg-[#06B6D4] text-white"
                : "bg-gray-300 text-black"
            }
          >
            {l}
          </Button>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-[#0A2540] mb-3">
        {event ? event.title : "All Major U.S. Stadiums"}
      </h2>

      <p className="text-gray-600 mb-6">
        {event
          ? event.venue?.name
          : "Showing stadiums • host parking • live location"}
      </p>

      {/* MAP */}
      <div
        id="eventMap"
        style={{
          width: "100%",
          height: "550px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      ></div>

      {/* HOST PARKING LIST */}
      {event && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Nearby Parking Spots</h3>

          {parkingSpots.length === 0 && (
            <p className="text-gray-500">No hosts listed near this stadium yet.</p>
          )}

          <div className="grid gap-4">
            {parkingSpots.map((spot) => {
              const miles = userCoords
                ? getDistanceMiles(
                    userCoords.latitude,
                    userCoords.longitude,
                    spot.latitude,
                    spot.longitude
                  )
                : null;

              return (
                <div
                  key={spot._id}
                  className="border p-4 rounded-xl shadow-sm bg-white"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{spot.owner?.name}</h4>
                      <p className="text-gray-600">{spot.address}</p>
                      {miles && (
                        <p className="text-gray-500">{miles} miles away</p>
                      )}
                      <p className="text-[#06B6D4] font-semibold text-lg">
                        ${spot.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        Spaces Available: {spot.spacesAvailable}
                      </p>
                    </div>

                    <Button
                      className="bg-[#06B6D4] hover:bg-[#0891B2] text-white h-fit"
                      onClick={() =>
                        onNavigate("booking", {
                          spot,
                        })
                      }
                    >
                      Book Parking
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
