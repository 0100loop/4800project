import { useState } from "react";
import {
  Check,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ChevronLeft,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export function BookingConfirmation({ onNavigate, bookingData }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  /* ==========================================================
     SUCCESS SCREEN (after confirm)
  ========================================================== */
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-[#0A2540] mb-2 text-xl font-semibold">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600">Your parking spot has been reserved</p>
          </div>

          <Card className="border-[#06B6D4]/30">
            <CardContent className="p-6 space-y-4">
              {/* Confirmation Code */}
              <div className="text-center py-4 bg-[#06B6D4]/5 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Confirmation Code</p>
                <p className="text-2xl text-[#0A2540]">
                  PK-{new Date().getFullYear()}-{(Math.random() * 9000 + 1000) | 0}
                </p>
              </div>

              <Separator />

              {/* Booking Summary */}
              <div>
                <h3 className="text-[#0A2540] mb-3 font-semibold">
                  Booking Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event</span>
                    <span className="text-[#0A2540]">Lakers vs Warriors</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="text-[#0A2540]">Oct 15, 2025</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Host</span>
                    <span className="text-[#0A2540]">Mike T.</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid</span>
                    <span className="text-[#0A2540]">
                      ${bookingData?.total || 15}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Access code */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Access Code:</strong>{" "}
                  #{(Math.random() * 9000 + 1000) | 0}
                  <br />
                  <span className="text-xs">
                    Share this code with the host upon arrival.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => onNavigate("home")}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white"
            >
              Return to Home
            </Button>

            <Button
              variant="outline"
              className="w-full border-[#0A2540] text-[#0A2540]"
              onClick={() => onNavigate("map")}
            >
              View on Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     BOOKING SUMMARY SCREEN (before confirm)
  ========================================================== */
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("spot")}
          className="rounded-full text-[#0A2540]"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <h3 className="text-[#0A2540] flex-1">Confirm Booking</h3>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4 font-semibold">
                Booking Summary
              </h3>

              {/* Summary Items */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#06B6D4] mt-0.5" />
                  <div>
                    <p className="text-[#0A2540]">Lakers vs Warriors</p>
                    <p className="text-sm text-gray-600">Crypto.com Arena</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#06B6D4] mt-0.5" />
                  <div>
                    <p className="text-[#0A2540]">October 15, 2025</p>
                    <p className="text-sm text-gray-600">
                      Game starts at 7:30 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#06B6D4] mt-0.5" />
                  <div>
                    <p className="text-[#0A2540]">0.3 mi from venue</p>
                    <p className="text-sm text-gray-600">
                      6 min walk • Hosted by Mike T.
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking spot</span>
                  <span className="text-[#0A2540]">$15.00</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-[#0A2540]">$2.50</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between">
                  <span className="text-[#0A2540] font-semibold">Total</span>
                  <span className="text-xl text-[#0A2540]">
                    ${(bookingData?.total || 15) + 2.5}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NO PAYMENT FIELDS ANYMORE */}
          {/* PAYMENT SECTION WAS REMOVED ON PURPOSE */}
        </div>
      </div>

      {/* CONFIRM BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => setIsConfirmed(true)}
            className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-6"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Confirm Booking • ${(bookingData?.total || 15) + 2.5}
          </Button>
        </div>
      </div>
    </div>
  );
}
