
import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function HomeScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);

  /* ===============================
       LOAD TICKETMASTER EVENTS
  =============================== */
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((events) => {
        console.log("Loaded Ticketmaster Events:", events);

        const updated = events.map((e) => ({
          id: e.id,
          name: e.name,
          venue: e.venue || "Unknown Venue",
          date: e.date || "TBA",
          image: e.image || "https://via.placeholder.com/300x200?text=No+Image",

          // Fake parking values (Ticketmaster does NOT provide this)
          spotsAvailable: Math.floor(Math.random() * 50) + 10,
          priceFrom: Math.floor(Math.random() * 20) + 10,
        }));

        setFeaturedEvents(updated);
      })
      .catch((err) => console.error("Event loading error:", err));
  }, []);

  /* ===============================
        VENUE MASTER LIST
  =============================== */
  const allVenues = [
    { name: "SoFi Stadium", city: "Inglewood, CA", type: "NFL Stadium" },
    { name: "Intuit Dome", city: "Inglewood, CA", type: "NBA Arena" },
    { name: "Crypto.com Arena", city: "Los Angeles, CA", type: "NBA Arena" },
    { name: "Dodger Stadium", city: "Los Angeles, CA", type: "MLB Stadium" },
    { name: "Rose Bowl Stadium", city: "Pasadena, CA", type: "Football Stadium" },
    { name: "Honda Center", city: "Anaheim, CA", type: "Hockey Arena" },
    { name: "Banc of California Stadium", city: "Los Angeles, CA", type: "Soccer Stadium" },
    { name: "Angel Stadium", city: "Anaheim, CA", type: "MLB Stadium" },
    { name: "Hollywood Bowl", city: "Los Angeles, CA", type: "Amphitheater" },
    { name: "The Forum", city: "Inglewood, CA", type: "Arena" },
  ];

  /* ===============================
          SEARCH LOGIC
  =============================== */
  const filteredVenues = searchQuery.trim()
    ? allVenues.filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  /* ===============================
      MATCH VENUE TO KNOWN LIST
  =============================== */
  function matchVenue(eventVenueName) {
    if (!eventVenueName) return null;

    const exact = allVenues.find(
      (v) => v.name.toLowerCase() === eventVenueName.toLowerCase()
    );
    if (exact) return exact;

    const loose = allVenues.find((v) =>
      eventVenueName.toLowerCase().includes(v.name.toLowerCase())
    );
    return loose || null;
  }

  /* ===============================
                UI
  =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* HERO */}
      <div className="bg-[#0A2540] text-white px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white mb-2 text-3xl font-bold">Find Your Spot</h1>
          <p className="text-cyan-100 mb-6">Park with locals near your favorite venues</p>

          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />

            <Input
              placeholder="Search venues, events, or locations..."
              className="pl-12 pr-12 py-6 rounded-xl border-0 bg-white shadow-lg text-[#0A2540]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(!!e.target.value.trim());
              }}
              onFocus={() => setShowSearchResults(!!searchQuery.trim())}
            />

            {/* CLEAR BUTTON */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* SEARCH RESULTS */}
            {showSearchResults && filteredVenues.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                {filteredVenues.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                      onNavigate("map", { venue: v });
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 text-left border-b border-gray-100 last:border-b-0"
                  >
                    <MapPin className="w-5 h-5 text-[#06B6D4]" />
                    <div className="flex-1">
                      <p className="text-[#0A2540]">{v.name}</p>
                      <p className="text-sm text-gray-600">
                        {v.city} • {v.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BUTTON ROW */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
            <Button onClick={() => onNavigate("map")} className="rounded-full px-6">
              <MapPin className="w-4 h-4 mr-2" /> View Map
            </Button>
            <Button variant="outline" className="rounded-full px-6">
              <Calendar className="w-4 h-4 mr-2" /> My Bookings
            </Button>
          </div>
        </div>
      </div>

      {/* FEATURED EVENTS */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#0A2540] text-xl font-semibold">Popular Events</h2>
            <p className="text-gray-600 mt-1">Find parking near these events</p>
          </div>
          <TrendingUp className="w-5 h-5 text-[#06B6D4]" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {featuredEvents.map((e) => (
            <Card
              key={e.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
              onClick={() =>
                onNavigate("map", {
                  event: e,
                  venue: matchVenue(e.venue),
                })
              }
            >
              {/* IMAGE */}
              <div className="relative h-40">
                <ImageWithFallback
                  src={e.image}
                  alt={e.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-[#06B6D4] text-white border-0">
                    {e.spotsAvailable} spots
                  </Badge>
                </div>
              </div>

              <CardContent>
                <h3 className="text-[#0A2540] font-semibold">{e.name}</h3>

                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{e.venue}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{e.date}</span>
                  </div>

                  <span className="text-[#06B6D4]">From ${e.priceFrom}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

