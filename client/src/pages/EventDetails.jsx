import { MapPin, Calendar } from "lucide-react";
import { Button } from "../ui/button";

export default function EventDetails({ event, onBack, onNavigate }) {
  if (!event) {
    return (
      <div className="p-8 text-center">
        <p>No event selected.</p>
        <Button onClick={onBack}>Back</Button>
      </div>
    );
  }

  const image =
    event.image ||
    event.performers?.[0]?.image ||
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  const venueName =
    event.venue?.name ||
    event.performers?.[0]?.venue_name ||
    event.performers?.[0]?.short_name ||
    "Unknown Venue";

  const city =
    event.venue?.city || event.performers?.[0]?.location?.city || "";

  const state =
    event.venue?.state || event.performers?.[0]?.location?.state || "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <Button onClick={onBack} className="mb-6">
        ← Back
      </Button>

      <img
        src={image}
        alt={event.title}
        className="w-full h-72 object-cover rounded-xl shadow-lg"
      />

      <h1 className="text-4xl font-bold text-[#0A2540] mt-6 mb-3">
        {event.title}
      </h1>

      <div className="flex items-center text-gray-700 mb-2">
        <MapPin className="w-5 h-5 mr-2" />
        <span>{venueName}</span>
      </div>

      <div className="flex items-center text-gray-700 mb-4">
        <Calendar className="w-5 h-5 mr-2" />
        <span>{new Date(event.datetime_local).toLocaleString()}</span>
      </div>

      <p className="text-gray-600 mb-6">
        {city && `${city}, `}
        {state}
      </p>

      {/* MAP VIEW BUTTON */}
      <Button
        className="w-full mb-4 bg-[#06B6D4] hover:bg-[#0891B2]"
        onClick={() => onNavigate("map", { event })}
      >
        View on Map
      </Button>

      {/* BOOKING BUTTON */}
      <Button
        className="w-full bg-[#0A2540] hover:bg-[#112E55] text-white"
        onClick={() => onNavigate("booking", { event })}
      >
        Book Tickets / Parking
      </Button>
    </div>
  );
}
