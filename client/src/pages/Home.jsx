import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";

export default function Home() {
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  /* Load Events from backend */
  async function loadEvents(p) {
    try {
      setLoading(true);
      const res = await fetch(`/api/events?page=${p}`);
      const data = await res.json();

      const normalized = data.map((e) => ({
        ...e,
        spotsAvailable: Math.floor(Math.random() * 40) + 5,
        priceFrom: Math.floor(Math.random() * 30) + 10,
      }));

      setFeaturedEvents((prev) => [...prev, ...normalized]);
    } catch (err) {
      console.error("Event load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents(page);
  }, [page]);

  async function runSearch() {
    if (!searchQuery.trim()) return;
    const r = await fetch(
      `/api/events?venue=${encodeURIComponent(searchQuery)}&range=week`
    );
    if (!r.ok) return alert("Search failed");
    const events = await r.json();
    nav("/map", { state: { q: searchQuery, events } });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* TITLE */}
      <h1 className="text-5xl font-bold text-[#0A2540] mb-3">
        Find Your Perfect Spot
      </h1>
      <p className="text-gray-600 mb-8">
        Discover convenient parking near stadiums, theaters, and events
      </p>

      {/* SEARCH */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-10 text-lg text-gray-700"
          placeholder="Search for venues or events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setSearchQuery("")}
          >
            <X />
          </button>
        )}

        <button
          onClick={runSearch}
          className="mt-4 w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-lg py-3 font-semibold"
        >
          Search Events
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div
          onClick={() => nav("/map")}
          className="p-8 border-2 border-gray-200 rounded-xl text-center hover:shadow-md cursor-pointer"
        >
          <MapPin className="w-8 h-8 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-lg font-medium text-[#0A2540]">Map View</h3>
        </div>

        <div
          onClick={() => nav("/host")}
          className="p-8 border-2 border-gray-200 rounded-xl text-center hover:shadow-md cursor-pointer"
        >
          <TrendingUp className="w-8 h-8 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-lg font-medium text-[#0A2540]">Host</h3>
        </div>

        <div
          onClick={() => nav("/bookings")}
          className="p-8 border-2 border-gray-200 rounded-xl text-center hover:shadow-md cursor-pointer"
        >
          <Calendar className="w-8 h-8 text-[#06B6D4] mx-auto mb-3" />
          <h3 className="text-lg font-medium text-[#0A2540]">My Bookings</h3>
        </div>
      </div>

      {/* FEATURED EVENTS */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#0A2540]">
          Featured Events
        </h2>
        <button className="text-[#06B6D4] font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {featuredEvents.map((e) => (
          <div
            key={e.id || e._id}
            onClick={() => nav("/map", { state: { event: e } })}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer transition"
          >
            <div className="relative h-56">
              <img
                src={e.image}
                className="w-full h-full object-cover"
                alt={e.name}
              />

              <span className="absolute top-4 right-4 bg-[#06B6D4] text-white px-3 py-1 text-sm rounded-lg">
                {e.spotsAvailable} spots
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-semibold text-[#0A2540] mb-2">
                {e.name}
              </h3>

              <div className="flex text-gray-600 items-center gap-2">
                <MapPin className="w-4 h-4" />
                {e.venue}
              </div>

              <div className="flex text-gray-600 items-center gap-2 mt-2">
                <Calendar className="w-4 h-4" />
                {e.date}
              </div>

              <div className="flex justify-between mt-4 items-center">
                <span className="text-[#0A2540]">
                  From <span className="text-2xl">${e.priceFrom}</span>
                </span>

                <button className="bg-[#06B6D4] text-white px-4 py-2 rounded-lg hover:bg-[#0891B2]">
                  Find Parking
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      <div className="flex justify-center mb-16">
        <button
          disabled={loading}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-3 bg-[#06B6D4] text-white rounded-lg disabled:opacity-50 hover:bg-[#0891B2]"
        >
          {loading ? "Loading..." : "Load More Venues"}
        </button>
      </div>

      {/* CTA — EXACT FIGMA */}
      <div className="w-full flex justify-center mt-16 mb-20">
        <div className="w-full md:w-[900px] bg-gradient-to-r from-[#0A2540] to-[#134E6F] rounded-xl p-8 flex items-center justify-between shadow-lg">
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Become a Host
            </h3>
            <p className="text-cyan-100 mb-4">
              Turn your driveway into extra income on event days
            </p>
            <button
              onClick={() => nav("/host")}
              className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-6 py-2 rounded-lg font-medium"
            >
              List Your Spot
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1630350215986-ddaf3124eeb1?q=80&w=400"
            alt="Driveway"
            className="w-28 h-28 rounded-lg object-cover hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}
