import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Car,
  Shield,
  Clock,
  Calendar,
  Users,
  Star,
} from "lucide-react";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../ui/ImageWithFallback";

import { fetchSpotById, fetchSpotsByCity } from "../lib/spotApi";

interface SpotDetailsProps {
  onNavigate: (view: string, data?: any) => void;
}

export function SpotDetails({ onNavigate }: SpotDetailsProps) {
  const { id } = useParams<{ id: string }>();

  const [spot, setSpot] = useState<any | null>(null);
  const [moreSpots, setMoreSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const s = await fetchSpotById(id);
        setSpot(s);

        const extras = await fetchSpotsByCity(s.city);
        setMoreSpots(
          extras.filter((x: any) => String(x._id) !== String(s._id))
        );
      } catch (e: any) {
        setError(e.message || "Failed to load spot");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // While loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
        </header>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  // If error
  if (error || !spot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("home")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="text-[#0A2540] font-semibold">Spot Details</p>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-red-600 font-medium mb-2">
            {error || "Could not load this spot."}
          </p>
          <Button onClick={() => onNavigate("home")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const price = spot.price || spot.pricePerHour || 10;
  const hostName = spot.host?.name || "Host";
  const rating = spot.rating || 4.8;
  const reviews = spot.reviewCount || 32;

  const amenities: string[] =
    spot.amenities && Array.isArray(spot.amenities)
      ? spot.amenities
      : ["Easy access", "Well lit", "Residential area"];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("map")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-[#0A2540] font-semibold">
              {spot.address || "Parking Spot"}
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {spot.city || "Unknown"}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* HERO IMAGE + PRICE */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-64 md:h-80 bg-gray-200 rounded-xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1519505907962-0a6ef6dc9095?auto=format&fit=crop&w=1600&q=80"
              alt="Parking spot"
              className="w-full h-full object-cover"
            />
          </div>

          <Card className="p-4 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">From</p>
              <p className="text-3xl font-semibold text-[#0A2540] mb-1">
                ${price}
                <span className="text-base font-normal text-gray-500">
                  /hr
                </span>
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{rating.toFixed(1)}</span>
                <span className="text-gray-400">•</span>
                <span>{reviews} reviews</span>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  <span>
                    {spot.spotsAvailable || 1}{" "}
                    {spot.spotsAvailable === 1 ? "spot" : "spots"} available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Flexible arrival window</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment</span>
                </div>
              </div>
            </div>

            <Button
              className="mt-4 w-full bg-[#06B6D4] hover:bg-[#0891b2]"
              onClick={() => onNavigate("booking", spot._id)}
            >
              Continue to booking
            </Button>
          </Card>
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2">
                About this spot
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {spot.description ||
                  "Convenient residential driveway parking within walking distance of the venue. Perfect for game days, concerts, and events."}
              </p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Event hint */}
            <section className="border rounded-xl p-4 bg-white flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#06B6D4]" />
              <div>
                <p className="text-sm text-[#0A2540] font-medium">
                  Parking for events nearby
                </p>
                <p className="text-xs text-gray-600">
                  Arrive 30–60 minutes before your event for easiest access.
                </p>
              </div>
            </section>
          </div>

          {/* HOST CARD */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-[#0A2540] mb-3">
                Your host
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0A2540]">
                    {hostName}
                  </p>
                  <p className="text-xs text-gray-600">Local resident</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Hosts share their driveways and private parking to help fans
                avoid traffic and high stadium prices.
              </p>
            </Card>
          </div>
        </div>

        {/* MORE SPOTS NEARBY */}
        {moreSpots.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-[#0A2540] mb-3">
              More spots near {spot.city || "this area"}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {moreSpots.map((s: any, i: number) => (
                <Card
                  key={i}
                  className="p-3 cursor-pointer hover:shadow-md transition"
                  onClick={() => onNavigate("spot", s._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={`https://source.unsplash.com/featured/?parking,lot,${i}`}
                        alt={s.address}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#0A2540]">
                        {s.address || "Parking spot"}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {s.city || "Unknown"}
                      </p>
                    </div>
                    <Badge className="bg-[#06B6D4] text-white">
                      ${s.price || s.pricePerHour || 10}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

