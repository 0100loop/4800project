/*
To Do: 
Make spots belong to hosts 
Dashboard stats - avg rating - total bookings - total earnings
Upcoming bookings - need to be able to make a booking
Need to be able to view and edit spots
Avoid duplicate spots
verify addresses
map view for bookings/listings
*/

import { Plus, Calendar, DollarSign, MapPin, Settings, TrendingUp, Users, ChevronLeft, Zap, Home as HomeIcon, Truck } from 'lucide-react';
import { Button } from './ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { Switch } from './ui/switch.js';
import { Label } from './ui/label.js';
import { Input } from './ui/input.js';
import { Textarea } from './ui/textarea.js';
import { Separator } from './ui/separator.js';
import { useState, useEffect } from 'react';
import { geocodeAddress } from '../lib/geocode.ts';
// @ts-ignore
import { apiFetch } from '../lib/api.js';

const Toggle = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (v: boolean) => void }) => {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${enabled ? "bg-[#06B6D4]" : "bg-gray-300"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
};

interface HostDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

interface ImportMeta {
  env: {
    VITE_API_BASE_URL: string;
    [key: string]: any;
  };
}

export function HostDashboard({ onNavigate }: HostDashboardProps) {
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  /*
  const [tailgateFriendly, setTailgateFriendly] = useState(false);
  const [overnightParking, setOvernightParking] = useState(false);
  const [bathroomAccess, setBathroomAccess] = useState(false);
  const [evCharging, setEvCharging] = useState(false);
  const [shuttleService, setShuttleService] = useState(false);
  */

  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [spaces, setSpaces] = useState("");

  const [mySpots, setMySpots] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadMySpots() {
      try {
        // Fetch all spots and let the UI decide what to show as "my spots".
        // If you want only the current user's spots, we can filter by host id
        // once the user's id is available (from login token / profile endpoint).
        const spots = await apiFetch('/api/spots/mine', {auth: true});
        if (!mounted) return;
        // normalize spots to expected shape where possible
        const normalized = (spots || []).map((s: any) => ({
          id: s._id || s.id,
          address: s.address || s.title || s.location?.address || '',
          price: s.price ?? s.pricePerHour ?? s.pricePerEvent ?? 0,
          totalBookings: s.totalBookings || 0,
          earnings: s.earnings || 0,
          nextEvent: s.nextEvent || null,
          isActive: s.isActive ?? true,
          raw: s,
        }));
        setMySpots(normalized);
      } catch (e) {
        // non-fatal — keep examples in place if desired
        console.error('Failed to load spots', e);
      }
    }

    loadMySpots();
    return () => { mounted = false; };
  }, []);

  const upcomingBookings = [
    { id: 1, guest: 'Sarah J.', event: 'Lakers vs Warriors', date: 'Oct 15', amount: 15 },
    { id: 2, guest: 'Mike R.', event: 'Lakers vs Warriors', date: 'Oct 15', amount: 23 },
    { id: 3, guest: 'Emma L.', event: 'Taylor Swift', date: 'Oct 22', amount: 20 }
  ];

  if (isAddingSpot) {
    const resetForm = () => {
      setAddress("");
      setDescription("");
      setPrice("");
      setSpaces("");
      /*
      setTailgateFriendly(false);
      setOvernightParking(false);
      setBathroomAccess(false);
      setEvCharging(false);
      setShuttleService(false);
      */
    };

   const handleSubmit = async () => {
  try {
    // 1️⃣ Get coordinates from client-side geocoding
    const { lat, lon } = await geocodeAddress(address);

    // 2️⃣ Prepare spot data with coordinates
    const spotData = {
      title: description,
      pricePerEvent: price,
      address,
      location: {
        type: "Point",
        coordinates: [lon, lat], // GeoJSON uses [lng, lat]
      },
      spaces,
      /*
      bathroom: bathroomAccess,
      evCharging,
      shuttle: shuttleService,
      tailgateFriendly,
      overnightAllowed: overnightParking,
      */
    };

    // 3️⃣ Send to backend
    const apiBase = (import.meta as unknown as ImportMeta).env?.VITE_API_BASE_URL ?? "";
    const url = apiBase ? apiBase.replace(/\/$/, "") + '/api/spots' : '/api/spots';
    const data = await apiFetch(url, { method: 'POST', body: spotData, auth:true });

    console.log('✅ Spot created:', data);
    setMySpots((prev) => [{
      id: data._id || data.id,
      address: data.address || data.title || '',
      price: data.price ?? data.pricePerEvent ?? 0,
      totalBookings: data.totalBookings || 0,
      earnings: data.earnings || 0,
      nextEvent: data.nextEvent || null,
      isActive: data.isActive ?? true,
      raw: data,
    }, ...prev]);

    alert('Spot submitted for review!');
    resetForm();
    setIsAddingSpot(false);

  } catch (err: unknown) {
    if (err instanceof Error) {
        console.error("❌ Error:", err);
        alert(err.message);
    } else {
        console.error("❌ Unknown error:", err);
        alert("Failed to submit spot.");
    }
}

};



    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { resetForm(); setIsAddingSpot(false); }}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white flex-1">List Your Spot</h2>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#0A2540]">Spot Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                <Input id="address"
                  placeholder="123 Main Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-gray-900 placeholder-gray-500 bg-white" />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your parking spot, access instructions, and any special features..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price per Event</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                    <Input id="price"
                      type="number"
                      placeholder="15"
                      value={price}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow up to 2 decimal places
                        if (/^\d*\.?\d{0,2}$/.test(value)) setPrice(value);
                      }}
                      className="pl-7 text-gray-900 placeholder-gray-500 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="spaces" className="text-sm font-medium text-gray-700">Number of Spaces</Label>
                  <Input
                    id="spaces"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="1"
                    value={spaces}
                    onChange={(e) => {
                      const value = e.target.value ?? ""; // fallback to empty string
                      if (/^\d*$/.test(value)) setSpaces(value);
                    }}
                    className="text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#06B6D4]/5 border-[#06B6D4]/30">
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Your listing will be reviewed before going live. This typically takes 24-48 hours.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleSubmit}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-6"
            >
              Submit for Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('home')}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-white">Host Dashboard</h2>
              <p className="text-cyan-100 text-sm">Manage your parking spots</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-3 text-center">
                <DollarSign className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
                <div className="text-2xl text-white">$705</div>
                <p className="text-xs text-cyan-100">Total Earnings</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-3 text-center">
                <Users className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
                <div className="text-2xl text-white">41</div>
                <p className="text-xs text-cyan-100">Total Bookings</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-3 text-center">
                <TrendingUp className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
                <div className="text-2xl text-white">4.9</div>
                <p className="text-xs text-cyan-100">Avg Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* My Spots */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0A2540]">My Spots</h3>
            <Button
              onClick={() => setIsAddingSpot(true)}
              className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Spot
            </Button>
          </div>

          <div className="space-y-3">
            {mySpots.map((spot) => (
              <Card 
                key={spot.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
  onNavigate('spotManagement', spot);
}}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-[#0A2540] to-[#134E6F] rounded-lg p-3 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#06B6D4]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-[#0A2540]">{spot.address}</h4>
                          <p className="text-sm text-gray-600">${spot.price} per event</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <p className="text-gray-600">Total Bookings</p>
                          <p className="text-[#0A2540]">{spot.totalBookings}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Earnings</p>
                          <p className="text-[#0A2540]">${spot.earnings}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>Next: {spot.nextEvent}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <h3 className="text-[#0A2540] mb-4">Upcoming Bookings</h3>
          <Card>
            <CardContent className="p-0">
              {upcomingBookings.map((booking, index) => (
                <div key={booking.id}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#06B6D4]/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#06B6D4]" />
                      </div>
                      <div>
                        <p className="text-[#0A2540]">{booking.guest}</p>
                        <p className="text-sm text-gray-600">{booking.event}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#0A2540]">${booking.amount}</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                    </div>
                  </div>
                  {index < upcomingBookings.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
