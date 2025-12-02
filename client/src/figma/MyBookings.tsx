import { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { apiFetch } from "../lib/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface MyBookingsProps {
  onNavigate: (view: string, data?: any) => void;
}

interface Booking {
  _id: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  totalPrice: number;
}

export default function MyBookings({ onNavigate }: MyBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
<<<<<<< HEAD
        setLoading(true);
        setError(null);
        
        const data = await apiFetch('http://localhost:5000/api/bookings', {
          method: 'GET',
          auth: true,
        });
        
        console.log('Bookings loaded:', data);
        setBookings(data || []);
        setLoading(false);
=======
        const data = await apiFetch("/api/bookings", { auth: true });
        const arr: Booking[] = Array.isArray(data) ? data : [];

        const now = new Date();

        setUpcoming(
          arr.filter((b) => new Date(b.eventDate).getTime() >= now.getTime())
        );

        setPast(
          arr.filter((b) => new Date(b.eventDate).getTime() < now.getTime())
        );

        setBookings(arr);
>>>>>>> c02acb4143d731f40199193eae81173d0c596861
      } catch (err) {
        console.error("Error loading bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="flex justify-center mb-4">
        <Calendar className="w-14 h-14 text-gray-400" />
      </div>

      <p className="text-xl text-gray-600 mb-2">No upcoming bookings</p>
      <p className="text-gray-500 mb-8">Find parking for your next event</p>

      <Button
        className="bg-[#06B6D4] text-white hover:bg-[#0891B2] px-8 py-3"
        onClick={() => onNavigate("home")}
      >
        Browse Events
      </Button>
    </div>
  );

  const BookingCard = (b: Booking) => (
    <Card
      key={b._id}
      className="p-5 mb-4 shadow-sm border cursor-pointer hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-[#0A2540]">{b.eventName}</h3>
      <p className="text-gray-600">{b.eventVenue}</p>
      <p className="text-gray-600 mb-3">
        {new Date(b.eventDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <p className="text-[#0A2540] font-medium">
        Total Paid: ${b.totalPrice.toFixed(2)}
      </p>
    </Card>
  );

<<<<<<< HEAD
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
=======
  if (loading) {
    return <div className="min-h-screen p-10 text-center">Loading…</div>;
  }
>>>>>>> c02acb4143d731f40199193eae81173d0c596861

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="bg-[#0A2540] text-white px-6 py-10 pb-12">
        <div className="flex items-center justify-between mb-6">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => onNavigate("home")}
          />
          <h2 className="text-xl font-semibold flex-1 text-center">
            My Bookings
          </h2>
          <div className="w-5" />
        </div>

        <div className="flex bg-white/10 rounded-lg p-1 gap-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-2 rounded-md ${
              activeTab === "upcoming"
                ? "bg-white text-[#0A2540]"
                : "text-cyan-100"
            }`}
          >
            Upcoming ({upcoming.length})
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2 rounded-md ${
              activeTab === "past"
                ? "bg-white text-[#0A2540]"
                : "text-cyan-100"
            }`}
          >
            Past ({past.length})
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="px-6 py-10 max-w-2xl mx-auto">
        {activeTab === "upcoming" &&
          (upcoming.length > 0
            ? upcoming.map(BookingCard)
            : <EmptyState />)}

        {activeTab === "past" &&
          (past.length > 0
            ? past.map(BookingCard)
            : <EmptyState />)}
      </div>
    </div>
  );
}


