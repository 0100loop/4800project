/*
TODO
Input Validation
*/
import { useState } from "react";
import { Button } from "./ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { apiFetch } from "../lib/api.js";

interface CreateListingProps {
  spotId: string;
  onBack: () => void;
}

export function CreateListing({ spotId, onBack }: CreateListingProps) {
  console.log("CreateListing received spotId:", spotId);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [spaces, setSpaces] = useState("");

  // NEW FIELDS
  const [address, setAddress] = useState("");
  const [stadium, setStadium] = useState("");

  const stadiumOptions = [
    "Crypto.com Arena",
    "SoFi Stadium",
    "Dodger Stadium",
    "LA Coliseum",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!spotId) {
      alert("Missing spot ID.");
      return;
    }

    const payload = {
      spotId,
      date,
      startTime,
      endTime,
      price: Number(price),
      spacesAvailable: Number(spaces),
      address,
      closestStadium: stadium,
    };

    console.log("Full payload:", payload);

    try {
      await apiFetch("/api/listings", {
        method: "POST",
        body: payload,
        auth: true,
      });

      alert("Listing created successfully!");
      onBack?.();
    } catch (err) {
      console.error(err);
      alert("Failed to create listing");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-xl mx-auto p-4">
        <Card className="w-full max-w-lg shadow-md border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#0A2540] text-xl flex items-center gap-2">
              Create Event Listing
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Set availability and pricing for this spot.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ADDRESS FIELD */}
              <div className="space-y-1">
                <label className="block text-gray-800 font-medium text-sm">
                  Parking Address *
                </label>
                <Input
                  placeholder="123 Example St, Los Angeles, CA"
                  className="bg-white border-gray-300 text-gray-900"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* CLOSEST STADIUM */}
              <div className="space-y-1">
                <label className="block text-gray-800 font-medium text-sm">
                  Closest Stadium *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-800"
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a stadium...</option>
                  {stadiumOptions.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div className="space-y-1">
                <label className="block text-gray-800 font-medium text-sm">
                  Event Date *
                </label>
                <Input
                  type="date"
                  className="bg-white border-gray-300 text-gray-900"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* TIMES */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-800 font-medium text-sm">
                    Start Time *
                  </label>
                  <Input
                    type="time"
                    className="bg-white border-gray-300 text-gray-900"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-800 font-medium text-sm">
                    End Time *
                  </label>
                  <Input
                    type="time"
                    className="bg-white border-gray-300 text-gray-900"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PRICE */}
              <div className="space-y-1">
                <label className="block text-gray-800 font-medium text-sm">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  className="bg-white border-gray-300 text-gray-800"
                  placeholder="e.g., 25"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Recommended: $15–$35</p>
              </div>

              {/* SPACES */}
              <div className="space-y-1">
                <label className="block text-gray-800 font-medium text-sm">
                  Spaces Available *
                </label>
                <Input
                  type="number"
                  className="bg-white border-gray-300 text-gray-800"
                  placeholder="e.g., 1"
                  value={spaces}
                  onChange={(e) => setSpaces(e.target.value)}
                  required
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                  onClick={() => onBack?.()}
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
    </div>
  );
}

