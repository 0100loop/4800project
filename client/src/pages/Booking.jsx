import { MapPin, DollarSign, User, Car } from "lucide-react";
import { Button } from "../ui/button";

export default function Booking({ onNavigate, spotData }) {
  const spot = spotData?.spot;

  if (!spot) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-600 mb-4">No parking spot selected.</p>
        <Button onClick={() => onNavigate("home")}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* BACK */}
      <Button onClick={() => onNavigate("map", { event: spot.event })} className="mb-6">
        ← Back
      </Button>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-[#0A2540] mb-4">
        Book Parking Spot
      </h1>

      {/* HOST INFO */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 border">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#06B6D4]" />
          Hosted by {spot.owner?.name || "Host"}
        </h2>

        <p className="text-gray-600 mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {spot.address}
        </p>

        <p className="text-gray-600 flex items-center gap-2 mb-1">
          <Car className="w-4 h-4" />
          Spaces Available: {spot.spacesAvailable}
        </p>

        <p className="text-[#06B6D4] text-lg flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> {spot.price}
        </p>
      </div>

      {/* MAP PREVIEW */}
      <Button
        className="w-full mb-4 bg-[#06B6D4] hover:bg-[#0891B2]"
        onClick={() =>
          onNavigate("map", {
            event: {
              venue: {
                name: spot.closestStadium,
                lat: spot.latitude,
                lon: spot.longitude,
              },
              title: `${spot.closestStadium} Parking`,
            },
          })
        }
      >
        View Location on Map
      </Button>

      {/* CONFIRM BOOKING */}
      <Button
        className="w-full bg-[#0A2540] hover:bg-[#112E55] text-white"
        onClick={() =>
          onNavigate("bookingConfirmation", {
            bookingData: {
              spotId: spot._id,
              price: spot.price,
              host: spot.owner?.name,
              address: spot.address,
            },
          })
        }
      >
        Confirm Booking
      </Button>
    </div>
  );
}
