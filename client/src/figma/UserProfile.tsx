import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Camera,
  Settings,
  Shield,
  Award,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { apiFetch } from "../lib/api";

interface UserProfileProps {
  onNavigate: (view: string, data?: any) => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================================
     LOAD USER FROM BACKEND
  ================================= */
  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/auth/me", { auth: true });
        const u = res.user;

        localStorage.setItem("userName", u.name);
        localStorage.setItem("userEmail", u.email);
        if (u.avatar) localStorage.setItem("userAvatar", u.avatar);

        setUser(u);
      } catch {
        setUser({
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          phone: "",
          location: "",
          avatar:
            localStorage.getItem("userAvatar") ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
          memberSince: new Date().toISOString().substring(0, 10),
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  /* ================================
     SAVE PROFILE
  ================================= */
  async function saveChanges() {
    try {
      const res = await apiFetch("/api/auth/me", {
        method: "PUT",
        auth: true,
        body: {
          name: user.name,
          phone: user.phone,
          location: user.location,
        },
      });

      setUser(res.user);
      localStorage.setItem("userName", res.user.name);
      if (res.user.avatar)
        localStorage.setItem("userAvatar", res.user.avatar);

      setIsEditing(false);
    } catch {
      alert("Failed to save changes");
    }
  }

  return (
    <div className="w-full min-h-screen">
      {/* ===================== HEADER ===================== */}
      <div className="bg-[#0A2540] text-white px-6 py-10">
        <div className="flex items-center justify-between">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => onNavigate("home")}
          />
          <h2 className="text-xl font-semibold flex-1 text-center">
            Profile
          </h2>
          <Settings className="opacity-80" />
        </div>

        {/* AVATAR + NAME */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative">
            <img
              src={user.avatar}
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow"
            />
            <div className="absolute bottom-0 right-0 bg-[#06B6D4] p-2 rounded-full cursor-pointer">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className="text-2xl mt-4">{user.name}</h2>
          <p className="text-gray-300 text-sm">
            Member since {user.memberSince}
          </p>
        </div>
      </div>

      {/* ===================== BODY ===================== */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ================= PERSONAL INFO CARD ================= */}
        <Card className="p-6 shadow-sm rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#0A2540]">
              Personal Information
            </h3>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {/* VIEW MODE */}
          {!isEditing && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail className="text-[#06B6D4]" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-[#0A2540]">{user.email}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 ml-auto">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-[#06B6D4]" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-[#0A2540]">
                    {user.phone || "Add phone number"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-[#06B6D4]" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-[#0A2540]">
                    {user.location || "Add your location"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <input
                  className="border p-3 rounded-lg w-full"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <input
                  className="border p-3 rounded-lg w-full"
                  value={user.phone || ""}
                  onChange={(e) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <input
                  className="border p-3 rounded-lg w-full"
                  value={user.location || ""}
                  onChange={(e) =>
                    setUser({ ...user, location: e.target.value })
                  }
                />
              </div>

              <Button
                className="bg-[#06B6D4] text-white w-full mt-4"
                onClick={saveChanges}
              >
                Save Changes
              </Button>
            </div>
          )}
        </Card>

        {/* ================= QUICK ACTIONS ================= */}
        <Card className="p-6 shadow-sm rounded-xl">
          <h3 className="text-xl font-semibold text-[#0A2540] mb-4">
            Quick Actions
          </h3>
<div
  className="flex items-center gap-3 cursor-pointer"
  onClick={() => onNavigate("payment-methods")}
>
  <CreditCard className="text-[#06B6D4]" />
  <p className="text-[#0A2540]">Payment Methods</p>
</div>


          <div className="space-y-4">

            {/* View Bookings */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate("bookings")}
            >
              <Award className="text-[#06B6D4]" />
              <p className="text-[#0A2540]">My Bookings</p>
            </div>

            {/* Become a Host */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate("host")}
            >
              <Shield className="text-[#06B6D4]" />
              <p className="text-[#0A2540]">Become a Host</p>
            </div>

            {/* Notifications */}
            <div className="flex items-center gap-3 cursor-pointer">
              <Bell className="text-[#06B6D4]" />
              <p className="text-[#0A2540]">Notifications</p>
            </div>

            {/* ⭐ PAYMENT METHODS (NEW) */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate("payment-methods")}
            >
              <CreditCard className="text-[#06B6D4]" />
              <p className="text-[#0A2540]">Payment Methods</p>
            </div>

            {/* Logout */}
            <div
              className="flex items-center gap-3 cursor-pointer text-red-600"
              onClick={() => {
                localStorage.clear();
                onNavigate("home");
              }}
            >
              <LogOut className="text-red-600" />
              <p>Log Out</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
