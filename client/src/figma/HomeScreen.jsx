import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "./thing/ImageWithFallback";
import { apiFetch } from "../lib/api";

export function HomeScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⭐ Load featured events from backend
  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/events");
      setFeaturedEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Event load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ⭐ Search SeatGeek via backend
  const searchBackend = async (q) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const data = await apiFetch(`/api/seatgeek/events?q=${encodeURIComponent(q)}`);
      setSearchResults(data?.events || []);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => searchBackend(searchQuery), 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // ⭐ Helpers
  const getVenueName = (e) =>
    e.venue?.name || e.performers?.[0]?.venue_name || "Unknown Venue";

  const getLocation = (e) => {
    const c = e.venue?.city || e.performers?.[0]?.location?.city;
    const s = e.venue?.state || e.performers?.[0]?.location?.state;
    return c && s ? `${c}, ${s}` : c || s || "Unknown";
  };

  const getImage = (e) =>
    e.image ||
    e.performers?.[0]?.image ||
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* TITLE */}
      <h1 className="text-5xl font-bold text-[#0A2540] mb-2">Find Your Perfect Spot</h1>
      <p className="text-gray-600 mb-8">
        Discover convenient parking near stadiums, theaters, and events
      </p>

      {/* SEARCH BAR */}
      <div className="relative mb-10">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />

        <Input
          placeholder="Search for venues or events..."
          className="w-full border border-gray-300 rounded-xl py-5 pl-14 pr-10 text-lg text-gray-700 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery && (
          <button
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setSearchQuery("")}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* SEARCH RESULTS DROPDOWN */}
        {searchQuery && (
          <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg border rounded-xl max-h-80 overflow-y-auto z-50">
            {searchLoading && <div className="p-4 text-gray-500">Searching…</div>}

            {!searchLoading &&
              searchResults.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onNavigate("map", { event: item });
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <div className="font-semibold text-[#0A2540]">{item.title}</div>
                  <div className="text-sm text-gray-600">
                    {getVenueName(item)} — {getLocation(item)}
                  </div>
                </div>
              ))}

            {!searchLoading && searchResults.length === 0 && (
              <div className="p-4 text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* FEATURE BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card
          className="p-10 shadow-sm hover:shadow-md cursor-pointer border rounded-xl text-center"
          onClick={() => onNavigate("map")}
        >
          <MapPin className="w-10 h-10 text-[#06B6D4] mx-auto mb-4" />
          <h3 className="text-xl text-[#0A2540] font-medium">Map View</h3>
        </Card>

        <Card
          className="p-10 shadow-sm hover:shadow-md cursor-pointer border rounded-xl text-center"
          onClick={() => onNavigate("host")}
        >
          <TrendingUp className="w-10 h-10 text-[#06B6D4] mx-auto mb-4" />
          <h3 className="text-xl text-[#0A2540] font-medium">Host</h3>
        </Card>

        <Card
          className="p-10 shadow-sm hover:shadow-md cursor-pointer border rounded-xl text-center"
          onClick={() => onNavigate("bookings")}
        >
          <Calendar className="w-9 h-9 text-[#06B6D4] mx-auto mb-4" />
          <h3 className="text-xl text-[#0A2540] font-medium">My Bookings</h3>
        </Card>
      </div>

      {/* FEATURED EVENTS */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#0A2540]">Featured Events</h2>
        <button className="text-[#06B6D4] font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {featuredEvents.map((e) => (
          <Card
            key={e.id}
            className="overflow-hidden rounded-xl shadow hover:shadow-lg cursor-pointer"
            onClick={() => onNavigate("map", { event: e })}
          >
            {/* IMAGE */}
            <div className="relative h-64 w-full">
              <ImageWithFallback
                src={getImage(e)}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-[#06B6D4] text-white px-3 py-1">
                {e.stats?.lowest_price
                  ? `${Math.floor(Math.random() * 50)} spots`
                  : "TBA"}
              </Badge>
            </div>

            {/* CONTENT */}
            <CardContent className="p-5">
              <h3 className="text-2xl font-semibold text-[#0A2540] mb-2">
                {e.title}
              </h3>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                {getVenueName(e)} — {getLocation(e)}
              </div>

              <div className="flex items-center text-gray-600 mt-2">
                <Calendar className="w-5 h-5 mr-2" />
                {new Date(e.datetime_local).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
