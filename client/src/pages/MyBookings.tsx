import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Car,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

import { fetchUserBookings, fetchHostBookings } from "../lib/myBookingsApi";

interface MyBookingsProps {
  onNavigate: (view: string) => void;
  userType: "guest" | "host";
}

export function MyBookings({ onNavigate, userType }: MyBookingsProps) {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);

  // -------------------------
  // LOAD BOOKINGS FROM BACKEND
  // -------------------------
  useEffect(() => {
    async function load() {
      try {
        const data =
          userType === "host"
            ? await fetchHostBookings()
            : await fetchUserBookings();

        const now = new Date();

        const act = data.filter((b: any) => new Date(b.end) >= now);
        const pst = data.filter((b: any) => new Date(b.end) < now);

        setActive(act);
        setPast(pst);
      } catch (err) {
        console.error("MyBookings error:", err);
      }
      setLoading(false);
    }

    load();
  }, [userType]);

  const getStatusBadge = (booking: any) => {
    if (booking.status === "paid") {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-4 h-4 mr-1" /> Confirmed
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-700">
        <AlertCircle className="w-4 h-4 mr-1" /> Completed
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="text-[#0A2540]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <p className="text-[#0A2540] font-medium">
              {userType === "guest" ? "My Bookings" : "Reservations"}
            </p>
            <p className="text-xs text-gray-600">
              {userType === "guest"
                ? "Your reserved spots"
                : "Guests booked your listings"}
            </p>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          {/* ACTIVE BOOKINGS */}
          <TabsContent value="active" className="space-y-4">
            {active.length === 0 ? (
              <Card className="p-10 text-center shadow-sm">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-medium text-[#0A2540]">
                  No Active Bookings
                </p>
                <p className="text-gray-600 mb-5">
                  {userType === "guest"
                    ? "Book a spot to see it here."
                    : "Your upcoming guest reservations will appear here."}
                </p>
                <Button
                  className="bg-[#06B6D4] hover:bg-[#0891b2] text-white"
                  onClick={() =>
                    onNavigate(userType === "guest" ? "map" : "host")
                  }
                >
                  {userType === "guest" ? "Find Parking" : "Manage Spots"}
                </Button>
              </Card>
            ) : (
              active.map((b, i) => (
                <Card key={i} className="p-4 hover:shadow-md transition">
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-lg text-[#0A2540] font-semibold">
                        {b.listingId?.address || "Parking Spot"}
                      </p>
                      {getStatusBadge(b)}
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-semibold text-[#0A2540]">
                        ${b.totalPrice}
                      </p>
                      <p className="text-xs text-gray-600">
                        {userType === "guest" ? "Paid" : "Earned"}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#06B6D4]" />
                      <span>
                        {new Date(b.start).toLocaleDateString()} •{" "}
                        {new Date(b.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {"  -  "}
                        {new Date(b.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#06B6D4]" />
                      <span>{b.listingId?.city || "Unknown city"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#06B6D4]" />
                      <span>{b.vehicle || "Vehicle info missing"}</span>
                    </div>
                  </div>

                </Card>
              ))
            )}
          </TabsContent>

          {/* PAST BOOKINGS */}
          <TabsContent value="past" className="space-y-4">
            {past.length === 0 ? (
              <Card className="p-10 text-center shadow-sm">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg text-[#0A2540] font-medium">
                  No Past Bookings
                </p>
                <p className="text-gray-600">
                  Completed bookings will appear here.
                </p>
              </Card>
            ) : (
              past.map((b, i) => (
                <Card key={i} className="p-4 hover:shadow-md transition">
                  
                  <p className="text-lg text-[#0A2540] font-semibold mb-2">
                    {b.listingId?.address || "Parking Spot"}
                  </p>

                  <Separator className="my-3" />

                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#06B6D4]" />
                      <span>{new Date(b.start).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#06B6D4]" />
                      <span>{b.listingId?.city || "Unknown City"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#06B6D4]" />
                      <span>{b.vehicle || "Vehicle info missing"}</span>
                    </div>
                  </div>

                </Card>
              ))
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
