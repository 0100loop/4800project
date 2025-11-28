import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  Filter,
  User,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../ui/ImageWithFallback";

import { fetchEvents, fetchSpots, fetchPopularVenues } from "../lib/homeApi";

interface HomePageProps {
  onNavigate: (view: string, data?: any) => void;
  userType: "guest" | "host";
}

export function HomePage({ onNavigate, userType }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [spots, setSpots] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // -------------------------------
  // LOAD BACKEND DATA ON PAGE LOAD
  // -------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const [eventData, spotData, venueData] = await Promise.all([
          fetchEvents(""),      // loads featured events
          fetchSpots(),         // loads active spots
          fetchPopularVenues(), // loads venue list
        ]);

        setEvents(eventData);
        setSpots(spotData);
        setVenues(venueData);
      } catch (err) {
        console.error("HomePage API Error:", err);
      }
    }

    loadData();
  }, []);

  // -------------------------------
  // SEARCH VENUES LIVE
  // -------------------------------
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const results = venues.filter((v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  }, [searchQuery, venues]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#06B6D4] rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-[#0A2540] font-semibold">ParkIt</span>

            {userType === "host" && (
              <Badge className="ml-2 bg-green-100 text-green-700">Host</Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("profile")}
            className="text-[#0A2540]"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HERO */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-[#0A2540] mb-2">
            Find Your Perfect Spot
          </h1>
          <p className="text-gray-600">
            Discover parking near stadiums, theaters & events.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for venues or events..."
              className="pl-12 pr-4 py-6 text-lg rounded-xl shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {isSearching && (
            <Card className="absolute top-full mt-2 w-full max-h-80 overflow-auto shadow-lg border z-50">

              {searchResults.length === 0 && (
                <div className="p-4 text-center text-gray-500">No results found</div>
              )}

              {searchResults.map((venue, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 p-3 w-full hover:bg-gray-100 text-left"
                  onClick={() => {
                    onNavigate("map", venue);
                    setIsSearching(false);
                  }}
                >
                  <MapPin className="w-4 h-4 text-[#06B6D4]" />
                  <div>
                    <p className="text-[#0A2540] font-medium">{venue.name}</p>
                    <p className="text-xs text-gray-600">{venue.city}</p>
                  </div>
                </button>
              ))}
            </Card>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Button variant="outline" className="h-24 flex-col gap-2 border-2"
            onClick={() => onNavigate("map")}>
            <MapPin className="w-6 h-6 text-[#06B6D4]" />
            Map View
          </Button>

          <Button variant="outline" className="h-24 flex-col gap-2 border-2"
            onClick={() => onNavigate("host")}>
            <TrendingUp className="w-6 h-6 text-[#06B6D4]" />
            Host
          </Button>

          <Button variant="outline" className="h-24 flex-col gap-2 border-2"
            onClick={() => onNavigate("bookings")}>
            <Calendar className="w-6 h-6 text-[#06B6D4]" />
            My Bookings
          </Button>

          <Button variant="outline" className="h-24 flex-col gap-2 border-2">
            <Filter className="w-6 h-6 text-[#06B6D4]" />
            Filters
          </Button>
        </div>

        {/* FEATURED EVENTS */}
        <div className="mb-12">
          <h2 className="text-2xl text-[#0A2540] font-semibold mb-4">
            Featured Events
          </h2>

          {events.length === 0 && (
            <p className="text-gray-600">Loading events...</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition"
                onClick={() => onNavigate("map", event)}>
                
                <div className="h-48 relative">
                  <ImageWithFallback
                    src={`https://source.unsplash.com/featured/?stadium,event,${i}`}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-[#06B6D4] text-white">
                    {event.date}
                  </Badge>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-xl text-[#0A2540] font-semibold">
                    {event.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {event.date} • {event.time || "TBA"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* POPULAR VENUES */}
        <div>
          <h2 className="text-2xl text-[#0A2540] font-semibold mb-4">
            Popular Venues
          </h2>

          {venues.length === 0 && (
            <p className="text-gray-600">Loading venues...</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {venues.map((venue, i) => (
              <Card key={i}
                className="p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => onNavigate("map", venue)}>
                
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 bg-[#06B6D4]/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#06B6D4]" />
                  </div>

                  <div>
                    <p className="text-[#0A2540] font-semibold">{venue.name}</p>
                    <p className="text-sm text-gray-600">{venue.city}</p>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

