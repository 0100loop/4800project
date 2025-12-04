import { useState, useEffect } from 'react';
import { ChevronLeft, Users, Clock, DollarSign, MapPin } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card, CardContent } from './ui/card.tsx';
import { Separator } from './ui/separator.tsx';
import { apiFetch } from '../lib/api.js';

interface SpotManagementProps {
  onNavigate: (view: string, params?: any) => void;
  spotData?: any;
}

export function SpotManagement({ onNavigate, spotData }: SpotManagementProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const spot = spotData || {
    id: 1,
    address: "1234 Oak Street, Los Angeles, CA 90015",
    totalBookings: 12,
    totalEarnings: 245,
  };

  useEffect(() => {
  if (!spot.id) return;

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/bookings?spotId=${spot.id}&upcoming=true`, {
        method: "GET",
        auth: true,
      });

      // Filter bookings for this specific spot
      const spotBookings = data.filter((b: any) => b.spotId?._id === spot.id || b.spotId === spot.id);


      setBookings(spotBookings); // <-- use filtered bookings
      console.log("Bookings loaded:", spotBookings);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  loadBookings();
}, [spot.id]);


  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const formatTime = (time?: string) => {
    if (!time) return "N/A";
    const [h, m] = time.split(":");
    const hour = Number(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("host")} className="text-white hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-white">Manage Spot</h2>
            <p className="text-cyan-100 text-sm flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              {spot.address}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
              <div className="text-xl text-white">${spot.totalEarnings}</div>
              <p className="text-xs text-cyan-100">Earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-3 text-center">
              <Users className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
              <div className="text-xl text-white">{bookings.length}</div>
              <p className="text-xs text-cyan-100">Bookings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h3 className="text-[#0A2540] mb-4">Guest Bookings</h3>

        {loading && <p className="text-gray-600 text-sm">Loading bookings...</p>}
        {!loading && bookings.length === 0 && <p className="text-gray-600 text-sm">No upcoming bookings.</p>}

        {bookings.map((b) => (
          <Card key={b._id} className="hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-4 text-gray-900">
              <div className="flex gap-4">
                <div className="bg-[#06B6D4]/10 p-3 rounded-full">
                  <Users className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold text-[#0A2540]">{b.email || "Guest"}</h4>
                      <p className="text-sm text-gray-600">Parking Reservation</p>
                      <p className="text-sm text-gray-500">{formatDate(b.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl text-[#0A2540] font-bold">${b.totalPrice}</p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="text-sm">
                    <p className="text-gray-600">Arrival Time</p>
                    <p className="text-gray-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {b.startTime ? formatTime(b.startTime) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
