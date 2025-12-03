import { useEffect, useState } from "react";
import { Button } from "./ui/button.js";
import { Card, CardContent } from "./ui/card.js";
import { Badge } from "./ui/badge.js";
import { MapPin } from "lucide-react";

interface SpotManagementProps {
  onNavigate: (view: string, data?: any) => void;
  apiFetch: any;
  spotData?: any;
}

export function SpotManagement({ onNavigate, apiFetch }: SpotManagementProps) {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ==========================
       LOAD HOST'S SPOTS
  ========================== */
  useEffect(() => {
    async function loadSpots() {
      try {
        const res = await apiFetch("/api/spots/mine");
        setSpots(res || []);
      } catch (err) {
        console.error("Failed to load spots:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSpots();
  }, []);

  /* ==========================
        DELETE A SPOT
  ========================== */
  const handleDeleteSpot = async (spotId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this spot? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/spots/${spotId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete spot");
        return;
      }

      // Remove deleted spot in UI
      setSpots((prev) => prev.filter((s) => s.id !== spotId));
    } catch (err) {
      console.error("Delete spot error:", err);
      alert("Error deleting spot");
    }
  };

  /* ==========================
        ADD A NEW SPOT
  ========================== */
  const handleAddSpot = async () => {
    try {
      // 1️⃣ Create empty spot so we get a real spotId
      const newSpot = await apiFetch("/api/spots", {
        method: "POST",
        body: {},  // You can add address later
        auth: true,
      });

      if (!newSpot || !newSpot.id) {
        alert("Failed to create a new spot.");
        return;
      }

      console.log("New spot created:", newSpot.id);

      // 2️⃣ Navigate to CreateListing *with* the valid spotId
      onNavigate("createListing", { spotId: newSpot.id });
    } catch (err) {
      console.error("Failed to create spot:", err);
      alert("Error creating spot.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#0A2540]">
          My Spots
        </h1>

        <Button
          className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
          onClick={handleAddSpot}
        >
          + Add Spot
        </Button>
      </div>

      {/* SPOT LIST */}
      <div className="space-y-6">
        {loading && <p>Loading spots...</p>}

        {!loading && spots.length === 0 && (
          <p className="text-gray-600">You have no parking spots yet.</p>
        )}

        {spots.map((spot) => (
          <Card
            key={spot.id}
            className="border shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-6 flex items-start justify-between">

              {/* LEFT */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#0A2540] rounded-lg flex items-center justify-center">
                  <MapPin className="text-white w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#0A2540]">
                    {spot.address || "No address set"}
                  </h3>

                  <p className="text-gray-600">
                    ${spot.price || "0"}/event
                  </p>

                  <div className="mt-3 flex gap-6 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Total Bookings:</span>{" "}
                      {spot.bookings || 0}
                    </p>

                    <p>
                      <span className="font-medium">Earnings:</span> $
                      {spot.earnings || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE BUTTONS */}
              <div className="flex flex-col items-end gap-3">

                {/* Active */}
                <Badge className="bg-green-100 text-green-700">
                  Active
                </Badge>

                {/* Delete */}
                <Button
                  variant="destructive"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDeleteSpot(spot.id)}
                >
                  Delete Spot
                </Button>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* UPCOMING BOOKINGS SECTION */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-[#0A2540] mb-3">
          Upcoming Bookings
        </h2>
        <p className="text-gray-600">
          (This area displays future reservations)
        </p>
      </div>

    </div>
  );
}

