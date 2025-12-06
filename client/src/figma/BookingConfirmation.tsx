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

interface BookingConfirmationProps {
  onNavigate: (view: string, data?: any) => void;
  bookingData: any;
}

export function BookingConfirmation({
  onNavigate,
  bookingData,
}: BookingConfirmationProps) {
  console.log('BookingConfirmation received bookingData:', bookingData);
  
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  // Extract the actual listing from bookingData
  const spot = bookingData?.spot || bookingData;

  // spot schema fields
  const price = Number(spot?.pricePerEvent || 0);
  const date = spot?.date ? new Date(spot.date) : new Date();
  const distanceKm = Number(spot?.distanceKm || 0);
  const distanceMeters = Number(spot?.distanceMeters || 0);

  console.log('Parsed values:', { price, distanceKm, distanceMeters, spot });

  const serviceFee = 2.50;
  const total = price + serviceFee;

  const handleConfirmBooking = async () => {
    if (!email || !phone) {
      alert("Please enter your contact information.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1️⃣ Save the booking (unpaid) in your DB
      const bookingPayload = {
        spotId: spot?._id,
        email,
        phone,
        totalPrice: total,
        date: new Date().toISOString(),
        paid: false,
      };

      console.log('Creating booking with payload:', bookingPayload);

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      console.log('Booking response status:', bookingRes.status);

      if (!bookingRes.ok) {
        const errText = await bookingRes.text();
        console.error('Booking POST failed:', bookingRes.status, errText);
        setIsProcessing(false);
        return alert('Failed to create booking: ' + (errText || bookingRes.status));
      }

      // Check if response has content before parsing JSON
      const contentType = bookingRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await bookingRes.text();
        console.error('Non-JSON response from booking API:', text);
        setIsProcessing(false);
        return alert('Server returned invalid response format');
      }

      const bookingResp = await bookingRes.json();
      console.log('Booking created:', bookingResp);

      // backend currently returns { message, booking } — accept both shapes
      const createdBooking = bookingResp.booking || bookingResp;
      const bookingId = createdBooking?._id || createdBooking?.id;
      
      if (!bookingId) {
        console.error('Booking created but no id returned', bookingResp);
        setIsProcessing(false);
        return alert('Booking created but no id returned from server');
      }

      // 2️⃣ Create Stripe Checkout session for this booking
      console.log('Creating Stripe session for booking:', bookingId);

      const stripeRes = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          bookingId,
          spotId: spot._id
        }),
      });

      console.log('Stripe response status:', stripeRes.status);

      if (!stripeRes.ok) {
        const errText = await stripeRes.text();
        console.error('Stripe session creation failed:', stripeRes.status, errText);
        setIsProcessing(false);
        return alert('Failed to create payment session: ' + (errText || stripeRes.status));
      }

      // Check if Stripe response has content before parsing JSON
      const stripeContentType = stripeRes.headers.get("content-type");
      if (!stripeContentType || !stripeContentType.includes("application/json")) {
        const text = await stripeRes.text();
        console.error('Non-JSON response from Stripe API:', text);
        setIsProcessing(false);
        return alert('Payment service returned invalid response format');
      }

      const sessionData = await stripeRes.json();
      console.log('Stripe session created:', sessionData);

      if (!sessionData.url) {
        console.error('No Stripe URL in response:', sessionData);
        setIsProcessing(false);
        return alert("Stripe error: No checkout URL returned. Try again.");
      }

      // 3️⃣ Redirect to Stripe Checkout
      console.log('Redirecting to Stripe checkout:', sessionData.url);
      window.location.href = sessionData.url;

    } catch (error) {
      console.error('Error in handleConfirmBooking:', error);
      setIsProcessing(false);
      alert('An unexpected error occurred: ' + (error as Error).message);
    }
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-[#0A2540] mb-2 text-2xl font-semibold">Booking Confirmed!</h2>
            <p className="text-gray-600">Your parking spot has been reserved</p>
          </div>

          <Card className="border-[#06B6D4]/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center py-4 bg-[#06B6D4]/5 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Confirmation Code</p>
                  <p className="text-2xl font-mono text-[#0A2540]">{confirmationCode}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-[#0A2540] mb-3 font-semibold">Booking Details</h3>
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
                        {distanceKm > 0 ? `${distanceKm.toFixed(2)} km away` : spot.address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid</span>
                      <span className="text-[#0A2540] font-semibold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Access Code:</strong> #{Math.floor(1000 + Math.random() * 9000)}
                    <br />
                    <span className="text-xs">Share this code with the host upon arrival</span>
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Confirmation email sent to:</strong> {email || "your email address"}
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
          disabled={isProcessing}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-[#0A2540] flex-1 text-lg font-semibold">Complete Your Booking</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* SUMMARY CARD */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4 font-semibold">Parking Spot Details</h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#06B6D4] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[#0A2540] font-medium">{spot.address}</p>
                    {distanceKm > 0 && (
                      <p className="text-sm text-gray-600">
                        {distanceKm.toFixed(2)} km • {Math.round(distanceMeters / 80)} min walk
                      </p>
                    )}
                    {spot.spaces && (
                      <p className="text-sm text-gray-600">
                        Spaces available: {spot.spaces}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parking price</span>
                  <span className="text-[#0A2540]">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-[#0A2540]">${serviceFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-[#0A2540] font-semibold">Total</span>
                  <span className="text-xl text-[#0A2540] font-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CONTACT INFO */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4 font-semibold">Contact Information</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-1">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isProcessing}
                      className="pl-10 bg-white border-gray-300 text-gray-900"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 mb-1">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isProcessing}
                      className="pl-10 bg-white border-gray-300 text-gray-900"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PAYMENT INFO */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4 font-semibold">Payment</h3>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[#06B6D4]" />
                  <p className="text-gray-700 text-sm font-medium">
                    Secure payment powered by Stripe
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  You'll be redirected to Stripe's secure checkout to complete your payment.
                </p>
                <img
                  src="https://stripe.com/img/v3/home/twitter.png"
                  alt="Stripe"
                  className="h-6 opacity-80"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-sm text-gray-600 justify-center mb-6">
            <Shield className="w-4 h-4 text-[#06B6D4]" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleConfirmBooking}
            disabled={!email || !phone || isProcessing}
            className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Confirm & Pay ${total.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}