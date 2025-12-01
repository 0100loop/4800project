import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { MapPin, Navigation, Clock, Filter, ChevronLeft, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import "leaflet/dist/leaflet.css";
import { apiFetch } from "../lib/api";

// Fix for default leaflet marker
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const venueCoordinates = {
  "Crypto.com Arena": [34.043, -118.2673],
  "SoFi Stadium": [33.9533, -118.339],
  "Dodger Stadium": [34.0739, -118.24],
  "Rose Bowl Stadium": [34.1613, -118.1676],
  "Hollywood Bowl": [34.1122, -118.3396],
};

export function MapView({ onNavigate, viewData }) {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVenueSearch, setShowVenueSearch] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentVenue = viewData?.venue?.name || viewData?.venue || "Crypto.com Arena";
  const eventName = viewData?.event?.name || "Find Parking";
  const eventDate = viewData?.event?.date || null;

  const [mapCenter, setMapCenter] = useState(venueCoordinates[currentVenue]);

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

  /* ========================================================
      LOAD LISTINGS BY RADIUS + EVENT DATE
  ======================================================== */
  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);

        const [lat, lng] = venueCoordinates[currentVenue];
        const radius = 2500; // meters = ~1.2 miles

        const dateQuery = eventDate ? `&date=${eventDate}` : "";

        console.log('Fetching listings with:', { lat, lng, radius, dateQuery });
        const data = await apiFetch(
          `/api/listings?lat=${lat}&lng=${lng}&radius=${radius}${dateQuery}`
        );

        setListings(data);
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [currentVenue, eventDate]);

  /* ========================================================
      UPDATE MAP CENTER WHEN VENUE CHANGES
  ======================================================== */
  useEffect(() => {
    const coords = venueCoordinates[currentVenue];
    if (coords) setMapCenter(coords);
  }, [currentVenue]);

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
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Venue Marker */}
          <Marker position={mapCenter}>
            <Popup>
              <strong>{currentVenue}</strong>
              <br />
              {eventName}
            </Popup>
          </Marker>

          {/* Listing Markers */}
          {listings.map((l) => (
            <Marker
              key={l._id}
              position={[
                l.location.coordinates[1], // lat
                l.location.coordinates[0], // lng
              ]}
              eventHandlers={{
                click: () => setSelected(l._id),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>${l.price}</strong>
                  <br />
                  {l.eventName}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* My Location Button */}
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

      {/* LISTING CARDS */}
      <div className="bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 border-b border-gray-100">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <h3 className="text-[#0A2540]">{listings.length} Listings Available</h3>
          <p className="text-gray-600 text-sm mt-1">Sorted by distance</p>
        </div>

        <div className="p-4 space-y-3">
          {listings.map((l) => (
            <Card
              key={l._id}
              className={`cursor-pointer transition-all ${
                selected === l._id
                  ? "border-[#06B6D4] border-2 shadow-md"
                  : "border-gray-200 hover:shadow-md"
              }`}
              onClick={() => {
                setSelected(l._id);
                setMapCenter([
                  l.location.coordinates[1],
                  l.location.coordinates[0],
                ]);
                onNavigate("spot", { listing: l });
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0A2540] to-[#134E6F] rounded-lg flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-[#06B6D4]" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-[#0A2540] text-lg font-semibold">
                      ${l.price}
                    </h4>

                    <p className="text-sm text-gray-600">
                      Spaces: {l.spacesAvailable - l.bookedSpaces} left
                    </p>

                    {l.distance && (
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {l.distance.toFixed(2)} km •{" "}
                        <Clock className="inline w-3 h-3" /> {Math.round(
                          (l.distance / 0.08) // ~80m/min walking
                        )}{" "}
                        min walk
                      </p>
                    )}
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
