import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import {
  MapPin,
  Navigation,
  Clock,
  Filter,
  ChevronLeft,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import "leaflet/dist/leaflet.css";
import { apiFetch } from "../lib/api";

/* ============================================================
    GEOCODING — fetch coordinates for ANY venue name
============================================================ */
async function geocodeVenue(name) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      name
    )}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "parking-app" },
    });

    const data = await res.json();
    if (!data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

/* ============================================================
    LEAFLET MARKERS
============================================================ */

// Fix default Leaflet marker icons
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Red marker = venue
export const redMarker = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Blue marker = parking spots
export const blueMarker = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function MapView({ onNavigate, viewData }) {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVenueSearch, setShowVenueSearch] = useState(false);

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([34.05, -118.25]); // fallback LA

  const currentVenue =
    viewData?.venue?.name || viewData?.venue || "Crypto.com Arena";

  const eventName = viewData?.event?.name || "Find Parking";
  const eventDate = viewData?.event?.date || null;

  const availableVenues = [
    { id: 1, name: "Crypto.com Arena", city: "Los Angeles, CA" },
    { id: 2, name: "SoFi Stadium", city: "Inglewood, CA" },
    { id: 3, name: "Dodger Stadium", city: "Los Angeles, CA" },
  ];

  const filteredVenues = searchQuery.trim()
    ? availableVenues.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableVenues;

  /* ============================================================
      UPDATE MAP CENTER WHEN VENUE CHANGES
  ============================================================ */
  useEffect(() => {
    async function updateCenter() {
      const coords = await geocodeVenue(currentVenue);
      if (coords) {
        setMapCenter([coords.lat, coords.lng]);
      }
    }
    updateCenter();
  }, [currentVenue]);

  /* ============================================================
      LOAD SPOTS BASED ON THE NEW MAP CENTER
  ============================================================ */
  useEffect(() => {
    async function loadSpots() {
      try {
        setLoading(true);

        const [lat, lng] = mapCenter;
        const radius = 3000;

        const data = await apiFetch(
          `/api/spots?lat=${lat}&lng=${lng}&radius=${radius}`
        );

        setSpots(data);
      } catch (err) {
        console.error("Failed to load spots", err);
      } finally {
        setLoading(false);
      }
    }

    loadSpots();
  }, [mapCenter]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="rounded-full text-[#0A2540]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h3 className="text-[#0A2540]">{currentVenue}</h3>
            {eventDate && (
              <p className="text-sm text-gray-600">
                {eventName} – {eventDate}
              </p>
            )}
          </div>

          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* SEARCH VENUE */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Input
            placeholder="Search different venue..."
            className="pl-10 pr-4 py-2 rounded-lg border-gray-200 text-sm text-[#0A2540]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowVenueSearch(true);
            }}
            onFocus={() => setShowVenueSearch(true)}
          />

          {showVenueSearch && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowVenueSearch(false)}
              />
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl z-30 max-h-64 overflow-y-auto border border-gray-200">
                {filteredVenues.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSearchQuery("");
                      setShowVenueSearch(false);
                      onNavigate("map", { venue: v });
                    }}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-start gap-2 text-left border-b border-gray-100 last:border-b-0"
                  >
                    <MapPin className="w-4 h-4 text-[#06B6D4]" />
                    <div>
                      <p className="text-sm text-[#0A2540]">{v.name}</p>
                      <p className="text-xs text-gray-500">{v.city}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Venue marker */}
          <Marker position={mapCenter} icon={redMarker}>
            <Popup>
              <strong>{currentVenue}</strong>
              <br />
              {eventName}
            </Popup>
          </Marker>

          {/* Parking spots */}
          {spots.map((s) => (
            <Marker
              icon={blueMarker}
              key={s._id}
              position={[
                s.location.coordinates[1],
                s.location.coordinates[0],
              ]}
              eventHandlers={{
                click: () => setSelected(s._id),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>${s.pricePerEvent}</strong>
                  <br />
                  {s.address}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* MY LOCATION BUTTON */}
        <Button
          className="absolute top-4 right-4 bg-white text-[#0A2540] hover:bg-gray-50 shadow-lg rounded-full z-30"
          size="icon"
          onClick={() => {
            navigator.geolocation &&
              navigator.geolocation.getCurrentPosition((pos) => {
                setMapCenter([pos.coords.latitude, pos.coords.longitude]);
              });
          }}
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* SPOT CARDS */}
      <div className="bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 border-b border-gray-100">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <h3 className="text-[#0A2540]">{spots.length} Spots Available</h3>
          <p className="text-gray-600 text-sm mt-1">Sorted by distance</p>
        </div>

        <div className="p-4 space-y-3">
          {spots.map((s) => (
            <Card
              key={s._id}
              className={`cursor-pointer transition-all ${
                selected === s._id
                  ? "border-[#06B6D4] border-2 shadow-md"
                  : "border-gray-200 hover:shadow-md"
              }`}
              onClick={() => {
                setSelected(s._id);
                setMapCenter([
                  s.location.coordinates[1],
                  s.location.coordinates[0],
                ]);
                onNavigate("spot", { spot: s });
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0A2540] to-[#134E6F] rounded-lg flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-[#06B6D4]" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-[#0A2540] text-lg font-semibold">
                      ${s.pricePerEvent}
                    </h4>

                    <p className="text-sm text-gray-600 mt-1">
                      {s.address}
                    </p>

                    {s.distance !== undefined && (() => {
                      const km = s.distance / 1000;
                      const meters = s.distance;

                      return (
                        <p className="text-sm text-gray-600 mt-1">
                          📍{" "}
                          {km < 1
                            ? `${Math.round(meters)} m`
                            : `${km.toFixed(2)} km`}{" "}
                          • <Clock className="inline w-3 h-3" />{" "}
                          {Math.max(1, Math.round(meters / 80))} min walk
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
