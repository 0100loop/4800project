import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Star, Shield, CreditCard, Bell, Settings, LogOut, Edit2, Camera, Award } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card, CardContent } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';
import { Input } from './ui/input.tsx';

interface UserProfileProps {
  onNavigate: (view: string, data?: any) => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Los Angeles, CA',
    memberSince: 'January 2024',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    safetyScore: 4.8,
    totalBookings: 24,
    totalHostings: 0,
    verifications: {
      email: true,
      phone: true,
      identity: false,
    },
    stats: {
      bookings: 24,
      reviews: 18,
      savedSpots: 12,
    }
  };

  const paymentMethods = [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '09/25',
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      {/* Header */}
      <div className="bg-[#0A2540] text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('home')}
                className="text-white hover:bg-white/10 -ml-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-white">Profile</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center overflow-hidden border-4 border-white/20">
                <img 
                  src={userData.profileImage} 
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#06B6D4] rounded-full flex items-center justify-center border-2 border-[#0A2540]">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-white mb-1">{userData.name}</h2>
              <p className="text-cyan-100 text-sm mb-3">Member since {userData.memberSince}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white">{userData.safetyScore}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl text-[#0A2540] mb-1">{userData.stats.bookings}</div>
              <div className="text-sm text-gray-600">Bookings</div>
            </CardContent>
          </Card>
          <Card className="text-center border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl text-[#0A2540] mb-1">{userData.stats.reviews}</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </CardContent>
          </Card>
          <Card className="text-center border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl text-[#0A2540] mb-1">{userData.stats.savedSpots}</div>
              <div className="text-sm text-gray-600">Saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0A2540]">Personal Information</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-[#06B6D4] hover:text-[#0891B2]"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  {isEditing ? (
                    <Input value={userData.email} className="h-8" />
                  ) : (
                    <p className="text-[#0A2540]">{userData.email}</p>
                  )}
                  {userData.verifications.email && (
                    <Badge className="mt-1 bg-green-100 text-green-800 border-0 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Phone</p>
                  {isEditing ? (
                    <Input value={userData.phone} className="h-8" />
                  ) : (
                    <p className="text-[#0A2540]">{userData.phone}</p>
                  )}
                  {userData.verifications.phone && (
                    <Badge className="mt-1 bg-green-100 text-green-800 border-0 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Location</p>
                  {isEditing ? (
                    <Input value={userData.location} className="h-8" />
                  ) : (
                    <p className="text-[#0A2540]">{userData.location}</p>
                  )}
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verifications */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-[#0A2540] mb-4">Verifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#06B6D4]" />
                  <div>
                    <p className="text-[#0A2540]">Identity Verification</p>
                    <p className="text-xs text-gray-600">Enhance your safety score</p>
                  </div>
                </div>
                {userData.verifications.identity ? (
                  <Badge className="bg-green-100 text-green-800 border-0">Verified</Badge>
                ) : (
                  <Button size="sm" variant="outline" className="text-[#06B6D4] border-[#06B6D4]">
                    Verify
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0A2540]">Payment Methods</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#06B6D4] hover:text-[#0891B2]"
              >
                + Add
              </Button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0A2540] to-[#134E6F] rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[#0A2540]">{method.type} •••• {method.last4}</p>
                      <p className="text-xs text-gray-600">Expires {method.expiry}</p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="outline" className="text-xs border-[#06B6D4] text-[#06B6D4]">
                      Default
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-[#0A2540] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={() => onNavigate('bookings')}
                variant="ghost"
                className="w-full justify-start text-[#0A2540] hover:bg-gray-50"
              >
                <Award className="w-5 h-5 mr-3" />
                View My Bookings
              </Button>
              <Button
                onClick={() => onNavigate('host')}
                variant="ghost"
                className="w-full justify-start text-[#0A2540] hover:bg-gray-50"
              >
                <MapPin className="w-5 h-5 mr-3" />
                Become a Host
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-[#0A2540] hover:bg-gray-50"
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-[#0A2540] hover:bg-gray-50"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings & Privacy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Become a Host CTA */}
        {userData.totalHostings === 0 && (
          <Card className="bg-gradient-to-r from-[#0A2540] to-[#134E6F] text-white border-0">
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 text-[#06B6D4] mx-auto mb-3" />
              <h3 className="text-white mb-2">Start Earning with ParkIt</h3>
              <p className="text-cyan-100 mb-4">
                List your parking spot and earn money on event days
              </p>
              <Button
                onClick={() => onNavigate('host')}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
              >
                Become a Host
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
