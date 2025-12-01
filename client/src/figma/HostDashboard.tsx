// src/figma/HostDashboard.tsx

import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Calendar, DollarSign, TrendingUp, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { apiFetch } from "../lib/api";
import { Badge } from "../ui/badge";

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
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="bg-[#0A2540] text-white px-6 py-10 pb-16">
        <div className="flex items-center justify-between mb-6">
          <ArrowLeft className="cursor-pointer" onClick={() => onNavigate("home")} />
          <h2 className="text-xl font-semibold flex-1 text-center">Host Dashboard</h2>
          <Settings className="cursor-pointer" />
        </div>

        <p className="text-center text-cyan-100 mb-8">Manage your parking spots</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-[#D6F4E4] px-6 py-6 text-center rounded-xl shadow-sm">
            <DollarSign className="mx-auto mb-2 w-6 h-6 text-[#0A2540]" />
            <p className="text-3xl font-bold text-[#0A2540]">${totalEarnings}</p>
            <p className="text-sm text-[#0A2540]">Total Earnings</p>
          </Card>

          <Card className="bg-[#DCEBFF] px-6 py-6 text-center rounded-xl shadow-sm">
            <TrendingUp className="mx-auto mb-2 w-6 h-6 text-[#0A2540]" />
            <p className="text-3xl font-bold text-[#0A2540]">{totalBookings}</p>
            <p className="text-sm text-[#0A2540]">Total Bookings</p>
          </Card>

          <Card className="bg-[#FFE6F2] px-6 py-6 text-center rounded-xl shadow-sm">
            <TrendingUp className="mx-auto mb-2 w-6 h-6 text-[#0A2540]" />
            <p className="text-3xl font-bold text-[#0A2540]">{avgRating}</p>
            <p className="text-sm text-[#0A2540]">Avg Rating</p>
          </Card>
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


