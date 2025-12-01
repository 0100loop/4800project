import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageWithFallback } from "../ui/ImageWithFallback";

import { fetchSpotById } from "../lib/spotApi";
import { createCheckoutSession } from "../lib/paymentsApi";

interface BookingFlowProps {
  onNavigate: (view: string, data?: any) => void;
  spotId?: string | number;
}

export function BookingFlow({ onNavigate, spotId }: BookingFlowProps) {
  const params = useParams<{ id: string }>();
  const resolvedSpotId = useMemo(() => {
    if (spotId) return String(spotId);
    if (params?.id) return params.id;
    return null;
  }, [spotId, params?.id]);
  const backTarget =
    spotId ?? (params?.id ? Number(params.id) : undefined);

  const [spot, setSpot] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        if (!resolvedSpotId) return;
        const s = await fetchSpotById(resolvedSpotId);
        setSpot(s);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedSpotId]);

  useEffect(() => {
    if (!spot || !startTime || !endTime) {
      setTotalPrice(null);
      return;
    }

    const pricePerHour = spot.price || spot.pricePerHour || 10;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();

    if (Number.isNaN(diffMs) || diffMs <= 0) {
      setTotalPrice(null);
      return;
    }

    const hours = Math.max(1, diffMs / (1000 * 60 * 60));
    setTotalPrice(Math.round(hours * pricePerHour));
  }, [spot, startTime, endTime]);

  const handleBooking = async () => {
    setError("");

    if (!resolvedSpotId) {
      setError("Missing spot ID.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Please select a start and end time.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await createCheckoutSession(
        resolvedSpotId,
        startTime,
        endTime
      );

      window.location.href = session.url;
    } catch (e: any) {
      setError(e.message || "Unable to start checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-600">Loading booking details…</p>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-red-600">Spot not found.</p>
      </div>
    );
  }

  const price = spot.price || spot.pricePerHour || 10;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("spot", backTarget)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="text-[#0A2540] font-semibold">Book This Spot</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* SPOT SUMMARY */}
        <Card className="p-4 flex items-center gap-4">
          <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1519505907962-0a6ef6dc9095?auto=format&fit=crop&w=1200&q=80"
              alt="Spot"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-lg font-semibold text-[#0A2540]">
              {spot.address}
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {spot.city}
            </p>

            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              ${price}/hr
            </div>
          </div>
        </Card>

        {/* TIME SELECTION */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-[#0A2540]">
            Select your arrival + leave time
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <Label>End Time</Label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {totalPrice !== null && (
            <p className="text-[#0A2540] text-xl font-semibold mt-2">
              Estimated: ${totalPrice}
            </p>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </Card>

        {/* CONFIRM BUTTON */}
        <Button
          className="w-full bg-[#06B6D4] hover:bg-[#0891b2] text-white py-3 text-lg"
          onClick={handleBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Redirecting to Stripe…" : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
