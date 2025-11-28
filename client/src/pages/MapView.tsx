import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Car } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../ui/ImageWithFallback";

import { fetchNearbySpots, fetchAllSpots } from "../lib/mapApi";

interface MapViewProps {
  onNavigate: (view: string, data?: any) => void;
  selectedVenue?: any; // from HomePage search or event click
}

export function MapView({ onNavigate, selectedVenue }: MapViewProps) {
  const [spots, setSpots] = useState<any[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 34.0522,
    lng: -118.2437,
  });

  useEffect(() => {
    async function loadSpots() {
      try {
        // If user clicked a venue/event from HomePage:
        if (selectedVenue?.lat && selectedVenue?.lng) {
          const lat = selectedVenue.lat;
          const lng = selectedVenue.lng;

          setCenter({ lat, lng });

          const nearby = await fetchNearbySpots(lat, lng, 2000);
          setSpots(nearby.length ? nearby : []);
          return;
        }

        // Fallback → load all spots
        const all = await fetchAllSpots();
        setSpots(all);
      } catch (err) {
        console.error("MapView error:", err);
      }
    }

    loadSpots();
  }, [selectedVenue]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center gap-3">

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <p className="text-[#0A2540] font-semibold">Parking Map</p>
            <p className="text-xs text-gray-600">
              {selectedVenue?.name || "Find nearby parking"}
            </p>
          </div>

        </div>
      </header>

      {/* MAP IMAGE */}
      <div className="h-72 bg-gray-200">
        <ImageWithFallback
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+285A98(${center.lng},${center.lat})/${center.lng},${center.lat},13,0/800x600?access_token=pk.eyJ1IjoibWFwYm94VXNlciIsImEiOiJja2w4dm1ibGgwMHRlMnFwZThhcTJiaWljIn0.vXJf1dQ0eQ`}
          alt="Map View"
          className="w-full h-full object-cover"
        />
      </div>

      {/* SPOTS LIST */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl text-[#0A2540] font-semibold mb-4">
          Available Parking Spots
        </h2>

        {spots.length === 0 && (
          <p className="text-gray-600">No spots found near this location.</p>
        )}

        <div className="space-y-4">
          {spots.map((spot: any, i: number) => (
            <Card
              key={i}
              className="p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => onNavigate("spot", spot._id)}
            >
              <div className="flex items-center gap-4">

                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <ImageWithFallback
                    src={`https://source.unsplash.com/featured/?parking,driveway,${i}`}
                    alt={spot.address}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-lg font-semibold text-[#0A2540]">
                    {spot.address || "Parking Spot"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {spot.city || "Unknown"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="w-4 h-4" />
                    {spot.spotsAvailable || 1} spots available
                  </div>
                </div>

                <Badge className="bg-[#06B6D4] text-white text-lg px-4 py-2">
                  ${spot.price || 10}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
