import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

export default function Profile({ onNavigate, onLogout }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editing, setEditing] = useState(false);

  // Load profile on mount
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  const updateProfile = () => {
    fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile),
    })
      .then((r) => r.json())
      .then(() => {
        alert("Profile updated!");
        setEditing(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
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
            <div className="text-[#0A2540]">Profile</div>
            <div className="text-xs text-gray-600">Manage your account</div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-[#06B6D4] rounded-full flex items-center justify-center">
              <span className="text-white text-3xl">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <div className="flex-1">
              {editing ? (
                <>
                  <input
                    className="border p-2 w-full rounded mb-2"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                  <input
                    className="border p-2 w-full rounded"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl text-[#0A2540] mb-1">
                    {profile.name || "Loading..."}
                  </h2>
                  <p className="text-gray-600">Member since Nov 2024</p>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <Button className="w-full" onClick={updateProfile}>
              Save Changes
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Card>

        {/* Account Info */}
        <Card className="p-4">
          <h3 className="text-lg text-[#0A2540] mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5 text-[#06B6D4]" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-[#0A2540]">{profile.email}</div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 text-[#06B6D4]" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Phone</div>
                <div className="text-[#0A2540]">
                  {profile.phone || "Not provided"}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3 text-gray-600">
              <Car className="w-5 h-5 text-[#06B6D4]" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Saved Vehicles</div>
                <div className="text-[#0A2540]">2 vehicles</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-4">
          <h3 className="text-lg text-[#0A2540] mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#06B6D4]" />
                <div>
                  <div className="text-[#0A2540]">Booking Updates</div>
                  <div className="text-xs text-gray-600">
                    Get notified about booking confirmations
                  </div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#06B6D4]" />
                <div>
                  <div className="text-[#0A2540]">Promotional Offers</div>
                  <div className="text-xs text-gray-600">
                    Receive special deals and discounts
                  </div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-2">
          {/* ⭐ Updated Payment Methods button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            size="lg"
            onClick={() => onNavigate("payment-methods")}
          >
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

        {/* Logout */}
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
