import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { apiFetch } from "../lib/api";

export function CreateListing({ spotId, onBack }) {
  const [hostName, setHostName] = useState("");
  const [address, setAddress] = useState("");
  const [stadium, setStadium] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [spaces, setSpaces] = useState("");

  const stadiumOptions = [
    "SoFi Stadium",
    "Crypto.com Arena",
    "Dodger Stadium",
    "LA Coliseum",
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    await apiFetch(`/api/spots/${spotId}`, {
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

    alert("Listing created successfully!");
    onBack();
  }

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

            {/* HOST NAME */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Host Name *
              </label>
              <Input
                placeholder="Your Name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                required
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Parking Address *
              </label>
              <Input
                placeholder="123 Example St, Los Angeles, CA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* STADIUM DROPDOWN */}
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

            {/* EVENT DATE */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Event Date *
              </label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>

            {/* TIME RANGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 text-gray-800 font-medium text-sm">
                  Start Time *
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
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
                  required
                />
              </div>
            </div>

            {/* PRICE */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium text-sm">
                Price ($) *
              </label>
              <Input
                type="number"
                placeholder="e.g., 25"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Recommended: $15–$35</p>
            </div>

            {/* SPACES */}
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
                required
              />
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
