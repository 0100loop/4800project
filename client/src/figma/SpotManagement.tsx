import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Calendar, MapPin, Users, DollarSign, Clock, Trash2 } from 'lucide-react';

import { Button } from './ui/button.tsx';
import { Card, CardContent } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';
import { Separator } from './ui/separator.tsx';
import  {apiFetch}  from '../lib/api.js';

interface SpotManagementProps {
  onNavigate: (view: string, params?: any) => void;
  spotData?: any;
}

export function SpotManagement({ onNavigate, spotData }: SpotManagementProps) {
  console.log('SpotManagement received:', { spotData, apiFetch });
  console.log('spot.id:', spotData?.id);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

 // --- spot data (fallback for demo) ---
  const spot = spotData || {
    id: 1,
    address: "1234 Oak Street, Los Angeles, CA 90015",
    price: 15,
    spaces: 2,
    totalBookings: 12,
    totalEarnings: 245,
  };

   // --- Load listings and bookings from database ---
useEffect(() => {
    // Don't load if spot.id is not available
    if (!spot.id) {
      console.log('No spot.id available');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      // Load listings for this spot
      try {
        const listingsData = await apiFetch(`/api/listings?spotId=${spot.id}`, {
          method: "GET",
          auth: true,
        });
        console.log('Listings loaded:', listingsData);
        setListings(listingsData || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        setListings([]);
      }

      // Load bookings for this spot (upcoming only)
      try {
        const bookingsData = await apiFetch(`/api/bookings?spotId=${spot.id}&upcoming=true`, {
          method: "GET",
          auth: true,
        });
        console.log('Bookings loaded:', bookingsData);
        setBookings(bookingsData || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setBookings([]);
      }

      // Always set loading to false after both calls complete
      setLoading(false);
    };

    loadData();
  }, [spot.id]);
  

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatTime = (time?: string) => {
    if (!time || !time.includes(":")) return "Invalid";
    const [h, m] = time.split(":");
    const hour = Number(h);
    const ap = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ap}`;
  };

  const handleDeleteListing = (id: number) => {
    if (confirm("Delete this listing?")) {
      setListings(listings.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("host")}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h2 className="text-white">Manage Spot</h2>
            <p className="text-cyan-100 text-sm flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              {spotData.address}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
              <div className="text-xl text-white">${spotData.totalEarnings}</div>
              <p className="text-xs text-cyan-100">Earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-3 text-center">
              <Users className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
              <div className="text-xl text-white">{spotData.totalBookings}</div>
              <p className="text-xs text-cyan-100">Bookings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-3 text-center">
              <Calendar className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
              <div className="text-xl text-white">{listings.length}</div>
              <p className="text-xs text-cyan-100">Listings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "listings" ? "default" : "outline"}
            onClick={() => setActiveTab("listings")}
            className={activeTab === "listings" ? "bg-[#06B6D4] hover:bg-[#0891B2]" : ""}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Listings ({listings.length})
          </Button>

          <Button
            variant={activeTab === "bookings" ? "default" : "outline"}
            onClick={() => setActiveTab("bookings")}
            className={activeTab === "bookings" ? "bg-[#06B6D4] hover:bg-[#0891B2]" : ""}
          >
            <Users className="w-4 h-4 mr-2" />
            Bookings ({bookings.length})
          </Button>
        </div>

        {/* Listings */}
        {activeTab === "listings" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0A2540]">Available Time Slots</h3>

              <Button
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
               onClick={() => onNavigate("createListing", { spotId: spot.id, spotData: spotData })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </div>

            <div className="space-y-3">
              {listings.map((l) => (
                <Card key={l.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-[#0A2540] to-[#134E6F] p-3 rounded-lg">
                        <Calendar className="w-6 h-6 text-[#06B6D4]" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[#0A2540]">{l.eventName}</h4>
                            <p className="text-sm text-gray-600">{formatDate(l.date)}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-0">
                            {l.status === "full" ? "Full" : "Available"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="text-[#0A2540]">
                              {formatTime(l.startTime)} – {formatTime(l.endTime)}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="text-[#0A2540]">${l.price}/space</p>
                          </div>

                          <div>
                            <p className="text-gray-600">Booked</p>
                            <p className="text-[#0A2540]">
                              {l.bookedSpaces}/{l.availableSpaces}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-600">Earnings</p>
                            <p className="text-[#0A2540]">
                              ${(l.bookedSpaces * l.price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteListing(l.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div>
            <h3 className="text-[#0A2540] mb-4">Guest Bookings</h3>

            {bookings.map((b) => (
              <Card key={b.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="bg-[#06B6D4]/10 p-3 rounded-full">
                      <Users className="w-6 h-6 text-[#06B6D4]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-[#0A2540]">{b.guestName}</h4>
                          <p className="text-sm text-gray-600">{b.eventName}</p>
                          <p className="text-sm text-gray-500">{formatDate(b.date)}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg text-[#0A2540]">${b.totalPaid}</p>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="text-sm">
                        <p className="text-gray-600">Arrival Time</p>
                        <p className="text-[#0A2540] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(b.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
