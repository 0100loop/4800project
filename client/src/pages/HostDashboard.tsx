import { useEffect, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  Clock,
  MapPin,
  Edit,
  Eye,
  Users,
  Home,
  Zap,
  Utensils,
  Moon,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

import {
  fetchMySpots,
  fetchHostBookings,
  addNewSpot,
} from "../lib/hostApi";

interface HostDashboardProps {
  onNavigate: (view: string) => void;
}

export function HostDashboard({ onNavigate }: HostDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showAddSpot, setShowAddSpot] = useState(false);

  const [form, setForm] = useState({
    address: "",
    description: "",
    price: "",
    spots: 1,
    tailgate: false,
    overnight: false,
    ev: false,
    bathroom: false,
    shuttle: false,
  });

  // ----------------------------
  // LOAD HOST DATA (SPOTS + BOOKINGS)
  // ----------------------------
  useEffect(() => {
    async function load() {
      try {
        const [mySpots, hostBookings] = await Promise.all([
          fetchMySpots(),
          fetchHostBookings(),
        ]);

        setSpots(mySpots);
        setBookings(hostBookings);
      } catch (err) {
        console.error("HostDashboard error:", err);
      }
      setLoading(false);
    }

    load();
  }, []);

  // ----------------------------
  // SHOW LOADING
  // ----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  // ----------------------------
  // ADD SPOT MODE
  // ----------------------------
  if (showAddSpot) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        
        {/* HEADER */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddSpot(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <p className="text-[#0A2540] font-medium">Add New Spot</p>
              <p className="text-xs text-gray-600">Create a new listing</p>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          
          {/* Location */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-[#0A2540]">Location</h3>

            <div className="mt-4 space-y-3">
              <div>
                <Label>Address</Label>
                <Input
                  placeholder="1234 Main Street"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  placeholder="Describe your parking spot…"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-[#0A2540]">Pricing</h3>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Price Per Event ($)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Available Spots</Label>
                <Input
                  type="number"
                  value={form.spots}
                  onChange={(e) =>
                    setForm({ ...form, spots: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-[#0A2540]">Amenities</h3>

            {[
              { key: "tailgate", label: "Tailgate Friendly", icon: Utensils },
              { key: "overnight", label: "Overnight Allowed", icon: Moon },
              { key: "ev", label: "EV Charging", icon: Zap },
              { key: "bathroom", label: "Bathroom Access", icon: Home },
              { key: "shuttle", label: "Shuttle Service", icon: Users },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#06B6D4]/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#06B6D4]" />
                    </div>
                    <p className="text-[#0A2540]">{item.label}</p>
                  </div>

                  <Switch
                    checked={(form as any)[item.key]}
                    onCheckedChange={() =>
                      setForm({
                        ...form,
                        [item.key]: !(form as any)[item.key],
                      })
                    }
                  />
                </div>
              );
            })}
          </Card>

          {/* Submit */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <Button
              className="w-full bg-[#06B6D4] hover:bg-[#0891b2]"
              onClick={async () => {
                try {
                  await addNewSpot(form);
                  alert("Spot added successfully!");
                  setShowAddSpot(false);
                } catch (err: any) {
                  alert(err.message);
                }
              }}
            >
              Add Spot
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------
  // CALCULATE EARNINGS
  // ----------------------------
  const totalEarnings = bookings.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("home")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-[#0A2540] font-medium">Host Dashboard</p>
              <p className="text-xs text-gray-600">Manage your listings</p>
            </div>
          </div>

          <TrendingUp className="w-6 h-6 text-[#06B6D4]" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <Card className="p-4">
            <p className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" /> Earnings
            </p>
            <p className="text-2xl font-semibold text-[#0A2540]">
              ${totalEarnings}
            </p>
          </Card>

          <Card className="p-4">
            <p className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" /> Bookings
            </p>
            <p className="text-2xl font-semibold text-[#0A2540]">
              {bookings.length}
            </p>
          </Card>

          <Card className="p-4">
            <p className="flex items-center gap-2 text-gray-600">
              <Star className="w-4 h-4" /> Rating
            </p>
            <p className="text-2xl font-semibold text-[#0A2540]">4.8</p>
          </Card>

          <Card className="p-4">
            <p className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" /> Response Rate
            </p>
            <p className="text-2xl font-semibold text-[#0A2540]">98%</p>
          </Card>
        </div>

        {/* ADD-SPOT CTA */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Add Another Spot</h3>
              <p className="text-sm mb-4 opacity-90">
                Hosts with 2+ listings earn up to 40% more.
              </p>
              <Button
                className="bg-white text-[#06B6D4] hover:bg-gray-100"
                onClick={() => setShowAddSpot(true)}
              >
                + Add New Spot
              </Button>
            </div>

            <TrendingUp className="w-16 h-16 opacity-50 hidden md:block" />
          </div>
        </Card>

        {/* TABS */}
        <Tabs defaultValue="spots" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spots">My Spots</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* SPOTS LIST */}
          <TabsContent value="spots" className="space-y-4">
            {spots.map((spot, i) => (
              <Card key={i} className="p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">

                  <div className="flex-1">
                    <p className="text-lg text-[#0A2540] font-semibold">
                      {spot.address}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 text-[#06B6D4]" />
                      {spot.city || "Unknown City"}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {spot.rating || 4.8}
                      <span>•</span>
                      {spot.spots || 1} spots
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl text-[#0A2540]">${spot.price}</p>
                  </div>

                </div>

                <Separator className="my-3" />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>

                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* BOOKINGS */}
          <TabsContent value="bookings" className="space-y-4">
            {bookings.map((b, i) => (
              <Card key={i} className="p-4 hover:shadow-sm transition">

                <div className="flex justify-between items-start mb-2">
                  <p className="text-lg text-[#0A2540] font-semibold">
                    {b.userId?.name || "Guest"}
                  </p>

                  <p className="text-xl text-green-700 font-semibold">
                    +${b.totalPrice}
                  </p>
                </div>

                <Separator className="my-3" />

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#06B6D4]" />
                    {new Date(b.start).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#06B6D4]" />
                    {b.listingId?.address}
                  </div>

                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#06B6D4]" />
                    {b.vehicle || "Unknown vehicle"}
                  </div>
                </div>

              </Card>
            ))}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
