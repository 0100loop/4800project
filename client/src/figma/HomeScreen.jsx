import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./thing/ImageWithFallback";

export function HomeScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ============================================
     LOAD FEATURED EVENTS (already future-only)
  ============================================ */
  async function loadEvents(p = 1, clear = false) {
    try {
      setLoading(true);
      const res = await fetch(`/api/events?page=${p}`);
      const data = await res.json();

      if (!Array.isArray(data)) return;
      if (clear) setFeaturedEvents(data);
      else setFeaturedEvents((prev) => [...prev, ...data]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents(1, true);
  }, []);

  /* ============================================
     SEARCH EVENTS / VENUES
  ============================================ */
  async function searchBackend(q) {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const res = await fetch(`/api/seatgeek/events?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (Array.isArray(data?.events)) {
        setSearchResults(data.events);
      } else {
        setSearchResults([]);
      }
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => searchBackend(searchQuery), 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  /* ============================================
     VENUE HELPERS (normal + parking events)
  ============================================ */
  const getVenueName = (e) =>
    e.venue?.name ||
    e.performers?.[0]?.venue_name ||
    e.performers?.[0]?.short_name ||
    "Unknown Venue";

  const getCity = (e) =>
    e.venue?.city || e.performers?.[0]?.location?.city || "";

  const getState = (e) =>
    e.venue?.state || e.performers?.[0]?.location?.state || "";

  const getLocation = (e) => {
    const c = getCity(e);
    const s = getState(e);
    return c && s ? `${c}, ${s}` : c || s || "Location Unknown";
  };

  const getImage = (e) =>
    e.image ||
    e.performers?.[0]?.image ||
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* TITLE */}
      <h1 className="text-5xl font-bold text-[#0A2540] mb-2">
        Find Your Perfect Spot
      </h1>
      <p className="text-gray-600 mb-8">
        Discover convenient parking near stadiums, arenas, and major events.
      </p>

      {/* SEARCH BAR */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <Input
          placeholder="Search for stadiums, events, or teams..."
          className="pl-12 py-6 text-lg border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* SEARCH DROPDOWN */}
        {searchQuery && (
          <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-xl max-h-80 overflow-y-auto z-50">
            {searchLoading && (
              <div className="p-4 text-gray-500">Searching…</div>
            )}

            {!searchLoading && searchResults.length === 0 && (
              <div className="p-4 text-gray-400">No results found</div>
            )}

            {!searchLoading &&
              searchResults.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onNavigate("eventDetails", { event: item });
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <div className="font-semibold text-[#0A2540]">
                    {item.title}
                  </div>

                  <div className="text-gray-600 text-sm">
                    {getVenueName(item)} — {getLocation(item)}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* QUICK NAVIGATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card
          onClick={() => onNavigate("map")}
          className="p-8 text-center cursor-pointer hover:shadow-md border-2 border-gray-200"
        >
          <MapPin className="w-8 h-8 mx-auto mb-3 text-[#06B6D4]" />
          <h3 className="text-lg font-medium text-[#0A2540]">Map View</h3>
        </Card>

        <Card
          onClick={() => onNavigate("host")}
          className="p-8 text-center cursor-pointer hover:shadow-md border-2 border-gray-200"
        >
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-[#06B6D4]" />
          <h3 className="text-lg font-medium text-[#0A2540]">Become a Host</h3>
        </Card>

        <Card
          onClick={() => onNavigate("bookings")}
          className="p-8 text-center cursor-pointer hover:shadow-md border-2 border-gray-200"
        >
          <Calendar className="w-6 h-6 mx-auto mb-3 text-[#06B6D4]" />
          <span className="text-[#0A2540]">My Bookings</span>
        </Card>
      </div>

      {/* FEATURED EVENTS */}
      <h2 className="text-2xl font-semibold text-[#0A2540] mb-6">
        Upcoming Events
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {featuredEvents.map((e) => (
          <Card
            key={e.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg border rounded-xl"
            onClick={() => onNavigate("eventDetails", { event: e })}
          >
            <div className="relative h-56">
              <ImageWithFallback
                src={getImage(e)}
                className="w-full h-full object-cover"
              />

              <Badge className="absolute top-4 right-4 bg-[#06B6D4] text-white">
                {e.stats?.lowest_price ? `$${e.stats.lowest_price}` : "TBA"}
              </Badge>
            </div>

            <CardContent className="p-5">
              <h3 className="text-xl font-semibold text-[#0A2540] mb-2">
                {e.title}
              </h3>

              <div className="flex items-center mb-1 text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{getVenueName(e)} — {getLocation(e)}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(e.datetime_local).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LOAD MORE */}
      <div className="flex justify-center mb-20">
        <Button
          disabled={loading}
          onClick={() => {
            const next = page + 1;
            setPage(next);
            loadEvents(next);
          }}
          className="px-6 py-3 bg-[#06B6D4] text-white rounded-lg"
        >
          {loading ? "Loading…" : "Load More Events"}
        </Button>
      </div>

    </div>
  );
}
