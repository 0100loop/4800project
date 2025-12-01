import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, TrendingUp, X } from 'lucide-react';
import { Input } from './ui/input.js';
import { Button } from './ui/button.js';
import { Card, CardContent } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { ImageWithFallback } from './thing/ImageWithFallback.js';

interface HomeScreenProps {
  onNavigate: (view: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [featuredEvents, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
          import.meta.env.VITE_TICKETMASTER_API_KEY
        }&city=Los%20Angeles&size=20&page=${page}`
      );

      const data = await res.json();
      const tmEvents = data._embedded?.events || [];

      const normalized = tmEvents.map((e: any) => ({
        id: e.id,
        name: e.name,
        venue: e._embedded?.venues?.[0]?.name || "Unknown Venue",
        date: e.dates?.start?.localDate || "",
        image:
          e.images?.find((img: any) => img.width > 900)?.url ||
          "https://via.placeholder.com/800x400",
        spotsAvailable: Math.floor(Math.random() * 50) + 10,
        priceFrom:
          e.priceRanges?.[0]?.min || Math.floor(Math.random() * 30) + 10,
      }));

      setEvents(prev => [...prev, ...normalized]);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, [page]);


  

  const allVenues = [
    { id: 1, name: 'Crypto.com Arena', city: 'Los Angeles, CA', type: 'Arena' },
    { id: 2, name: 'SoFi Stadium', city: 'Inglewood, CA', type: 'Stadium' },
    { id: 3, name: 'Dodger Stadium', city: 'Los Angeles, CA', type: 'Baseball Stadium' },
    { id: 4, name: 'Rose Bowl Stadium', city: 'Pasadena, CA', type: 'Football Stadium' },
    { id: 5, name: 'Hollywood Bowl', city: 'Los Angeles, CA', type: 'Amphitheater' },
    { id: 6, name: 'The Forum', city: 'Inglewood, CA', type: 'Arena' },
    { id: 7, name: 'Banc of California Stadium', city: 'Los Angeles, CA', type: 'Soccer Stadium' },
    { id: 8, name: 'Angel Stadium', city: 'Anaheim, CA', type: 'Baseball Stadium' },
    { id: 9, name: 'Honda Center', city: 'Anaheim, CA', type: 'Arena' },
    { id: 10, name: 'Greek Theatre', city: 'Los Angeles, CA', type: 'Theater' },
  ];

  const filteredVenues = searchQuery.trim()
    ? allVenues.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleVenueSelect = (venue: typeof allVenues[0]) => {
    setSearchQuery('');
    setShowSearchResults(false);
    onNavigate('map', { venue });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#0A2540] mb-2">Find Your Perfect Spot</h1>
        <p className="text-gray-600">
          Discover convenient parking near stadiums, theaters, and events
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for venues or events..."
            className="pl-12 pr-4 py-6 text-lg text-gray-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery && (
          <Card className="mt-2 w-full max-h-96 overflow-y-auto shadow-lg z-50">
            {filteredVenues.length > 0 ? (
              <div className="p-2">
                {filteredVenues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => handleVenueSelect(venue)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <MapPin className="w-5 h-5 text-[#06B6D4] flex-shrink-0" />
                    <div>
                      <div className="text-[#0A2540]">{venue.name}</div>
                      <div className="text-sm text-gray-600">
                        {venue.city} • {venue.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No venues found</div>
            )}
          </Card>
        )}
      </div>

      {/* Buttons BELOW the search/hero area */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 pt-8">
        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2 rounded-md text-sm font-medium transition-all border-gray-300"
          onClick={() => onNavigate("map")}
        >
          <MapPin className="w-6 h-6 text-[#06B6D4]" />
          <span className="text-[#000]">Map View</span>
        </Button>

        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2 rounded-md text-sm font-medium transition-all border-gray-300"
          onClick={() => onNavigate("host")}
        >
          <TrendingUp className="w-6 h-6 text-[#06B6D4]" />
          <span className="text-[#000]">Host</span>
        </Button>

        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2 rounded-md text-sm font-medium transition-all border-gray-300"
          onClick={() => onNavigate("bookings")}
        >
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
        <Card className="mt-8 mb-20 md:mb-8 bg-gradient-to-r from-[#0A2540] to-[#134E6F] text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-2xl text-white mb-2">Become a Host</h3>
                <p className="text-cyan-100 mb-4">
                  Turn your driveway into extra income on event days
                </p>
                <Button 
                  onClick={() => onNavigate('host')}
                  className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                >
                  List Your Spot
                </Button>
              </div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1630350215986-ddaf3124eeb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2ZXdheSUyMGhvdXNlfGVufDF8fHx8MTc1OTc4MTQ0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Host driveway"
                className="w-24 h-24 rounded-lg object-cover hidden md:block"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
   