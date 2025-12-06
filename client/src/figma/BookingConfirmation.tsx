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

export function BookingConfirmation({ onNavigate, bookingData }: BookingConfirmationProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  // Extract booking data with fallbacks
  const spot = bookingData?.spot || {};
  const event = bookingData?.event || {};
  const venue = bookingData?.venue || {};
  const spotPrice = spot.pricePerEvent || bookingData?.total || 15;
  const serviceFee = 2.50;
  const totalPrice = spotPrice + serviceFee;

  const handlePayment = async () => {
    // Basic validation
    if (!cardNumber || !expiry || !cvv || !cardholderName) {
      alert("Please fill in all payment fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call to create booking
      // In production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate confirmation code
      const code = `PK-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
      setConfirmationCode(code);
      setIsConfirmed(true);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
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
            <h2 className="text-[#0A2540] mb-2 text-xl font-semibold">Booking Confirmed!</h2>
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
                      <span className="text-gray-600">Event</span>
                      <span className="text-[#0A2540]">{event.name || "Event"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue</span>
                      <span className="text-[#0A2540]">{venue.name || "Venue"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="text-[#0A2540]">
                        {event.date ? new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="text-[#0A2540]">{spot.address || "Parking spot"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid</span>
                      <span className="text-[#0A2540] font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Access Code:</strong> #{Math.floor(Math.random() * 9000 + 1000)}
                    <br />
                    <span className="text-xs">Share this code with the host upon arrival</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <Button 
              onClick={() => onNavigate('home')} 
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white"
            >
              Return to Home
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-[#0A2540] text-[#0A2540]" 
              onClick={() => onNavigate('map', bookingData)}
            >
              View on Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onNavigate('spot', bookingData)} 
          className="rounded-full text-[#0A2540]"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-[#0A2540] flex-1">Confirm Booking</h3>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4 font-semibold">Booking Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#06B6D4] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#0A2540]">{event.name || "Event"}</p>
                    <p className="text-sm text-gray-600">{venue.name || "Venue"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#06B6D4] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#0A2540]">
                      {event.date ? new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) : "Date TBD"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.time || "Time TBD"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#06B6D4] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#0A2540]">{spot.address || "Parking location"}</p>
                    <p className="text-sm text-gray-600">
                      {spot.distance ? (
                        spot.distance / 1000 < 1 
                          ? `${Math.round(spot.distance)} m from venue`
                          : `${(spot.distance / 1000).toFixed(2)} km from venue`
                      ) : "Near venue"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking spot</span>
                  <span className="text-[#0A2540]">${spotPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-[#0A2540]">${serviceFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-[#0A2540] font-semibold">Total</span>
                  <span className="text-xl text-[#0A2540] font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4 font-semibold">Payment Method</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber} 
                      onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="pl-10 text-[#0A2540] bg-white"
                      maxLength={16}
                    />
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      value={expiry}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        setExpiry(val);
                      }}
                      className="text-[#0A2540] bg-white"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3} 
                      className="text-[#0A2540] bg-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={cardholderName}
                    onChange={e => setCardholderName(e.target.value)}
                    className="text-[#0A2540] bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 text-sm text-gray-600 justify-center mb-6">
            <Shield className="w-4 h-4 text-[#06B6D4]" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-6 disabled:opacity-50"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" /> 
                Confirm & Pay ${totalPrice.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}