import { MapPin, User, Car, DollarSign } from "lucide-react";
import { Button } from "../ui/button";

export function SpotDetails({ onNavigate, spotData }) {
  const spot = spotData?.spot;

  if (!spot) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-600">Spot not found.</p>
        <Button onClick={() => onNavigate("home")}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* BACK */}
      <Button onClick={() => onNavigate("home")} className="mb-6">

        ← Back
      </Button>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-[#0A2540] mb-4">
        Parking Spot Details
      </h1>

      <div className="bg-white p-6 shadow rounded-xl mb-6 border">

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-[#06B6D4]" />
          Host: {spot.owner?.name || "Host"}
        </h2>

        <p className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          {spot.address}
        </p>

        <p className="flex items-center gap-2 text-gray-600 mb-2">
          <Car className="w-4 h-4" />
          Spaces Available: {spot.spacesAvailable}
        </p>

        <p className="text-[#06B6D4] text-lg flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4" /> {spot.price}
        </p>

        <p className="text-gray-600">
          Closest Stadium:{" "}
          <span className="font-medium text-[#0A2540]">
            {spot.closestStadium}
          </span>
        </p>
      </div>

      {/* MAP BUTTON */}
      <Button
        className="w-full mb-4 bg-[#06B6D4] hover:bg-[#0891B2]"
        onClick={() =>
          onNavigate("map", {
            event: {
              title: `${spot.closestStadium} Parking`,
              venue: {
                name: spot.closestStadium,
                lat: spot.latitude,
                lon: spot.longitude,
              },
            },
          })
        }
      >
        View on Map
      </Button>

      {/* BOOKING BUTTON */}
      <Button
        className="w-full bg-[#0A2540] hover:bg-[#112E55] text-white"
        onClick={() => onNavigate("booking", { spot })}
      >
        Book This Spot
      </Button>
    </div>
  );
}
