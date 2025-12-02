import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "./ui/input.js";
import { Button } from "./ui/button.js";
import { Card, CardContent } from "./ui/card.js";
import { Badge } from "./ui/badge.js";

// ⭐ ALL U.S. stadium / arena venue types from SeatGeek
const ALLOWED_TYPES = [
  "stadium",
  "arena",
  "amphitheatre",
  "ballpark",
  "pavilion",
  "field",
  "bowl",
  "coliseum",
  "speedway",
  "raceway",
  "center",
  "park",
];

export function HomeScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Fetch SeatGeek Events
  // -------------------------------
  async function fetchEvents(p) {
    setLoading(true);

    const params = new URLSearchParams({
      per_page: "20",
      page: p.toString(),
      sort: "datetime_local",
      "datetime_local.gte": "2025-12-01", // ⭐ Only show events from Dec 2025+
    });

    if (searchQuery.trim()) {
      params.append("q", searchQuery);
    }

    const url = `http://localhost:5000/sg/events?${params.toString()}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.events) {
        console.log("No event data received:", data);
        setLoading(false);
        return;
      }

      // ⭐ Filter ONLY U.S. stadium/arena type venues
      const mapped = data.events
        .filter((ev) => {
          const type = ev.venue?.type?.toLowerCase() || "";
          return ALLOWED_TYPES.some((allowed) => type.includes(allowed));
        })
        .map((ev) => ({
          id: ev.id,
          name: ev.title,
          date: ev.datetime_local?.split("T")[0],
          time: ev.datetime_local?.split("T")[1],
          img: ev.performers?.[0]?.image,
          venueName: ev.venue?.name,
          city: ev.venue?.city,
          lat: ev.venue?.location?.lat,
          lng: ev.venue?.location?.lon,
          priceMin: ev.stats?.lowest_price || null,
        }));

      setEvents((prev) => [...prev, ...mapped]);
    } catch (err) {
      console.error("SeatGeek Fetch Error:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    setEvents([]);
    setPage(0);
    fetchEvents(0);
  }, [searchQuery]);

  useEffect(() => {
    if (page > 0) fetchEvents(page);
  }, [page]);

  function openEventMap(event) {
    onNavigate("map", event);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* HEADER */}
      <h1 className="text-5xl font-bold text-[#0A2540] mb-2">
        Find Your Perfect Spot
      </h1>
      <p className="text-gray-600 mb-8">
        Discover parking near stadiums, arenas, and events nationwide.
      </p>

      {/* SEARCH BAR */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <Input
          placeholder="Search for venues or events..."
          className="pl-12 py-6 text-lg text-gray-700 border-gray-300"
          value={searchQuery}
          onChange={(e) => {
            setEvents([]);
            setPage(0);
            setSearchQuery(e.target.value);
          }}
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setEvents([]);
              setPage(0);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ⭐ NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        <Card
          onClick={() => onNavigate("map")}
          className="p-8 text-center hover:shadow-md transition cursor-pointer border-2 border-gray-200"
        >
          <MapPin className="w-8 h-8 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-lg text-[#0A2540] font-medium">Map View</h3>
        </Card>

        <Card
          onClick={() => onNavigate("host")}
          className="p-8 text-center hover:shadow-md transition cursor-pointer border-2 border-gray-200"
        >
          <TrendingUp className="w-8 h-8 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-lg text-[#0A2540] font-medium">Host</h3>
        </Card>

        <Card
          onClick={() => onNavigate("bookings")}
          className="p-8 text-center hover:shadow-md transition cursor-pointer border-2 border-gray-200"
        >
          <Calendar className="w-6 h-6 text-[#06B6D4]" />
          <span className="text-[#000]">My Bookings</span>
        </Card>

      </div>

      {/* ⭐ EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        {events.map((e) => (
          <Card
            key={e.id}
            onClick={() => openEventMap(e)}
            className="cursor-pointer overflow-hidden hover:shadow-lg transition border"
          >
            <div className="relative h-56">
              <img
                src={e.img}
                alt={e.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-[#06B6D4] text-white">
                {e.city}
              </Badge>
            </div>

            <CardContent className="p-5">
              <h3 className="text-xl font-semibold text-[#0A2540] mb-1">
                {e.name}
              </h3>

              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{e.venueName}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{e.date} {e.time}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#0A2540] text-lg">
                  {e.priceMin ? `From $${e.priceMin}` : "Price Unavailable"}
                </span>

                <Button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white">
                  Find Parking
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LOAD MORE */}
      <div className="w-full flex justify-center mt-8">
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
          className="px-6 py-3 bg-[#06B6D4] hover:bg-[#0891b2] text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Events"}
        </Button>
      </div>

      {/* HOST CTA */}
      <Card className="mt-20 mb-20 bg-[#0A2540] text-white border-0">
        <CardContent className="p-6 flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Become a Host</h3>
            <p className="text-cyan-100 mb-4">
              Turn your driveway into extra income during major events.
            </p>

            <Button
              onClick={() => onNavigate("host")}
              className="bg-white text-[#06B6D4] hover:bg-gray-100 px-4 py-2 rounded-md"
            >
              List Your Spot
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

