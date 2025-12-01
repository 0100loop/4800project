import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "./ui/input.js";
import { Button } from "./ui/button.js";
import { Card, CardContent } from "./ui/card.js";
import { Badge } from "./ui/badge.js";
import { ImageWithFallback } from "./thing/ImageWithFallback.js";

interface HomeScreenProps {
  onNavigate: (view: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------
     FETCH EVENTS FROM BACKEND (paginated)
  ---------------------------------------- */
  async function loadEvents(pageNumber: number) {
    try {
      setLoading(true);

      const res = await fetch(`/api/events?page=${pageNumber}`);
      const data = await res.json();

      const normalized = data.map((e: any) => ({
        ...e,
        spotsAvailable: Math.floor(Math.random() * 50) + 10,
        priceFrom: e.priceFrom || Math.floor(Math.random() * 20) + 10,
      }));

      setFeaturedEvents((prev) => [...prev, ...normalized]);
    } catch (err) {
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents(page);
  }, [page]);

  /* ----------------------------------------
      MASTER VENUE LIST
  ---------------------------------------- */
  const allVenues = [
    { id: 1, name: "Crypto.com Arena", city: "Los Angeles, CA", type: "Arena" },
    { id: 2, name: "SoFi Stadium", city: "Inglewood, CA", type: "Stadium" },
    { id: 3, name: "Dodger Stadium", city: "Los Angeles, CA", type: "Baseball Stadium" },
    { id: 4, name: "Rose Bowl Stadium", city: "Pasadena, CA", type: "Football Stadium" },
    { id: 5, name: "Hollywood Bowl", city: "Los Angeles, CA", type: "Amphitheater" },
    { id: 6, name: "The Forum", city: "Inglewood, CA", type: "Arena" },
    { id: 7, name: "Honda Center", city: "Anaheim, CA", type: "Arena" },
    { id: 8, name: "Angel Stadium", city: "Anaheim, CA", type: "Baseball Stadium" },
    { id: 9, name: "Intuit Dome", city: "Inglewood, CA", type: "Basketball Arena" },
    { id: 10, name: "Banc of California Stadium", city: "Los Angeles, CA", type: "Soccer Stadium" },
  ];

  const filteredVenues = searchQuery.trim()
    ? allVenues.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const matchVenue = (venueName: string) => {
    if (!venueName) return null;
    const exact = allVenues.find((v) => v.name.toLowerCase() === venueName.toLowerCase());
    if (exact) return exact;
    return allVenues.find((v) => venueName.toLowerCase().includes(v.name.toLowerCase())) || null;
  };

  /* ----------------------------------------
      UI
  ---------------------------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* TOP BUTTONS */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <Button
          variant="outline"
          className="h-24 flex flex-col justify-center items-center border-2"
          onClick={() => onNavigate("map")}
        >
          <MapPin className="text-[#06B6D4] w-6 h-6" />
          <span>Map View</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col justify-center items-center border-2"
          onClick={() => onNavigate("host")}
        >
          <TrendingUp className="text-[#06B6D4] w-6 h-6" />
          <span>Host</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col justify-center items-center border-2"
          onClick={() => onNavigate("bookings")}
        >
          <Calendar className="text-[#06B6D4] w-6 h-6" />
          <span>My Bookings</span>
        </Button>
      </div>

      {/* FEATURED EVENTS HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[#0A2540] font-semibold">Featured Events</h2>
        <button className="text-[#06B6D4] hover:underline">View All</button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {featuredEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden border hover:shadow-lg cursor-pointer"
            onClick={() =>
              onNavigate("map", {
                event,
                venue: matchVenue(event.venue),
              })
            }
          >
            <div className="relative h-48">
              <ImageWithFallback
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-[#06B6D4] text-white">
                {event.spotsAvailable} spots
              </Badge>
            </div>

            <CardContent>
              <h3 className="text-xl text-[#0A2540] font-semibold mb-2">
                {event.name}
              </h3>

              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{event.venue}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{event.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#0A2540]">
                  From <span className="text-2xl">${event.priceFrom}</span>
                </span>

                <Button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white">
                  Find Parking
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      <div className="flex justify-center mb-16">
        <button
          disabled={loading}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Venues"}
        </button>
      </div>
    </div>
  );
}
