import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ImageWithFallback } from "../ui/ImageWithFallback";

import { createCheckoutSession } from "../lib/paymentsApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface BookingFlowProps {
  onNavigate: (view: string, data?: any) => void;
  listingId?: string;
  listing?: any; // If listing object is passed directly
}

export function BookingFlow({ onNavigate, listingId, listing: passedListing }: BookingFlowProps) {
  const params = useParams<{ id: string }>();
  const resolvedListingId = listingId || params?.id;

  const [listing, setListing] = useState<any | null>(passedListing || null);
  const [loading, setLoading] = useState(!passedListing);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (passedListing) {
        setListing(passedListing);
        setLoading(false);
        return;
      }

      try {
        if (!resolvedListingId) return;
        
        // Fetch listing by ID - try spotId query first, or we may need a direct /listings/:id route
        const res = await fetch(`${API_URL}/listings?spotId=${resolvedListingId}`);
        const data = await res.json();
        
        // If it's an array, find the one matching the ID
        const found = Array.isArray(data) 
          ? data.find((l: any) => l._id === resolvedListingId)
          : data;
        
        if (!found) {
          throw new Error("Listing not found");
        }
        
        setListing(found);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedListingId, passedListing]);

  const handleBooking = async () => {
    setError("");

    if (!listing?._id) {
      setError("Missing listing information.");
      return;
    }

    // Check if listing is still available
    if (listing.bookedSpaces >= listing.spacesAvailable) {
      setError("This listing is now full.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await createCheckoutSession(listing._id);

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

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-red-600">{error || "Listing not found."}</p>
      </div>
    );
  }

  const listingDate = new Date(listing.date);
  const dateStr = listingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("map")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="text-[#0A2540] font-semibold">Confirm Booking</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* LISTING SUMMARY */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1519505907962-0a6ef6dc9095?auto=format&fit=crop&w=1200&q=80"
                alt="Parking spot"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2">
                {listing.spotId?.title || "Parking Spot"}
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <MapPin className="w-4 h-4" />
                {listing.spotId?.address || "Address TBD"}
              </p>
              {listing.eventName && (
                <p className="text-sm font-medium text-[#06B6D4] mt-1">
                  {listing.eventName}
                </p>
              )}
            </div>
          </div>

          {/* DATE & TIME INFO */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-[#06B6D4]" />
              <span className="font-medium">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-[#06B6D4]" />
              <span>
                {listing.startTime} - {listing.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-xl font-semibold text-[#0A2540]">
                ${listing.price}
              </span>
            </div>
            {listing.spacesAvailable && (
              <p className="text-sm text-gray-500">
                {listing.spacesAvailable - (listing.bookedSpaces || 0)} spaces
                remaining
              </p>
            )}
          </div>
        </Card>

        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </Card>
        )}

        {/* CONFIRM BUTTON */}
        <Button
          className="w-full bg-[#06B6D4] hover:bg-[#0891b2] text-white py-3 text-lg"
          onClick={handleBooking}
          disabled={isSubmitting || (listing.bookedSpaces >= listing.spacesAvailable)}
        >
          {isSubmitting
            ? "Redirecting to Stripe…"
            : `Proceed to Payment - $${listing.price}`}
        </Button>
      </div>
    </div>
  );
}
