// src/figma/HostDashboard.tsx
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { apiFetch } from "../lib/api";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { ChevronLeft,ArrowLeft, MapPin, Calendar, DollarSign, TrendingUp, Settings, Users} from "lucide-react";


interface HostDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

interface Spot {
  _id: string;
  address: string;
  price: number;
  totalBookings: number;
  earnings: number;
  nextEvent?: string;
  isActive: boolean;
}

interface Booking {
  _id: string;
  userName: string;
  eventName: string;
  eventDate: string;
  price: number;
}

export function HostDashboard({ onNavigate }: HostDashboardProps) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const mySpots = await apiFetch("/api/spots/mine", { auth: true });
        setSpots(Array.isArray(mySpots) ? mySpots : []);

        const hostBookings = await apiFetch("/api/bookings/host", { auth: true });
        setBookings(Array.isArray(hostBookings) ? hostBookings : []);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const totalEarnings = spots.reduce((s, x) => s + (x.earnings || 0), 0);
  const totalBookings = spots.reduce((s, x) => s + (x.totalBookings || 0), 0);
  const avgRating = 4.9;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* Header */}
          <div className="w-full bg-[#0A2540] p-4">
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
              <h2 className="text-white text-3xl">Host Dashboard</h2>
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
          </div>
          </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-white px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 ">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-3xl text-green-700">$705</div>
              <p className="text-xs text-green-600 mt-1">Total Earnings</p>
            </CardContent>
      
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl text-blue-700">41</div>
                <p className="text-xs text-blue-600 mt-1">Total Bookings</p>
              </CardContent>
            </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl text-purple-700">4.9</div>
              <p className="text-xs text-purple-600 mt-1">Avg Rating</p>
            </CardContent>
          </Card>

          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-6 py-10 max-w-4xl mx-auto">

        {/* My Spots */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#0A2540]">My Spots</h3>
          <Button
            className="bg-[#06B6D4] text-white hover:bg-[#0891B2]"
            onClick={() => onNavigate("createListing")}
          >
            + Add Spot
          </Button>
        </div>

        <div className="space-y-5 mb-10">
          {spots.map((spot) => (
            <Card
              key={spot._id}
              className="p-5 border rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
              onClick={() => onNavigate("spotManagement", { spotId: spot._id })}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-[#06B6D4] w-5 h-5" />
                    <h4 className="text-lg font-semibold text-[#0A2540]">{spot.address}</h4>
                  </div>

                  <p className="text-gray-600 text-sm mb-1">${spot.price} per event</p>
                  <p className="text-gray-600 text-sm">Total Bookings: {spot.totalBookings}</p>
                  <p className="text-gray-600 text-sm">Earnings: ${spot.earnings}</p>

                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-medium">Next:</span> {spot.nextEvent || "—"}
                  </p>
                </div>

                {spot.isActive && (
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Upcoming Bookings */}
        <h3 className="text-xl font-semibold text-[#0A2540] mb-4">Upcoming Bookings</h3>

        <div className="space-y-4">
          {bookings.length === 0 && (
            <p className="text-gray-500 text-sm">No upcoming bookings</p>
          )}

          {bookings.map((b) => (
            <Card key={b._id} className="p-5 border rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#0A2540] font-medium">{b.userName}</p>
                  <p className="text-gray-600 text-sm">{b.eventName}</p>
                </div>

                <div className="text-right">
                  <p className="text-[#0A2540] font-medium">${b.price}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(b.eventDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}


