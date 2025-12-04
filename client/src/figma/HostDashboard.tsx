import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { apiFetch } from "../lib/api";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Trash2,
  Settings,
} from "lucide-react";

export function HostDashboard({ onNavigate }) {
  const [spots, setSpots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverId, setHoverId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const allSpots = await apiFetch("/api/spots/mine");
        setSpots(allSpots || []);

        const allBookings = await apiFetch("/api/bookings");
        setBookings(allBookings || []);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreateSpot() {
    try {
      const newSpot = await apiFetch("/api/spots", { method: "POST" });

      if (!newSpot?.id) {
        alert("Could not create spot.");
        return;
      }

      onNavigate("createListing", { spotId: newSpot.id });
    } catch (err) {
      console.error("Create spot failed:", err);
      alert("Error creating spot.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this spot?")) return;

    try {
      await apiFetch(`/api/spots/${id}`, { method: "DELETE" });
      setSpots(spots.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* HEADER */}
      <div className="bg-[#0A2540] p-4 text-white">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ChevronLeft />
          </Button>

          <div className="flex-1">
            <h2 className="text-3xl">Host Dashboard</h2>
            <p className="text-cyan-100 text-sm">Manage your parking spots</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-full"
          >
            <Settings />
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-4xl mx-auto p-4 grid grid-cols-3 gap-3 text-center">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-700">
              ${spots.reduce((sum, s) => sum + (s.price || 0), 0)}
            </div>
            <p className="text-green-600 text-xs mt-1">Total Value Listed</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-blue-700">{spots.length}</div>
            <p className="text-blue-600 text-xs mt-1">Total Spots</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-purple-700">4.9</div>
            <p className="text-purple-600 text-xs mt-1">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* BODY */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-[#0A2540]">My Spots</h3>
          <Button
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
            onClick={handleCreateSpot}
          >
            + Add Spot
          </Button>
        </div>

        <div className="space-y-5">
          {spots.map((spot) => (
            <Card
              key={spot._id}
              className="p-5 border rounded-xl shadow-sm hover:shadow-md transition relative cursor-pointer"
              onMouseEnter={() => setHoverId(spot._id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => onNavigate("spotManagement", { spotId: spot._id })}
            >
              {/* DELETE BUTTON */}
              {hoverId === spot._id && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-3 top-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(spot._id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#06B6D4]" />
                    <h4 className="text-lg font-semibold text-[#0A2540]">
                      {spot.address || "No address yet"}
                    </h4>
                  </div>

                  <p className="text-gray-600 text-sm">${spot.price || 0}</p>
                  <p className="text-gray-600 text-sm">
                    Spaces: {spot.spacesAvailable ?? "N/A"}
                  </p>

                  <p className="text-gray-600 text-sm">
                    Stadium: {spot.closestStadium || "—"}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* BOOKINGS */}
        <h3 className="text-xl font-semibold text-[#0A2540] mt-10 mb-4">
          Bookings
        </h3>

        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings</p>
        ) : (
          bookings.map((b) => (
            <Card key={b._id} className="p-5 border rounded-xl shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="text-[#0A2540] font-medium">{b.user?.name || "Guest"}</p>
                  <p className="text-gray-600 text-sm">{b.eventName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#0A2540] font-medium">${b.price}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(b.eventDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
