import {
  ArrowLeft,
  Mail,
  Phone,
  Car,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

interface ProfilePageProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="text-[#0A2540]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <p className="text-[#0A2540] font-medium">Profile</p>
            <p className="text-xs text-gray-600">Manage your account</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* PROFILE CARD */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">

            {/* Profile Picture / Initials */}
            <div className="w-20 h-20 rounded-full bg-[#06B6D4] flex items-center justify-center text-white text-3xl font-semibold">
              JD
            </div>

            <div className="flex-1">
              <h2 className="text-2xl text-[#0A2540] font-semibold">John Doe</h2>
              <p className="text-gray-600">Member since Nov 2024</p>
            </div>
          </div>

          <Button className="w-full" variant="outline">
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Card>

        {/* ACCOUNT INFORMATION */}
        <Card className="p-4 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-1">
            Account Information
          </h3>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#06B6D4]" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-[#0A2540] font-medium">
                john.doe@example.com
              </p>
            </div>
          </div>

          <Separator />

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[#06B6D4]" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-[#0A2540] font-medium">
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          <Separator />

          {/* Saved Vehicles */}
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-[#06B6D4]" />
            <div>
              <p className="text-sm text-gray-500">Saved Vehicles</p>
              <p className="text-[#0A2540] font-medium">2 vehicles</p>
            </div>
          </div>
        </Card>

        {/* NOTIFICATIONS */}
        <Card className="p-4 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-1">
            Notifications
          </h3>

          {/* Booking Updates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#06B6D4]" />
              <div>
                <p className="text-[#0A2540] font-medium">
                  Booking Updates
                </p>
                <p className="text-xs text-gray-600">
                  Confirmations & changes
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Promotional Offers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#06B6D4]" />
              <div>
                <p className="text-[#0A2540] font-medium">
                  Promotional Offers
                </p>
                <p className="text-xs text-gray-600">
                  Deals & discounts
                </p>
              </div>
            </div>
            <Switch />
          </div>
        </Card>

        {/* QUICK ACTIONS */}
        <div className="space-y-2">

          <Button variant="outline" className="w-full justify-start" size="lg">
            <CreditCard className="w-5 h-5 mr-3 text-[#06B6D4]" />
            Payment Methods
          </Button>

          <Button variant="outline" className="w-full justify-start" size="lg">
            <Shield className="w-5 h-5 mr-3 text-[#06B6D4]" />
            Privacy & Security
          </Button>

          <Button variant="outline" className="w-full justify-start" size="lg">
            <HelpCircle className="w-5 h-5 mr-3 text-[#06B6D4]" />
            Help & Support
          </Button>
        </div>

        {/* LOGOUT */}
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
          size="lg"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
