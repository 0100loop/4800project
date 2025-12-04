import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { apiFetch } from "../lib/api";

interface CreateListingProps {
  spotId: string;
  onBack: () => void;
  onNavigate?: (view: string, data?: any) => void;
}

export function CreateListing({ spotId, onBack, onNavigate }: CreateListingProps) {
  const [hostName, setHostName] = useState("");
  const [address, setAddress] = useState("");
  const [stadium, setStadium] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [spaces, setSpaces] = useState("");

  // Address autocomplete suggestions
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const stadiumOptions = [
    "SoFi Stadium",
    "Crypto.com Arena",
    "Dodger Stadium",
    "LA Coliseum",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const updatedSpot = await apiFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: {
          hostName,
          address,
          closestStadium: stadium,
          eventDate,
          startTime,
          endTime,
          price: Number(price),
          spacesAvailable: Number(spaces),
        },
      });

      // If we have navigation available, jump straight to the map
      if (onNavigate && updatedSpot) {
        const venueName = updatedSpot.closestStadium || stadium;
        const lat = updatedSpot.latitude;
        const lon = updatedSpot.longitude;

        if (!lat || !lon) {
          alert(
            "Listing saved, but we couldn't geocode the address. Please check the address format."
          );
          onBack();
          return;
        }

        onNavigate("map", {
          event: {
            title: `${venueName} Parking`,
            venue: {
              name: venueName,
              lat,
              lon,
            },
          },
        });
      } else {
        onBack();
      }
    } catch (err: any) {
      console.error("Create listing error:", err);
      alert(err.message || "Failed to create listing. Please try again.");
    }
  }

  // Address autocomplete (client-side Nominatim)
  useEffect(() => {
    if (!address.trim()) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setAddressLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          address.trim()
        )}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          setAddressSuggestions([]);
          return;
        }
        const data = await res.json();
        const suggestions = (data || []).map(
          (item: any) => item.display_name as string
        );
        setAddressSuggestions(suggestions);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Address autocomplete error:", err);
        }
      } finally {
        setAddressLoading(false);
      }
    }, 400); // simple debounce

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [address]);

  return (
    <div className="min-h-screen bg-white flex justify-center items-start py-10">
      <Card className="w-full max-w-3xl shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#0A2540] text-2xl font-semibold">
            Create Event Listing
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Set availability and pricing for this spot.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* HOST NAME (LIVE INPUT) */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Host Name *
              </label>
              <Input
                placeholder="Your Name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="bg-white text-[#0A2540]"
                required
              />
            </div>

            {/* ADDRESS (LIVE INPUT) */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Parking Address *
              </label>
              <Input
                placeholder="123 Example St, Los Angeles, CA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={() => address && setShowSuggestions(true)}
                className="bg-white text-[#0A2540]"
                required
              />
              {showSuggestions && (addressSuggestions.length > 0 || addressLoading) && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto text-sm z-50">
                  {addressLoading && (
                    <div className="px-3 py-2 text-gray-500">Searching…</div>
                  )}
                  {!addressLoading &&
                    addressSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-[#0A2540]"
                        onClick={() => {
                          setAddress(s);
                          setShowSuggestions(false);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* STADIUM DROPDOWN (LIVE INPUT) */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Closest Stadium *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white"
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                required
              >
                <option value="">Select stadium...</option>
                {stadiumOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* EVENT DATE (LIVE INPUT) */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Event Date *
              </label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-white text-[#0A2540]"
                required
              />
            </div>

            {/* TIME RANGE (LIVE INPUT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 text-gray-800 font-medium text-sm">
                  Start Time *
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-white text-[#0A2540]"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-800 font-medium text-sm">
                  End Time *
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-white text-[#0A2540]"
                  required
                />
              </div>
            </div>

            {/* PRICE (LIVE INPUT) */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Price ($) *
              </label>
              <Input
                type="number"
                placeholder="e.g., 25"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white text-[#0A2540]"
                required
              />
              <p className="text-xs text-gray-500">Recommended: $15–$35</p>
            </div>

            {/* SPACES (LIVE INPUT) */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Spaces Available *
              </label>
              <Input
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white"
                type="number"
                placeholder="e.g., 1"
                value={spaces}
                onChange={(e) => setSpaces(e.target.value)}
                className="bg-white text-[#0A2540]"
                required
              />
            </div>

            {/* LIVE PREVIEW OF LISTING */}
            <div className="mt-6 border rounded-xl p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-[#0A2540] mb-2">
                Listing Preview
              </h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Host:</span>{" "}
                {hostName || "Your name here"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Address:</span>{" "}
                {address || "Parking address"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Closest Stadium:</span>{" "}
                {stadium || "Select stadium"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Date:</span>{" "}
                {eventDate || "Select date"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Time:</span>{" "}
                {startTime && endTime
                  ? `${startTime} – ${endTime}`
                  : "Select times"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Price:</span>{" "}
                {price ? `$${price}` : "Set a price"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Spaces:</span>{" "}
                {spaces || "Number of spaces"}
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-[#0A2540] border-[#0A2540]"
                onClick={onBack}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-white"
              >
                Create Listing
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
