import { ChevronLeft, MapPin, Clock, Shield, Star, Zap, Home, Truck, Coffee, Beer, Calendar } from 'lucide-react';
import { Button } from './ui/button.js';
import { Card, CardContent } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { Separator } from './ui/separator.js';
import { Checkbox } from './ui/checkbox.js';
import { Label } from './ui/label.js';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback.js';

interface SpotDetailsProps {
  onNavigate: (view: string, data?: any) => void;
  spotData?: any;
}

export function SpotDetails({ onNavigate, spotData }: SpotDetailsProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const spot = spotData?.spot || {
    id: 1,
    price: 15,
    distance: '0.3 mi',
    walkTime: '6 min',
    rating: 4.8,
    reviewCount: 127,
    host: 'Mike T.',
    hostSince: '2023',
    amenities: ['EV Charging', 'Bathroom'],
    tailgateFriendly: true,
    safetyScore: 95,
    description: 'Spacious driveway with easy in/out access. Perfect for game day! Close to venue with well-lit street.'
  };

  const addons = [
    { id: 'bathroom', name: 'Bathroom Access', price: 3, icon: Home },
    { id: 'ev', name: 'EV Charging', price: 8, icon: Zap },
    { id: 'shuttle', name: 'Shuttle Service', price: 5, icon: Truck }
  ];

  const nearbyRecommendations = [
    { name: 'Joe\'s Pizza', type: 'Food', distance: '0.1 mi', rating: 4.5 },
    { name: 'The Sports Bar', type: 'Drinks', distance: '0.2 mi', rating: 4.7 },
    { name: 'Corner Cafe', type: 'Coffee', distance: '0.1 mi', rating: 4.6 }
  ];

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const addonsTotal = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return spot.price + addonsTotal;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Image */}
      <div className="relative h-64 bg-gradient-to-br from-[#0A2540] to-[#134E6F]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('map')}
          className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-24 h-24 text-[#06B6D4] opacity-50" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <Badge className="bg-[#06B6D4] text-white border-0 px-3 py-1">
            {spot.rating} ⭐ ({spot.reviewCount} reviews)
          </Badge>
          {spot.tailgateFriendly && (
            <Badge className="bg-white text-[#0A2540] border-0 px-3 py-1">
              🎉 Tailgate Friendly
            </Badge>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Title and Price */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[#0A2540] mb-1">Driveway Parking</h2>
              <p className="text-gray-600">Hosted by {spot.host}</p>
              <p className="text-sm text-gray-500">Hosting since {spot.hostSince}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-[#0A2540]">${spot.price}</div>
              <p className="text-sm text-gray-600">per event</p>
            </div>
          </div>

          {/* Safety Score */}
          <Card className="mb-4 border-[#06B6D4]/30 bg-[#06B6D4]/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#06B6D4] rounded-full p-2">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#0A2540]">Safety Score</span>
                    <Badge className="bg-[#06B6D4] text-white border-0">{spot.safetyScore}%</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Well-lit area, verified host, secure location</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-3">Location Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-[#06B6D4]" />
                  <div>
                    <p>{spot.distance} from venue</p>
                    <p className="text-sm text-gray-500">1234 Oak Street, Los Angeles</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-[#06B6D4]" />
                  <div>
                    <p>{spot.walkTime} walk to venue</p>
                    <p className="text-sm text-gray-500">Easy, flat route</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="mb-4">
            <h3 className="text-[#0A2540] mb-2">About this spot</h3>
            <p className="text-gray-700">{spot.description}</p>
          </div>

          <Separator className="my-6" />

          {/* Add-ons */}
          <div className="mb-6">
            <h3 className="text-[#0A2540] mb-4">Available Add-ons</h3>
            <div className="space-y-3">
              {addons.map((addon) => {
                const Icon = addon.icon;
                return (
                  <Card
                    key={addon.id}
                    className={`cursor-pointer transition-all ${
                      selectedAddons.includes(addon.id)
                        ? 'border-[#06B6D4] border-2 bg-[#06B6D4]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedAddons.includes(addon.id)}
                          onCheckedChange={() => toggleAddon(addon.id)}
                        />
                        <div className="bg-[#06B6D4]/10 rounded-lg p-2">
                          <Icon className="w-5 h-5 text-[#06B6D4]" />
                        </div>
                        <div className="flex-1">
                          <Label className="cursor-pointer">{addon.name}</Label>
                        </div>
                        <span className="text-[#0A2540]">+${addon.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Nearby Recommendations */}
          <div className="mb-6">
            <h3 className="text-[#0A2540] mb-4">Nearby Food & Drinks</h3>
            <div className="space-y-2">
              {nearbyRecommendations.map((place, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="bg-white rounded-full p-2">
                    {place.type === 'Food' && <Coffee className="w-4 h-4 text-[#06B6D4]" />}
                    {place.type === 'Drinks' && <Beer className="w-4 h-4 text-[#06B6D4]" />}
                    {place.type === 'Coffee' && <Coffee className="w-4 h-4 text-[#06B6D4]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0A2540]">{place.name}</p>
                    <p className="text-sm text-gray-600">{place.type} • {place.distance}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{place.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Total</p>
            <div className="text-2xl text-[#0A2540]">${calculateTotal()}</div>
          </div>
          <Button
            onClick={() => onNavigate('booking', { spot, addons: selectedAddons, total: calculateTotal() })}
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-8 py-6"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Reserve Spot
          </Button>
        </div>
      </div>
    </div>
  );
}
