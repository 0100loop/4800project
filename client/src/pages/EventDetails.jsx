import { MapPin, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";

export default function EventDetails({ event, onBack }) {
  if (!event)
    return (
      <div className="p-8 text-center">
        <p>No event selected.</p>
        <Button onClick={onBack}>Back</Button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <Button onClick={onBack} className="mb-6">
        ← Back
      </Button>

      <img
        src={event.image}
        alt={event.name}
        className="w-full h-72 object-cover rounded-xl shadow-md"
      />

      <h1 className="text-4xl font-bold text-[#0A2540] mt-6 mb-4">
        {event.name}
      </h1>

      <div className="flex items-center text-gray-700 mb-3">
        <MapPin className="w-5 h-5 mr-2" />
        <span>{event.venue}</span>
      </div>

      <div className="flex items-center text-gray-700 mb-4">
        <Calendar className="w-5 h-5 mr-2" />
        <span>{event.date}</span>
      </div>

      <p className="text-gray-600 mb-6">{event.address}</p>

      <Button
        className="bg-[#06B6D4] hover:bg-[#0891b2]"
        onClick={() => window.open(event.url, "_blank")}
      >
        View on SeatGeek
      </Button>
    </div>
  );
}
