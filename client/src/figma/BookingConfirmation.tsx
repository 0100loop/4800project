import { Check, MapPin, Calendar, Clock, DollarSign, CreditCard, Shield, ChevronLeft, User, Mail, Phone } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card, CardContent } from './ui/card.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Separator } from './ui/separator.tsx';
import { Badge } from './ui/badge.tsx';
import { useState } from 'react';

interface BookingConfirmationProps {
  onNavigate: (view: string, data?: any) => void;
  bookingData?: any;
}

export function BookingConfirmation({ onNavigate, bookingData }: BookingConfirmationProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-10-15');
  const [selectedTime, setSelectedTime] = useState('17:00');
  const [eventName, setEventName] = useState('Lakers vs Warriors');
  const [venueName, setVenueName] = useState('Crypto.com Arena');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');

  const handleConfirmBooking = () => {
    setIsConfirmed(true);
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
            <p className="text-gray-800">Your parking spot has been reserved</p>
          </div>

          <Card className="border-[#06B6D4]/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center py-4 bg-[#06B6D4]/5 rounded-lg">
                  <p className="text-sm text-gray-800 mb-1">Confirmation Code</p>
                  <p className="text-2xl text-[#0A2540]">PK-2025-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-[#0A2540] mb-3">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Event</span>
                      <span className="text-[#0A2540]">{eventName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Venue</span>
                      <span className="text-[#0A2540]">{venueName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Date</span>
                      <span className="text-[#0A2540]">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Arrival Time</span>
                      <span className="text-[#0A2540]">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Host</span>
                      <span className="text-[#0A2540]">{bookingData?.spot?.host || 'Mike T.'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Total Paid</span>
                      <span className="text-[#0A2540]">${((bookingData?.total || 15) + 2.50).toFixed(2)}</span>
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
                    <strong>Important:</strong> A confirmation email has been sent to {email || 'your email address'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => onNavigate('bookings')}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => onNavigate('home')}
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('spot', bookingData)}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-[#0A2540] flex-1">Complete Your Booking</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Event Details */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4">Event Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventName" className="text-[#0A2540]">Event Name</Label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., Lakers vs Warriors"
                    className="text-[#0A2540]"
                  />
                </div>

                <div>
                  <Label htmlFor="venueName" className="text-[#0A2540]">Venue</Label>
                  <Input
                    id="venueName"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g., Crypto.com Arena"
                    className="text-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate" className="text-[#0A2540]">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="text-[#0A2540]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="arrivalTime" className="text-[#0A2540]">Arrival Time</Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="text-[#0A2540]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-[#0A2540]">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 text-[#0A2540]"
                    />
                    <Mail className="w-4 h-4 text-gray-800 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <p className="text-xs text-gray-800 mt-1">Confirmation will be sent to this email</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-[#0A2540]">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 text-[#0A2540]"
                    />
                    <Phone className="w-4 h-4 text-gray-800 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <p className="text-xs text-gray-800 mt-1">Host may contact you if needed</p>
                </div>

                <div>
                  <Label htmlFor="vehicle" className="text-[#0A2540]">Vehicle Information (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="vehicle"
                      placeholder="e.g., Black Honda Accord, ABC-1234"
                      value={vehicleInfo}
                      onChange={(e) => setVehicleInfo(e.target.value)}
                      className="pl-10 text-[#0A2540]"
                    />
                    <User className="w-4 h-4 text-gray-800 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#06B6D4] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[#0A2540]">{bookingData?.spot?.distance || '0.3 mi'} from venue</p>
                    <p className="text-sm text-gray-800">{bookingData?.spot?.walkTime || '6 min'} walk • Hosted by {bookingData?.spot?.host || 'Mike T.'}</p>
                  </div>
                </div>

                {bookingData?.spot?.amenities && bookingData.spot.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {bookingData.spot.amenities.map((amenity: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs border-[#06B6D4] text-[#06B6D4]">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800">Parking spot</span>
                  <span className="text-[#0A2540]">${(bookingData?.spot?.price || 15).toFixed(2)}</span>
                </div>
                {bookingData?.addons?.includes('bathroom') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800">Bathroom Access</span>
                    <span className="text-[#0A2540]">$3.00</span>
                  </div>
                )}
                {bookingData?.addons?.includes('ev') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800">EV Charging</span>
                    <span className="text-[#0A2540]">$8.00</span>
                  </div>
                )}
                {bookingData?.addons?.includes('shuttle') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800">Shuttle Service</span>
                    <span className="text-[#0A2540]">$5.00</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800">Service fee</span>
                  <span className="text-[#0A2540]">$2.50</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between">
                  <span className="text-[#0A2540]">Total</span>
                  <span className="text-xl text-[#0A2540]">${((bookingData?.total || 15) + 2.50).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-[#0A2540] mb-4">Payment Method</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-[#0A2540]">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="pl-10 text-[#0A2540]"
                    />
                    <CreditCard className="w-4 h-4 text-gray-800 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-[#0A2540]">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" className="text-[#0A2540]" />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-[#0A2540]">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" maxLength={3} className="text-[#0A2540]" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="text-[#0A2540]">Cardholder Name</Label>
                  <Input id="name" placeholder="John Doe" className="text-[#0A2540]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-sm text-gray-800 justify-center mb-6">
            <Shield className="w-4 h-4 text-[#06B6D4]" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleConfirmBooking}
            disabled={!email || !phone || !cardNumber}
            className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Confirm & Pay ${((bookingData?.total || 15) + 2.50).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
