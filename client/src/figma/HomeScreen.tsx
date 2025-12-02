import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "./ui/input.js";
import { Button } from "./ui/button.js";
import { Card, CardContent } from "./ui/card.js";
import { Badge } from "./ui/badge.js";
import { ImageWithFallback } from "./thing/ImageWithFallback.js";

export function HomeScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadEvents(p) {
    try {
      setLoading(true);
      const res = await fetch(`/api/events?page=${p}`);
      const data = await res.json();

      const normalized = data.map((e) => ({
        ...e,
        spotsAvailable: Math.floor(Math.random() * 50) + 10,
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
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-5xl font-bold text-[#0A2540] mb-2">
        Find Your Perfect Spot
      </h1>
      <p className="text-gray-600 mb-8">
        Discover convenient parking near stadiums, theaters, and events
      </p>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search for venues or events..."
          className="pl-12 py-6 text-lg text-gray-600 border-gray-300"
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
<<<<<<< HEAD
          <Calendar className="w-6 h-6 text-[#06B6D4]" />
          <span className="text-[#000]">My Bookings</span>
        </Button>
      </div>

      {/* Featured Events */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-[#0A2540]">Featured Events</h2>
          <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-4 py-2 text-[#06B6D4] hover:bg-accent hover:text-accent-foreground">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example Event Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="h-48 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-11?w=800&h=600&fit=crop"
                alt="Lakers vs Warriors"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-[#06B6D4] text-white text-xs px-2 py-0.5 rounded-md">
                24 spots
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-xl text-[#0A2540] mb-2">Lakers vs Warriors</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Crypto.com Arena</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Dec 15, 2024 at 7:30 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0A2540]">
                  From <span className="text-2xl">$15</span>
                </span>
                <button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white rounded-md px-4 py-2 text-sm font-medium">
                  Find Parking
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="h-48 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-11?w=800&h=600&fit=crop"
                alt="Lakers vs Warriors"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-[#06B6D4] text-white text-xs px-2 py-0.5 rounded-md">
                24 spots
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-xl text-[#0A2540] mb-2">Michelle vs Michelle</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Crypto.com Arena</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Nov 11 , 2025 at 7:30 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0A2540]">
                  From <span className="text-2xl">$10000</span>
                </span>
                <button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white rounded-md px-4 py-2 text-sm font-medium">
                  Find Parking
                </button>
              </div>
            </div>
          </div>
          </div>

          {/* Add more event cards here */}
          <div className="flex justify-center mt-6 pt-12">
            <button
              disabled={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setPage(prev => prev + 1);
                  setLoading(false);
                }, 1000);
              }}
              className="px-4 py-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "Load More Venues"}
            </button>
          </div>

        {/* Host CTA */}
        <Card className="mt-8 mb-20 md:mb-8 bg-gradient-to-r bg-[#0A2540] text-white border-0">
          <CardContent className="p-6">
           
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl text-white mb-2">Become a Host</h3>
                <p className="text-cyan-100 mb-4">
                  Turn your driveway into extra income on event days    
                </p>   
                <Button 
                  onClick={() => onNavigate('host')}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3 bg-white text-[#06B6D4] hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map-pin w-4 h-4 mr-2 from-[#06B6D4] to-[#0891b2]" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  List Your Spot
                </Button>
                
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trending-up w-16 h-16 opacity-50" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>
          
               </div>
             
          </CardContent>
=======
          <Calendar className="w-8 h-8 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-lg text-[#0A2540] font-medium">My Bookings</h3>
>>>>>>> c02acb4143d731f40199193eae81173d0c596861
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#0A2540]">Featured Events</h2>
        <button className="text-[#06B6D4] font-medium hover:underline">View All</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {featuredEvents.map((e, index) => (
          <Card
            key={index}  // UNIQUE KEY FIX
            className="overflow-hidden hover:shadow-lg border cursor-pointer"
            onClick={() => onNavigate("map", { event: e })}
          >
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

            <CardContent className="p-5">
              <h3 className="text-xl text-[#0A2540] font-semibold mb-2">{e.name}</h3>

              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{e.venue}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{e.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#0A2540]">
                  From <span className="text-2xl">${e.priceFrom}</span>
                </span>

                <Button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white">
                  Find Parking
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center my-10">
        <button
          disabled={loading}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Venues"}
        </button>
      </div>
{/* CTA – Become a Host */}
<div className="w-full flex justify-center mt-20 mb-20">
  <div className="w-full md:w-[900px] bg-gradient-to-r from-[#0A2540] to-[#134E6F] rounded-xl p-8 flex items-center justify-between shadow-lg">
    <div>
      <h3 className="text-white text-xl font-semibold mb-2">
        Become a Host
      </h3>
      <p className="text-cyan-100 mb-4">
        Turn your driveway into extra income on event days
      </p>
      <button
        onClick={() => onNavigate("host")}
        className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-6 py-2 rounded-lg font-medium"
      >
        List Your Spot
      </button>
    </div>

    <img
      src="https://images.unsplash.com/photo-1630350215986-ddaf3124eeb1?q=80&w=400"
      alt="Driveway"
      className="w-28 h-28 rounded-lg object-cover hidden md:block"
    />
  </div>
</div>


    </div>
  );
}

