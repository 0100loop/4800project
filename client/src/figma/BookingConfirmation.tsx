import {
  Check,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Shield,
  ChevronLeft,
  User,
  Mail,
  Phone,
} from "lucide-react";

import { Button } from "./ui/button.tsx";
import { Card, CardContent } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Separator } from "./ui/separator.tsx";
import { Badge } from "./ui/badge.tsx";
import { useState } from "react";

interface BookingConfirmationProps {
  onNavigate: (view: string, data?: any) => void;
  bookingData: any; // listing directly
}

export function BookingConfirmation({
  onNavigate,
  bookingData,
}: BookingConfirmationProps) {
  console.log('BookingConfirmation received bookingData:', bookingData);
  
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Extract the actual listing from bookingData
  const spot = bookingData?.spot || bookingData;


  // spot schema fields
  const price = Number(spot?.pricePerEvent || 0);
  const date = spot?.date
    ? new Date(spot.date)
    : new Date();

  const distanceKm = Number(spot?.distanceKm || 0);
  const distanceMeters = Number(spot?.distanceMeters || 0);

  console.log('Parsed values:', { price, distanceKm, distanceMeters, spot });

  const total = price + 2.5;

  const handleConfirmBooking = async () => {
  if (!email || !phone) {
    alert("Please enter your contact information.");
    return;
  }

  // 1️⃣ Save the booking (unpaid) in your DB
  const bookingPayload = {
    spotId: spot?._id,
    email,
    phone,
    totalPrice: total,
    date: new Date().toISOString(),
    paid: false,
  };

  const bookingRes = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(bookingPayload),
  });

  if (!bookingRes.ok) {
    const errText = await bookingRes.text();
    console.error('Booking POST failed:', bookingRes.status, errText);
    return alert('Failed to create booking: ' + (errText || bookingRes.status));
  }

  const bookingResp = await bookingRes.json();
  // backend currently returns { message, booking } — accept both shapes
  const createdBooking = bookingResp.booking || bookingResp;
  const bookingId = createdBooking?._id || createdBooking?.id;
  if (!bookingId) {
    console.error('Booking created but no id returned', bookingResp);
    return alert('Booking created but no id returned from server');
  }

  // 2️⃣ Create Stripe Checkout session for this booking
  const stripeSession = await fetch("/api/payments/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: total,
      bookingId,
      spotId: spot._id
    }),
  });

  const sessionData = await stripeSession.json();

  if (!sessionData.url) return alert("Stripe error. Try again.");

  // 3️⃣ Redirect to Stripe Checkout
  window.location.href = sessionData.url;
};



  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-[#0A2540] mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your parking spot has been reserved</p>
          </div>

          <Card className="border-[#06B6D4]/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center py-4 bg-[#06B6D4]/5 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Confirmation Code</p>
                  <p className="text-2xl text-[#0A2540]">
                    PK-{new Date().getFullYear()}-
                    {Math.floor(1000 + Math.random() * 9000)}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-[#0A2540] mb-3">Booking Details</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="text-[#0A2540]">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="text-[#0A2540]">
                        {distanceKm.toFixed(2)} km away
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid</span>
                      <span className="text-[#0A2540]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Access Code:</strong> #
                    {Math.floor(1000 + Math.random() * 9000)}
                    <br />
                    <span className="text-xs">
                      Share this code with the host upon arrival
                    </span>
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Confirmation email sent to:</strong>{" "}
                    {email || "your email address"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => onNavigate("bookings")}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white"
            >
              View My Bookings
            </Button>

            <Button
              onClick={() => onNavigate("home")}
              variant="outline"
              className="w-full border-[#0A2540] text-[#0A2540]"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN CHECKOUT UI
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("spot", bookingData)}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-[#0A2540] flex-1">Complete Your Booking</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* SUMMARY CARD */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4">Parking Spot Details</h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#06B6D4] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[#0A2540]">
                      {spot.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {distanceKm ? `${distanceKm.toFixed(2)} km • ${Math.round(distanceMeters / 80)} min walk` : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      Spaces available: {spot.spaces || 1}
                    </p>

                    <p className="text-sm text-gray-600">
                      {distanceMeters > 0 ? `Approx ${Math.round(distanceMeters / 80)} min walk` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price</span>
                  <span className="text-[#0A2540]">${price.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-[#0A2540]">$2.50</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between">
                  <span className="text-[#0A2540]">Total</span>
                  <span className="text-xl text-[#0A2540]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CONTACT INFO */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className= "text-gray-700 mb-1">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 mb-1">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4">Payment</h3>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 text-sm mb-3">
                  Payments are securely processed by Stripe.
                </p>
                <img
                  src="https://stripe.com/img/v3/home/twitter.png"
                  alt="Stripe"
                  className="h-6 opacity-80"
                />
              </div>
            </CardContent>
          </Card>


          {/* Security */}
          <div className="flex items-center gap-2 text-sm text-gray-600 justify-center mb-6">
            <Shield className="w-4 h-4 text-[#06B6D4]" />
            <span>Your payment information is encrypted</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleConfirmBooking}
            disabled={!email || !phone}
            className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Confirm & Pay ${total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}