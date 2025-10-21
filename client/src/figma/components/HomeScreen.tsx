import { useState } from 'react';
import { Search, MapPin, Calendar, TrendingUp, X } from 'lucide-react';
import { Input } from './ui/input.js';
import { Button } from './ui/button.js';
import { Card, CardContent } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { ImageWithFallback } from './figma/ImageWithFallback.js';

interface HomeScreenProps {
  onNavigate: (view: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  const featuredEvents = [
    {
      id: 1,
      name: 'Lakers vs Warriors',
      venue: 'Crypto.com Arena',
      date: 'Oct 15, 2025',
      image: 'https://images.unsplash.com/photo-1592841897894-108b4aa4f076?auto=format&fit=crop&w=1280&q=60',
      spotsAvailable: 42,
      priceFrom: 15,
    },
    {
      id: 2,
      name: 'Taylor Swift Concert',
      venue: 'SoFi Stadium',
      date: 'Oct 22, 2025',
      image: 'https://images.unsplash.com/photo-1534050055340-71c7fa612a99?auto=format&fit=crop&w=1280&q=60',
      spotsAvailable: 28,
      priceFrom: 25,
    },
    {
      id: 3,
      name: 'Dodgers vs Giants',
      venue: 'Dodger Stadium',
      date: 'Oct 18, 2025',
      image: 'https://images.unsplash.com/photo-1592841897894-108b4aa4f076?auto=format&fit=crop&w=1280&q=60',
      spotsAvailable: 56,
      priceFrom: 18,
    },
    {
      id: 4,
      name: 'USC vs UCLA Game',
      venue: 'Rose Bowl Stadium',
      date: 'Nov 2, 2025',
      image: 'https://images.unsplash.com/photo-1592841897894-108b4aa4f076?auto=format&fit=crop&w=1280&q=60',
      spotsAvailable: 34,
      priceFrom: 22,
    },
  ];

  const filteredVenues = searchQuery.trim()
    ? allVenues.filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleVenueSelect = (venue: (typeof allVenues)[0]) => {
    setSearchQuery('');
    setShowSearchResults(false);
    onNavigate('map', { venue });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[#0A2540] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-semibold">Find Your Spot</h1>
          <p className="text-cyan-100 mt-1">Park with locals near your favorite venues</p>

          {/* Search Bar */}
          <div className="relative mt-5">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search venues, events, or locations..."
              className="pl-12 pr-12 h-12 rounded-full border-0 bg-white text-[#0A2540] shadow-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(!!e.target.value.trim());
              }}
              onFocus={() => setShowSearchResults(!!searchQuery.trim())}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {showSearchResults && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                {filteredVenues.length ? (
                  filteredVenues.map((venue) => (
                    <button
                      key={venue.id}
                      onClick={() => handleVenueSelect(venue)}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 text-left border-b border-gray-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-[#06B6D4]" />
                      <div className="flex-1">
                        <p className="text-[#0A2540] font-medium">{venue.name}</p>
                        <p className="text-sm text-gray-600">{venue.city} • {venue.type}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-600">No venues found</div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <Button onClick={() => onNavigate('map')} className="bg-[#06B6D4] text-white rounded-full px-6">
              <MapPin className="w-4 h-4 mr-2" /> View Map
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white rounded-full px-6">
              <Calendar className="w-4 h-4 mr-2" /> My Bookings
            </Button>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-[linear-gradient(180deg,#F0F9FF_0%,#FFFFFF_40%)]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-[#0A2540] font-semibold">Popular Events</h2>
              <p className="text-gray-600 text-sm">Find parking near these events</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#06B6D4]" />
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-5">
            {featuredEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
                onClick={() => onNavigate('map', { event, venue: allVenues.find(v => v.name === event.venue) })}
              >
                <div className="relative aspect-[16/9]">
                  <ImageWithFallback src={event.image} alt={event.name} className="absolute inset-0 object-cover w-full h-full" />
                  <Badge className="absolute top-3 right-3 bg-[#06B6D4] text-white border-0">{event.spotsAvailable} spots</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-[#0A2540] font-medium">{event.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" /> {event.venue}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" /> {event.date}
                    </div>
                    <span className="text-[#06B6D4] font-medium">From ${event.priceFrom}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
