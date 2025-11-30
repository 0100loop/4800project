import { useState } from 'react';
import { ChevronLeft, Plus, Calendar, MapPin, Users, DollarSign, Clock, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Badge } from './ui/badge.tsx';
import { Separator } from './ui/separator.tsx';

interface SpotManagementProps {
  onNavigate: (view: string, data?: any) => void;
  spotData?: any;
}

export function SpotManagement({ onNavigate, spotData }: SpotManagementProps) {
  const [showAddListing, setShowAddListing] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');
  
  // Add Listing Form State
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableSpaces, setAvailableSpaces] = useState('1');
  const [customPrice, setCustomPrice] = useState('');

  // Mock spot data
  const spot = spotData || {
    id: 1,
    address: '1234 Oak Street, Los Angeles, CA 90015',
    price: 15,
    description: 'Spacious driveway with easy access',
    amenities: ['EV Charging', 'Bathroom Access'],
    spaces: 2,
    totalBookings: 12,
    totalEarnings: 245,
    rating: 4.8,
    reviewCount: 8
  };

  // Mock listings (available time slots)
  const [listings, setListings] = useState([
    {
      id: 1,
      eventName: 'Lakers vs Warriors',
      date: '2025-12-15',
      startTime: '17:00',
      endTime: '23:00',
      availableSpaces: 2,
      bookedSpaces: 1,
      price: 15,
      status: 'active'
    },
    {
      id: 2,
      eventName: 'Clippers vs Celtics',
      date: '2025-12-18',
      startTime: '18:30',
      endTime: '23:30',
      availableSpaces: 2,
      bookedSpaces: 2,
      price: 15,
      status: 'full'
    },
    {
      id: 3,
      eventName: 'Concert - Taylor Swift',
      date: '2025-12-22',
      startTime: '19:00',
      endTime: '00:00',
      availableSpaces: 2,
      bookedSpaces: 0,
      price: 20,
      status: 'active'
    }
  ]);

  // Mock bookings
  const bookings = [
    {
      id: 1,
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@email.com',
      guestPhone: '+1 (555) 123-4567',
      eventName: 'Lakers vs Warriors',
      date: '2025-12-15',
      arrivalTime: '17:00',
      vehicleInfo: 'Black Honda Accord, ABC-1234',
      addons: ['Bathroom Access'],
      totalPaid: 18,
      confirmationCode: 'PK-2025-1547',
      status: 'confirmed'
    },
    {
      id: 2,
      guestName: 'Mike Rodriguez',
      guestEmail: 'mike.r@email.com',
      guestPhone: '+1 (555) 987-6543',
      eventName: 'Clippers vs Celtics',
      date: '2025-12-18',
      arrivalTime: '18:30',
      vehicleInfo: 'Red Tesla Model 3',
      addons: ['EV Charging'],
      totalPaid: 23,
      confirmationCode: 'PK-2025-1892',
      status: 'confirmed'
    },
    {
      id: 3,
      guestName: 'Emma Lee',
      guestEmail: 'emma.l@email.com',
      guestPhone: '+1 (555) 456-7890',
      eventName: 'Clippers vs Celtics',
      date: '2025-12-18',
      arrivalTime: '18:00',
      vehicleInfo: 'White Toyota Camry',
      addons: [],
      totalPaid: 15,
      confirmationCode: 'PK-2025-1893',
      status: 'confirmed'
    }
  ];

  const handleAddListing = () => {
    if (!eventName || !eventDate || !startTime || !endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const newListing = {
      id: listings.length + 1,
      eventName,
      date: eventDate,
      startTime,
      endTime,
      availableSpaces: parseInt(availableSpaces),
      bookedSpaces: 0,
      price: customPrice ? parseFloat(customPrice) : spot.price,
      status: 'active'
    };

    setListings([...listings, newListing]);
    
    // Reset form
    setEventName('');
    setEventDate('');
    setStartTime('');
    setEndTime('');
    setAvailableSpaces('1');
    setCustomPrice('');
    setShowAddListing(false);
    
    alert('Listing created successfully!');
  };

  const handleDeleteListing = (listingId: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(l => l.id !== listingId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time?: string) => {
  if (!time || !time.includes(":")) return "Invalid time";

  const [hours, minutes] = time.split(":");

  const hour = Number(hours);
  if (isNaN(hour)) return "Invalid time";

  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${ampm}`;
};


  if (showAddListing) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-4 py-4 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddListing(false)}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-white">Create Listing</h2>
              <p className="text-cyan-100 text-sm">Add available time slot for this spot</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#0A2540]">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  placeholder="e.g., Lakers vs Warriors"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">When guests can arrive</p>
                </div>
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">When guests must leave</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#0A2540]">Availability & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="availableSpaces">Available Spaces</Label>
                <Input
                  id="availableSpaces"
                  type="number"
                  value={availableSpaces}
                  onChange={(e) => setAvailableSpaces(e.target.value)}
                  min="1"
                  max={spot.spaces}
                />
                <p className="text-xs text-gray-500 mt-1">Max: {spot.spaces} spaces for this spot</p>
              </div>

              <div>
                <Label htmlFor="customPrice">Price per Space (Optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="customPrice"
                    type="number"
                    placeholder={spot.price.toString()}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="pl-7"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to use default price (${spot.price})
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Potential Earnings:</strong> ${((customPrice || spot.price) * parseInt(availableSpaces || '1')).toFixed(2)}
                  <br />
                  <span className="text-xs">If all spaces are booked</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddListing(false)}
              className="flex-1 md:flex-none md:px-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddListing}
              disabled={!eventName || !eventDate || !startTime || !endTime}
              className="flex-1 md:flex-none md:px-8 bg-[#06B6D4] hover:bg-[#0891B2] text-white disabled:opacity-50"
            >
              Create Listing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('host')}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-white">Manage Spot</h2>
              <p className="text-cyan-100 text-sm flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {spot.address}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
            >
              <Edit2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-3 text-center">
                <DollarSign className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
                <div className="text-xl text-white">${spot.totalEarnings}</div>
                <p className="text-xs text-cyan-100">Earnings</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-3 text-center">
                <Users className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
                <div className="text-xl text-white">{spot.totalBookings}</div>
                <p className="text-xs text-cyan-100">Bookings</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-3 text-center">
                <Calendar className="w-5 h-5 text-[#06B6D4] mx-auto mb-1" />
                <div className="text-xl text-white">{listings.length}</div>
                <p className="text-xs text-cyan-100">Listings</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'listings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('listings')}
            className={activeTab === 'listings' ? 'bg-[#06B6D4] hover:bg-[#0891B2]' : ''}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Listings ({listings.length})
          </Button>
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bookings')}
            className={activeTab === 'bookings' ? 'bg-[#06B6D4] hover:bg-[#0891B2]' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Bookings ({bookings.length})
          </Button>
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0A2540]">Available Time Slots</h3>
              <Button
                onClick={() => setShowAddListing(true)}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </div>

            <div className="space-y-3">
              {listings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 flex items-center justify-center flex-shrink-0 ${
                        listing.status === 'full' 
                          ? 'bg-gray-200' 
                          : 'bg-gradient-to-br from-[#0A2540] to-[#134E6F]'
                      }`}>
                        <Calendar className={`w-6 h-6 ${
                          listing.status === 'full' ? 'text-gray-500' : 'text-[#06B6D4]'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-[#0A2540]">{listing.eventName}</h4>
                            <p className="text-sm text-gray-600">{formatDate(listing.date)}</p>
                          </div>
                          <Badge className={
                            listing.status === 'full'
                              ? 'bg-gray-200 text-gray-700 border-0'
                              : 'bg-green-100 text-green-700 border-0'
                          }>
                            {listing.status === 'full' ? 'Full' : 'Available'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="text-[#0A2540]">{formatTime(listing.startTime)} - {formatTime(listing.endTime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="text-[#0A2540]">${listing.price}/space</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Booked</p>
                            <p className="text-[#0A2540]">{listing.bookedSpaces}/{listing.availableSpaces}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Earnings</p>
                            <p className="text-[#0A2540]">${(listing.bookedSpaces * listing.price).toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {listings.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No listings yet</p>
                    <Button
                      onClick={() => setShowAddListing(true)}
                      className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Listing
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h3 className="text-[#0A2540] mb-4">Guest Bookings</h3>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#06B6D4]/10 rounded-full p-3 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-[#06B6D4]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h4 className="text-[#0A2540] mb-1">{booking.guestName}</h4>
                            <p className="text-sm text-gray-600">{booking.eventName}</p>
                            <p className="text-sm text-gray-500">{formatDate(booking.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg text-[#0A2540] mb-1">${booking.totalPaid}</p>
                            <Badge className="bg-green-100 text-green-700 border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {booking.status}
                            </Badge>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Contact</p>
                            <p className="text-[#0A2540]">{booking.guestEmail}</p>
                            <p className="text-[#0A2540]">{booking.guestPhone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Arrival Time</p>
                            <p className="text-[#0A2540] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(booking.arrivalTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Vehicle</p>
                            <p className="text-[#0A2540]">{booking.vehicleInfo}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Confirmation Code</p>
                            <p className="text-[#0A2540] font-mono">{booking.confirmationCode}</p>
                          </div>
                        </div>

                        {booking.addons.length > 0 && (
                          <div className="mt-3">
                            <p className="text-gray-600 text-sm mb-1">Add-ons:</p>
                            <div className="flex flex-wrap gap-2">
                              {booking.addons.map((addon, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-[#06B6D4] text-[#06B6D4]">
                                  {addon}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {bookings.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No bookings yet</p>
                    <p className="text-sm text-gray-500 mt-1">Bookings will appear here once guests reserve your listings</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
