import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HomeScreenProps {
  onNavigate: (view: string, data?: any) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  /* LOAD EVENTS */
  async function loadEvents(p: number) {
    try {
      setLoading(true);
      const res = await fetch(`/api/events?page=${p}`);
      const data = await res.json();

      const normalized = data.map((e: any) => ({
        ...e,
        spotsAvailable: Math.floor(Math.random() * 40) + 5,
        priceFrom: e.priceFrom || Math.floor(Math.random() * 20) + 10,
      }));

      setFeaturedEvents((prev) => [...prev, ...normalized]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents(page);
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* TITLE */}
      <h1 className="text-5xl font-bold text-[#0A2540] mb-3">
        Find Your Perfect Spot
      </h1>
      <p className="text-gray-600 mb-10 text-lg">
        Discover convenient parking near stadiums, theaters, and events
      </p>

      {/* SEARCH */}
      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        <Input
          placeholder="Search for venues or events..."
          className="pl-14 py-6 text-lg border-gray-300 text-[#0A2540]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3 MAIN TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

        <Card
          onClick={() => onNavigate("map")}
          className="p-8 text-center border-2 border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
          <MapPin className="w-9 h-9 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-[#0A2540]">Map View</h3>
        </Card>

        <Card
          onClick={() => onNavigate("hostDashboard")}
          className="p-8 text-center border-2 border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
          <TrendingUp className="w-9 h-9 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-[#0A2540]">Host</h3>
        </Card>

        <Card
          onClick={() => onNavigate("bookings")}
          className="p-8 text-center border-2 border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
          <Calendar className="w-9 h-9 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-[#0A2540]">My Bookings</h3>
        </Card>

      </div>

      {/* FEATURED EVENTS */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#0A2540]">
          Featured Events
        </h2>
        <button className="text-[#06B6D4] font-medium hover:underline">
          View All
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid md:grid-cols-2 gap-10 mb-14">
        {featuredEvents.map((e: any, index) => (
          <Card
            key={`${e.id}-${index}`}
            className="overflow-hidden border hover:shadow-lg transition cursor-pointer"
            onClick={() => onNavigate("map", { event: e })}
          >
            {/* IMAGE */}
            <div className="relative h-56">
              <ImageWithFallback
                src={e.image}
                alt={e.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-[#06B6D4] text-white text-sm">
                {e.spotsAvailable} spots
              </Badge>
            </div>

            {/* CONTENT */}
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-[#0A2540] mb-2">
                {e.name}
              </h3>

              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{e.venue}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-5 h-5 mr-1" />
                <span>{e.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#0A2540]">
                  From{" "}
                  <span className="text-2xl font-semibold">
                    ${e.priceFrom}
                  </span>
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
      <div className="flex justify-center mb-20">
        <Button
          disabled={loading}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Venues"}
        </Button>
      </div>

      {/* Figma CTA */}
      <Card className="bg-gradient-to-r from-[#0A2540] to-[#134E6F] text-white shadow-lg rounded-xl mb-32">
        <CardContent className="px-8 py-8 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Become a Host</h3>
            <p className="text-cyan-100 mb-3">
              Turn your driveway into extra income on event days
            </p>

            <Button
              onClick={() => onNavigate("hostDashboard")}
              className="bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-md px-6 py-2"
            >
              List Your Spot
            </Button>
          </div>

          <ImageWithFallback
            src="https://images.unsplash.com/photo-1630350215986-ddaf3124eeb1?q=80&w=400"
            alt="Driveway"
            className="w-28 h-28 rounded-lg object-cover hidden md:block"
          />
        </CardContent>
      </Card>

    </div>
  );
}
