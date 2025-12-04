import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster.css";
import "leaflet.markercluster.default.css";

import { stadiums } from "../data/stadiums";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";

// Fix icons in Vite
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

// ⭐ SAMPLE SPOTS (because no hosts have posted yet)
const SAMPLE_SPOTS = [
  {
    id: "1",
    host: "Sarah Johnson",
    address: "1234 Maple Street",
    lat: 34.043,
    lng: -118.267,
    price: 15,
    distance: "0.3mi",
    walk: "5 min walk",
    spotsLeft: 2,
    features: ["EV Charging", "Covered", "Security"],
    closestStadium: "Crypto.com Arena",
  },
  {
    id: "2",
    host: "Mike Chen",
    address: "456 Oak Avenue",
    lat: 34.045,
    lng: -118.265,
    price: 12,
    distance: "0.5mi",
    walk: "8 min walk",
    spotsLeft: 1,
    features: ["Bathroom Access", "Tailgate OK"],
    closestStadium: "Crypto.com Arena",
  },
  {
    id: "3",
    host: "Emma Davis",
    address: "789 Pine Street",
    lat: 34.046,
    lng: -118.263,
    price: 20,
    distance: "0.4mi",
    walk: "6 min walk",
    spotsLeft: 1,
    features: ["EV Charging", "Shuttle"],
    closestStadium: "Crypto.com Arena",
  },
];

export function MapView({ onNavigate, viewData }) {
  const event = viewData?.event || null;

  const mapRef = useRef(null);
  const listingLayerRef = useRef(null);
  const [listings, setListings] = useState([]);

  // ⭐ Extract event coordinates
  function getEventCoords(e) {
    if (e?.venue?.lat && e?.venue?.lon) {
      return { lat: e.venue.lat, lon: e.venue.lon };
    }
    return null;
  }

  // ⭐ Add markers to map
  function addListingMarkers(map, spots, originCoords) {
    listingLayerRef.current.clearLayers();

    spots.forEach((spot) => {
      if (!spot.lat || !spot.lng) return;

      const marker = L.marker([spot.lat, spot.lng]).addTo(
        listingLayerRef.current
      );

      marker
        .bindPopup(`<b>${spot.host}</b><br/>$${spot.price}`)
        .on("click", () => onNavigate("spotDetails", { spot }));
    });
  }

  // ⭐ Initialize map and load spots
  useEffect(() => {
    const map = L.map("eventMap").setView([39.8283, -98.5795], 4);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    listingLayerRef.current = L.layerGroup().addTo(map);

    const coords = getEventCoords(event);
    let spotData = SAMPLE_SPOTS;

    if (coords) {
      map.setView([coords.lat, coords.lon], 15);

      // Event marker
      L.marker([coords.lat, coords.lon])
        .addTo(map)
        .bindPopup(`<b>${event.title}</b><br>${event.venue?.name}`);

      // Load sample spots around event
      addListingMarkers(map, spotData, coords);
      setListings(spotData);
    }

    // Stadium markers (unchanged)
    const cluster = L.markerClusterGroup();
    stadiums.forEach((s) => {
      const icon = L.icon({
        iconUrl: s.logo,
        iconSize: [45, 45],
      });

      const marker = L.marker([s.lat, s.lon], { icon }).bindPopup(`
        <b>${s.name}</b><br>${s.team}<br>
        <a target="_blank" href="https://www.google.com/maps?q=${s.lat},${s.lon}">Open in Maps</a>
      `);

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);

    return () => map.remove();
  }, [event]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* BACK BUTTON */}
      <Button
        onClick={() => onNavigate("home")}
        className="mb-4 flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" /> Back to Home
      </Button>

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-[#0A2540] mb-3">
        {event ? event.title : "Stadium Map"}
      </h2>

      <p className="text-gray-600 mb-6">
        {event?.venue?.name || "Select a stadium to explore nearby parking"}
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

      {/* LISTINGS */}
      <h3 className="text-2xl font-semibold mt-10 mb-4">Available Spots</h3>

      <div className="grid gap-4">
        {listings.map((spot) => (
          <div
            key={spot.id}
            className="border p-4 rounded-xl shadow-sm bg-white cursor-pointer"
            onClick={() => onNavigate("spotDetails", { spot })}
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-lg">{spot.host}</h4>
                <p className="text-gray-600">
                  {spot.distance} • {spot.walk}
                </p>

                <div className="flex gap-2 flex-wrap mt-2">
                  {spot.features.map((f, idx) => (
                    <span
                      key={idx}
                      className="bg-cyan-100 text-cyan-700 px-2 py-1 text-xs rounded-lg"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <p className="text-orange-600 mt-2 text-sm">
                  Only {spot.spotsLeft} spot left!
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold text-[#06B6D4]">
                  ${spot.price}
                </p>
                <Button className="mt-2 bg-[#06B6D4] hover:bg-[#0891B2] text-white">
                  View Spot
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
