import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Navigation, MessageCircle, QrCode, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card, CardContent } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';

interface MyBookingsProps {
  onNavigate: (view: string, data?: any) => void;
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export function MyBookings({ onNavigate, apiFetch }: MyBookingsProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiFetch('http://localhost:5000/api/bookings', {
          method: 'GET',
          auth: true,
        });
        
        console.log('Bookings loaded:', data);
        setBookings(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Separate bookings into upcoming and past
  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= now);
  const pastBookings = bookings.filter(b => new Date(b.date) < now);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderBookingCard = (booking: any) => (
    <Card key={booking._id || booking.id} className="overflow-hidden border-gray-200">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A2540] to-[#134E6F] p-4 text-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-white mb-1">{booking.eventName || 'Parking Reservation'}</h3>
              <div className="flex items-center text-cyan-100">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{booking.venue || booking.address || 'Location'}</span>
              </div>
            </div>
            {getStatusBadge(booking.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-cyan-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(booking.date)}
            </div>
            {booking.arrivalTime && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {booking.arrivalTime}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-4 space-y-4">
          {/* Booking ID */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Booking ID:</span>
            <span className="text-[#0A2540]">{booking._id?.slice(-8) || 'N/A'}</span>
          </div>

          {/* Contact Info */}
          {booking.email && (
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-[#0A2540]">{booking.email}</span>
              </div>
              {booking.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-[#0A2540]">{booking.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Vehicle Info */}
          {booking.vehicleInfo && (
            <div className="text-sm">
              <span className="text-gray-600">Vehicle: </span>
              <span className="text-[#0A2540]">{booking.vehicleInfo}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center text-[#0A2540]">
              <DollarSign className="w-5 h-5" />
              <span className="text-xl">{booking.totalPaid || booking.totalPrice || 0}</span>
            </div>
            <span className="text-sm text-gray-600">
              Paid on {formatDate(booking.createdAt || booking.bookingDate || booking.date)}
            </span>
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
            <h1 className="text-white text-3xl">My Bookings</h1>
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
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Loading bookings...</p>
          </Card>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-600">{error}</p>
          </Card>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}