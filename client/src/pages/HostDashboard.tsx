// client/src/pages/HostDashboard.tsx

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../ui/tabs";

// ⭐ Correct table import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// ⭐ TYPE-ONLY IMPORTS (fixes HostBooking error)
import type { HostSpot, HostBooking } from "../lib/hostApi";

// ⭐ Runtime imports
import {
  fetchHostSpots,
  fetchHostBookings,
  createHostSpot,
} from "../lib/hostApi";

interface HostDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export default function HostDashboard({ onNavigate }: HostDashboardProps) {
  const [spots, setSpots] = useState<HostSpot[]>([]);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNewSpotForm, setShowNewSpotForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPrice, setNewPrice] = useState("20");
  const [newMaxVehicles, setNewMaxVehicles] = useState("2");

  // ⭐ ROLE GUARD
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return onNavigate("login");

    try {
      const user = JSON.parse(raw);
      if (user.role !== "host") {
        alert("Only hosts can access the Host Dashboard.");
        return onNavigate("home");
      }
    } catch {
      onNavigate("home");
    }
  }, [onNavigate]);

  // ⭐ LOAD HOST DATA
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [spotsData, bookingsData] = await Promise.all([
          fetchHostSpots(),
          fetchHostBookings(),
        ]);
        setSpots(spotsData);
        setBookings(bookingsData);
      } catch (err: any) {
        setError(err.message || "Failed to load host dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ⭐ METRICS
  const totalEarnings = useMemo(
    () => bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0),
    [bookings]
  );

  const upcomingBookings = bookings.filter((b) => {
    const start = new Date(b.start);
    return start >= new Date();
  });

  const activeListings = spots.filter((s) => s.isActive !== false).length;

  // ⭐ CREATE NEW SPOT
  async function handleCreateSpot(e: React.FormEvent) {
    e.preventDefault();

    try {
      const created = await createHostSpot({
        title: newTitle || "Untitled Spot",
        address: newAddress,
        city: newCity || "Unknown",
        pricePerHour: Number(newPrice),
        maxVehicles: Number(newMaxVehicles),
      });

      setSpots((prev) => [created, ...prev]);
      setShowNewSpotForm(false);

      setNewTitle("");
      setNewAddress("");
      setNewCity("");
      setNewPrice("20");
      setNewMaxVehicles("2");
    } catch (err: any) {
      alert(err.message);
    }
  }

  // ⭐ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading host dashboard…</p>
      </div>
    );
  }

  // ⭐ ERROR
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // ⭐ FINAL RENDER
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#06B6D4] rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#0A2540]">Host Dashboard</h1>
              <p className="text-xs text-gray-500">
                Manage spots, bookings, and earnings.
              </p>
            </div>
          </div>

          <Button onClick={() => onNavigate("home")}>Back to Home</Button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Upcoming Bookings</p>
            <p className="text-2xl font-bold">{upcomingBookings.length}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Active Listings</p>
            <p className="text-2xl font-bold">{activeListings}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Guests Served</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </Card>
        </section>

        {/* TABS */}
        <Tabs defaultValue="listings" className="w-full">

          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <Button onClick={() => setShowNewSpotForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Spot
            </Button>
          </div>

          {/* LISTINGS */}
          <TabsContent value="listings">
            <Card className="p-4 space-y-6">

              {showNewSpotForm && (
                <form
                  onSubmit={handleCreateSpot}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-1">
                    <Label>Title</Label>
                    <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <Label>City</Label>
                    <Input value={newCity} onChange={(e) => setNewCity(e.target.value)} />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Price / hr</Label>
                    <Input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Max Vehicles</Label>
                    <Input
                      type="number"
                      value={newMaxVehicles}
                      onChange={(e) => setNewMaxVehicles(e.target.value)}
                    />
                  </div>

                  <Button className="md:col-span-2" type="submit">
                    Save Spot
                  </Button>
                </form>
              )}

              {spots.length === 0 ? (
                <p className="text-gray-500">No spots yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Price / hr</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {spots.map((spot) => (
                      <TableRow key={spot._id}>
                        <TableCell>{spot.title || "Untitled"}</TableCell>
                        <TableCell>
                          {spot.address}
                          {spot.city ? `, ${spot.city}` : ""}
                        </TableCell>
                        <TableCell>${spot.pricePerHour}</TableCell>
                        <TableCell>
                          <Badge>
                            {spot.isActive !== false ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* BOOKINGS */}
          <TabsContent value="bookings">
            <Card className="p-4">
              {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Spot</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b._id}>
                        <TableCell>
                          {b.userId?.name || "Guest"}
                          <div className="text-xs text-gray-500">
                            {b.userId?.email}
                          </div>
                        </TableCell>

                        <TableCell>
                          {b.listingId?.title || "Spot"}
                          <div className="text-xs text-gray-500">
                            {b.listingId?.address}
                          </div>
                        </TableCell>

                        <TableCell>{new Date(b.start).toLocaleString()}</TableCell>
                        <TableCell>{new Date(b.end).toLocaleString()}</TableCell>

                        <TableCell>
                          <Badge>{b.status}</Badge>
                        </TableCell>

                        <TableCell>${b.totalPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics">
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#06B6D4]" />
                <h2 className="text-lg font-semibold text-[#0A2540]">Analytics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <p className="text-xs text-gray-500">Earnings (Total)</p>
                  <p className="text-xl font-semibold text-[#0A2540]">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </Card>

                <Card className="p-4">
                  <p className="text-xs text-gray-500">Bookings (Total)</p>
                  <p className="text-xl font-semibold text-[#0A2540]">
                    {bookings.length}
                  </p>
                </Card>

                <Card className="p-4">
                  <p className="text-xs text-gray-500">Active Listings</p>
                  <p className="text-xl font-semibold text-[#0A2540]">
                    {activeListings}
                  </p>
                </Card>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>
                  More advanced analytics will be added after deployment.
                </span>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

