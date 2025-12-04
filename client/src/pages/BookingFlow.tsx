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
  spotId?: string | number;
  listingId?: string;
  listing?: any; // If listing object is passed directly
}

export function BookingFlow({ onNavigate, spotId, listingId, listing: passedListing }: BookingFlowProps) {
  const params = useParams<{ id: string }>();
  
  const [spot, setSpot] = useState<any | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any | null>(passedListing || null);
  const [loading, setLoading] = useState(!passedListing);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (passedListing) {
        setSelectedListing(passedListing);
        setLoading(false);
        return;
      }

      try {
        // If listingId is provided, fetch that specific listing
        if (listingId || params?.id) {
          const id = listingId || params?.id;
          const res = await fetch(`${API_URL}/listings?spotId=${id}`);
          const data = await res.json();
          
          const found = Array.isArray(data) 
            ? data.find((l: any) => l._id === id)
            : data;
          
          if (found) {
            setSelectedListing(found);
            setLoading(false);
            return;
          }
        }

        // If spotId is provided, fetch spot and its available listings
        if (spotId) {
          const spotRes = await fetch(`${API_URL}/spots/${spotId}`);
          if (!spotRes.ok) throw new Error("Spot not found");
          const spotData = await spotRes.json();
          setSpot(spotData);

          // Fetch available listings for this spot
          const listingsRes = await fetch(`${API_URL}/listings?spotId=${spotId}`);
          const listingsData = await listingsRes.json();
          const availableListings = Array.isArray(listingsData)
            ? listingsData.filter((l: any) => 
                l.isActive && 
                l.status === "active" && 
                l.bookedSpaces < l.spacesAvailable
              )
            : [];

          setListings(availableListings);
          
          // If only one listing, auto-select it
          if (availableListings.length === 1) {
            setSelectedListing(availableListings[0]);
          }
        }
      } catch (e: any) {
        setError(e.message || "Failed to load booking information");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [spotId, listingId, params?.id, passedListing]);

  const handleBooking = async () => {
    setError("");

    if (!selectedListing?._id) {
      setError("Please select a listing to book.");
      return;
    }

    // Check if listing is still available
    if (selectedListing.bookedSpaces >= selectedListing.spacesAvailable) {
      setError("This listing is now full.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await createCheckoutSession(selectedListing._id);

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

  // If we have multiple listings for a spot, show selection
  if (spot && listings.length > 0 && !selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("spot", spotId)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <p className="text-[#0A2540] font-semibold">Select a Time Slot</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold text-[#0A2540] mb-2">
              {spot.title || "Parking Spot"}
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {spot.address}
            </p>
          </Card>

          <h3 className="text-md font-semibold text-[#0A2540]">
            Available Time Slots
          </h3>

          <div className="space-y-3">
            {listings.map((listing) => {
              const listingDate = new Date(listing.date);
              const dateStr = listingDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const available = listing.spacesAvailable - (listing.bookedSpaces || 0);

              return (
                <Card
                  key={listing._id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedListing?._id === listing._id
                      ? "border-2 border-[#06B6D4] bg-cyan-50"
                      : "border border-gray-200 hover:border-[#06B6D4]"
                  }`}
                  onClick={() => setSelectedListing(listing)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-4 h-4 text-[#06B6D4]" />
                        <span className="font-medium">{dateStr}</span>
                        <Clock className="w-4 h-4 text-[#06B6D4] ml-2" />
                        <span>
                          {listing.startTime} - {listing.endTime}
                        </span>
                      </div>
                      {listing.eventName && (
                        <p className="text-sm text-[#06B6D4] mb-1">
                          {listing.eventName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {available} space{available !== 1 ? "s" : ""} available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-[#0A2540]">
                        ${listing.price}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {error && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </Card>
          )}

          <Button
            className="w-full bg-[#06B6D4] hover:bg-[#0891b2] text-white py-3 text-lg"
            onClick={handleBooking}
            disabled={!selectedListing || isSubmitting}
          >
            {isSubmitting
              ? "Redirecting to Stripe…"
              : selectedListing
              ? `Proceed to Payment - $${selectedListing.price}`
              : "Select a time slot to continue"}
          </Button>
        </div>
      </div>
    );
  }

  // If no listings available for spot
  if (spot && listings.length === 0 && !selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-[#0A2540] mb-2">
            No Available Listings
          </h2>
          <p className="text-gray-600 mb-4">
            This spot doesn't have any available time slots at the moment.
          </p>
          <Button onClick={() => onNavigate("spot", spotId)}>
            Back to Spot Details
          </Button>
        </Card>
      </div>
    );
  }

  // Show selected listing for booking
  if (!selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-red-600">{error || "Listing not found."}</p>
      </div>
    );
  }

  const listingDate = new Date(selectedListing.date);
  const dateStr = listingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displaySpot = spot || selectedListing.spotId;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (spot && listings.length > 1) {
                setSelectedListing(null);
              } else {
                onNavigate(spot ? "spot" : "map", spotId);
              }
            }}
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
                {displaySpot?.title || "Parking Spot"}
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <MapPin className="w-4 h-4" />
                {displaySpot?.address || "Address TBD"}
              </p>
              {selectedListing.eventName && (
                <p className="text-sm font-medium text-[#06B6D4] mt-1">
                  {selectedListing.eventName}
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
                {selectedListing.startTime} - {selectedListing.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-xl font-semibold text-[#0A2540]">
                ${selectedListing.price}
              </span>
            </div>
            {selectedListing.spacesAvailable && (
              <p className="text-sm text-gray-500">
                {selectedListing.spacesAvailable - (selectedListing.bookedSpaces || 0)} spaces
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
          disabled={isSubmitting || (selectedListing.bookedSpaces >= selectedListing.spacesAvailable)}
        >
          {isSubmitting
            ? "Redirecting to Stripe…"
            : `Proceed to Payment - $${selectedListing.price}`}
        </Button>
      </div>
    </div>
  );
}
