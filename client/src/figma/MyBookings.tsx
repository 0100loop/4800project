import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Navigation, MessageCircle, QrCode, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card, CardContent } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';

interface MyBookingsProps {
  onNavigate: (view: string, data?: any) => void;
}

export function MyBookings({ onNavigate }: MyBookingsProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingBookings = [
    {
      id: 'BK-2025-001',
      eventName: 'Lakers vs Warriors',
      venue: 'Crypto.com Arena',
      address: '1234 Sunset Blvd, Los Angeles, CA',
      date: 'Oct 15, 2025',
      time: '6:00 PM',
      bookingDate: 'Oct 12, 2025',
      hostName: 'Sarah M.',
      distance: '0.3 mi',
      price: 25,
      status: 'confirmed',
      safetyScore: 4.9,
      addOns: ['Bathroom Access', 'EV Charging'],
      parkingSpot: 'Driveway - Space A',
    },
    {
      id: 'BK-2025-002',
      eventName: 'Taylor Swift Concert',
      venue: 'SoFi Stadium',
      address: '5678 Stadium Way, Inglewood, CA',
      date: 'Oct 22, 2025',
      time: '7:30 PM',
      bookingDate: 'Oct 10, 2025',
      hostName: 'John D.',
      distance: '0.5 mi',
      price: 35,
      status: 'confirmed',
      safetyScore: 5.0,
      addOns: ['Shuttle Service', 'Tailgate Friendly'],
      parkingSpot: 'Garage - Spot 2',
    },
  ];

  const pastBookings = [
    {
      id: 'BK-2025-003',
      eventName: 'Dodgers vs Giants',
      venue: 'Dodger Stadium',
      address: '910 Elysian Park Ave, Los Angeles, CA',
      date: 'Sep 28, 2025',
      time: '7:00 PM',
      bookingDate: 'Sep 25, 2025',
      hostName: 'Maria G.',
      distance: '0.4 mi',
      price: 20,
      status: 'completed',
      safetyScore: 4.8,
      addOns: ['Bathroom Access'],
      parkingSpot: 'Driveway',
    },
    {
      id: 'BK-2025-004',
      eventName: 'USC Football Game',
      venue: 'Los Angeles Memorial Coliseum',
      address: '3911 Figueroa St, Los Angeles, CA',
      date: 'Sep 15, 2025',
      time: '2:00 PM',
      bookingDate: 'Sep 10, 2025',
      hostName: 'Robert K.',
      distance: '0.6 mi',
      price: 18,
      status: 'completed',
      safetyScore: 4.7,
      addOns: [],
      parkingSpot: 'Street Parking',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-0">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const renderBookingCard = (booking: typeof upcomingBookings[0]) => (
    <Card key={booking.id} className="overflow-hidden border-gray-200">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A2540] to-[#134E6F] p-4 text-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-white mb-1">{booking.eventName}</h3>
              <div className="flex items-center text-cyan-100">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{booking.venue}</span>
              </div>
            </div>
            {getStatusBadge(booking.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-cyan-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {booking.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {booking.time}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 space-y-4">
          {/* Booking ID */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Booking ID:</span>
            <span className="text-[#0A2540]">{booking.id}</span>
          </div>

          {/* Location & Host */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#06B6D4] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#0A2540]">{booking.parkingSpot}</p>
                <p className="text-xs text-gray-600">{booking.address}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-600">Host: </span>
                <span className="text-[#0A2540]">{booking.hostName}</span>
                <span className="text-gray-500"> • {booking.distance} from venue</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-[#0A2540]">{booking.safetyScore}</span>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          {booking.addOns.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {booking.addOns.map((addon, idx) => (
                <Badge key={idx} variant="outline" className="text-xs border-[#06B6D4] text-[#06B6D4]">
                  {addon}
                </Badge>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center text-[#0A2540]">
              <DollarSign className="w-5 h-5" />
              <span className="text-xl">{booking.price}</span>
            </div>
            <span className="text-sm text-gray-600">Paid on {booking.bookingDate}</span>
          </div>

          {/* Actions */}
          {booking.status === 'confirmed' && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-3 border-gray-300"
              >
                <Navigation className="w-4 h-4" />
                <span className="text-xs">Directions</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-3 border-gray-300"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">Contact</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-3 border-gray-300"
              >
                <QrCode className="w-4 h-4" />
                <span className="text-xs">QR Code</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="text-white hover:bg-white/10 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white">My Bookings</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 ${
                activeTab === 'upcoming'
                  ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              Upcoming ({upcomingBookings.length})
            </Button>
            <Button
              onClick={() => setActiveTab('past')}
              className={`flex-1 ${
                activeTab === 'past'
                  ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              Past ({pastBookings.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {activeTab === 'upcoming' && (
          <>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => renderBookingCard(booking))
            ) : (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No upcoming bookings</p>
                <p className="text-sm text-gray-500 mb-4">
                  Find parking for your next event
                </p>
                <Button
                  onClick={() => onNavigate('home')}
                  className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                >
                  Browse Events
                </Button>
              </Card>
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {pastBookings.length > 0 ? (
              pastBookings.map((booking) => renderBookingCard(booking))
            ) : (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No past bookings</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
