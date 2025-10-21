import { MapPin, Navigation, DollarSign, Clock, Filter, ChevronLeft, Search } from 'lucide-react';
import { Button } from './ui/button.js';
import { Card, CardContent } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { Input } from './ui/input.js';
import { useState } from 'react';

interface MapViewProps {
  onNavigate: (view: string, data?: any) => void;
  viewData?: any;
}

export function MapView({ onNavigate, viewData }: MapViewProps) {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVenueSearch, setShowVenueSearch] = useState(false);

  // Get venue info from viewData if available
  const currentVenue = viewData?.venue || viewData?.event?.venue || 'Crypto.com Arena';
  const currentEvent = viewData?.event?.name || 'Find Parking';
  const currentDate = viewData?.event?.date || '';

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
        venue.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allVenues;

  const handleVenueSelect = (venue: typeof allVenues[0]) => {
    setSearchQuery('');
    setShowVenueSearch(false);
    onNavigate('map', { venue });
  };

  const parkingSpots = [
    {
      id: 1,
      lat: 34.0430,
      lng: -118.2673,
      price: 15,
      distance: '0.3 mi',
      walkTime: '6 min',
      rating: 4.8,
      host: 'Mike T.',
      amenities: ['EV Charging', 'Bathroom'],
      tailgateFriendly: true,
      safetyScore: 95
    },
    {
      id: 2,
      lat: 34.0445,
      lng: -118.2650,
      price: 20,
      distance: '0.4 mi',
      walkTime: '8 min',
      rating: 4.9,
      host: 'Sarah L.',
      amenities: ['Covered', 'Shuttle'],
      tailgateFriendly: false,
      safetyScore: 98
    },
    {
      id: 3,
      lat: 34.0410,
      lng: -118.2690,
      price: 12,
      distance: '0.5 mi',
      walkTime: '10 min',
      rating: 4.6,
      host: 'John D.',
      amenities: ['Bathroom', 'Food Nearby'],
      tailgateFriendly: true,
      safetyScore: 92
    },
    {
      id: 4,
      lat: 34.0455,
      lng: -118.2685,
      price: 18,
      distance: '0.2 mi',
      walkTime: '4 min',
      rating: 5.0,
      host: 'Emma R.',
      amenities: ['EV Charging', 'Covered', 'Bathroom'],
      tailgateFriendly: false,
      safetyScore: 99
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3 mb-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNavigate('home')}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h3 className="text-[#0A2540]">{typeof currentVenue === 'string' ? currentVenue : currentVenue.name}</h3>
            {currentDate && <p className="text-sm text-gray-600">{currentEvent} - {currentDate}</p>}
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Venue Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Input
            placeholder="Search different venue..."
            className="pl-10 pr-4 py-2 rounded-lg border-gray-200 text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowVenueSearch(true);
            }}
            onFocus={() => setShowVenueSearch(true)}
          />
          
          {/* Venue Search Dropdown */}
          {showVenueSearch && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowVenueSearch(false)}
              />
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl overflow-hidden z-30 max-h-64 overflow-y-auto border border-gray-200">
                {filteredVenues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => handleVenueSelect(venue)}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-start gap-2 text-left border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0A2540]">{venue.name}</p>
                      <p className="text-xs text-gray-500">{venue.city}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Mock Map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl mx-auto">
            {/* Venue Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-[#0A2540] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 fill-[#06B6D4] text-white" />
                <span>Venue</span>
              </div>
            </div>

            {/* Parking Spot Markers */}
            {parkingSpots.map((spot, index) => {
              const positions = [
                { top: '35%', left: '60%' },
                { top: '45%', left: '70%' },
                { top: '30%', left: '40%' },
                { top: '55%', left: '55%' }
              ];
              
              return (
                <div
                  key={spot.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  style={positions[index]}
                  onClick={() => setSelectedSpot(spot.id)}
                >
                  <div className={`
                    rounded-full shadow-lg transition-all
                    ${selectedSpot === spot.id 
                      ? 'bg-[#06B6D4] text-white scale-110' 
                      : 'bg-white text-[#0A2540] hover:scale-105'
                    }
                    px-3 py-1.5 flex items-center gap-1 border-2 border-white
                  `}>
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium">{spot.price}</span>
                  </div>
                </div>
              );
            })}

            {/* Distance circles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-48 border-2 border-[#06B6D4]/30 rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-[#06B6D4]/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Navigation Button */}
        <Button
          className="absolute top-4 right-4 bg-white text-[#0A2540] hover:bg-gray-50 shadow-lg rounded-full z-30"
          size="icon"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Bottom Sheet with Spots List */}
      <div className="bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 border-b border-gray-100">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <h3 className="text-[#0A2540]">{parkingSpots.length} Spots Available</h3>
          <p className="text-gray-600 text-sm mt-1">Sorted by distance</p>
        </div>

        <div className="p-4 space-y-3">
          {parkingSpots.map((spot) => (
            <Card
              key={spot.id}
              className={`cursor-pointer transition-all ${
                selectedSpot === spot.id 
                  ? 'border-[#06B6D4] border-2 shadow-md' 
                  : 'border-gray-200 hover:shadow-md'
              }`}
              onClick={() => onNavigate('spot', { spot })}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Spot Image Placeholder */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0A2540] to-[#134E6F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-8 h-8 text-[#06B6D4]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[#0A2540]">${spot.price}</h4>
                          <Badge variant="outline" className="text-xs border-[#06B6D4] text-[#06B6D4]">
                            {spot.rating} ⭐
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Hosted by {spot.host}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{spot.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{spot.walkTime} walk</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {spot.tailgateFriendly && (
                        <Badge className="bg-[#06B6D4]/10 text-[#06B6D4] text-xs border-0">
                          🎉 Tailgate OK
                        </Badge>
                      )}
                      {spot.amenities.slice(0, 2).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
