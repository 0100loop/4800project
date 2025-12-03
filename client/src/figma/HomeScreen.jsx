import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./thing/ImageWithFallback";

export function HomeScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-5xl font-bold text-[#0A2540] mb-2">
        Find Your Perfect Spot
      </h1>
      <p className="text-gray-600 mb-8">
        Discover convenient parking near stadiums, theaters, and events
      </p>

      {/* SEARCH */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search for venues or events..."
          className="pl-12 py-6 text-lg border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* QUICK NAVIGATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card onClick={() => onNavigate("map")}
          className="p-8 text-center cursor-pointer hover:shadow-md border-2 border-gray-200">
          <MapPin className="w-8 h-8 mx-auto mb-3 text-[#06B6D4]" />
          <h3 className="text-lg font-medium text-[#0A2540]">Map View</h3>
        </Card>

        <Card onClick={() => onNavigate("host")}
          className="p-8 text-center cursor-pointer hover:shadow-md border-2 border-gray-200">
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-[#06B6D4]" />
          <h3 className="text-lg font-medium text-[#0A2540]">Host</h3>
        </Card>

        <Card onClick={() => onNavigate("bookings")}
          className="p-8 text-center cursor-pointer hover:shadow-md border-2 border-gray-200">
          <Calendar className="w-6 h-6 mx-auto mb-3 text-[#06B6D4]" />
          <span className="text-[#0A2540]">My Bookings</span>
        </Card>
      </div>

      {/* FEATURED EVENTS */}
      <h2 className="text-2xl font-semibold text-[#0A2540] mb-6">
        Featured Events
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {featuredEvents.map((e) => (
          <Card
            key={e.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg border rounded-xl"
            onClick={() => onNavigate("map", { event: e })}
          >
            <div className="relative h-56">
              <ImageWithFallback
                src={e.image}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-[#06B6D4] text-white">
                {e.priceFrom ? `$${e.priceFrom}` : "TBA"}
              </Badge>
            </div>

            <CardContent className="p-5">
              <h3 className="text-xl font-semibold text-[#0A2540] mb-2">
                {e.name}
              </h3>

              <div className="flex items-center mb-1 text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{e.venue}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(e.date).toLocaleString()}</span>
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
          {loading ? "Loading..." : "Load More Events"}
        </Button>
      </div>

      {/* HOST CTA */}
      <div className="w-full flex justify-center mb-24">
        <div className="w-full md:w-[900px] bg-gradient-to-r from-[#0A2540] to-[#134E6F] rounded-xl p-8 flex items-center justify-between shadow-lg">

          <div className="flex-1">
            <h3 className="text-white text-xl font-semibold mb-2">Become a Host</h3>
            <p className="text-cyan-100 mb-4">Turn your driveway into extra income on event days</p>

            <button
              onClick={() => onNavigate("host")}
              className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-6 py-2 rounded-lg font-medium"
            >
              List Your Spot
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1630350215986-ddaf3124eeb1?q=80&w=400"
            className="w-28 h-28 rounded-lg object-cover hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}
