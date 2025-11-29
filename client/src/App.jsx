import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

// All these files use NAMED exports, NOT default exports:
import { LoginPage } from "./pages/LoginPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { MapView } from "./pages/MapView.tsx";
import { SpotDetails } from "./pages/SpotDetails.tsx";
import { BookingFlow } from "./pages/BookingFlow.tsx";
import  HostDashboard  from "./pages/HostDashboard.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { MyBookings } from "./pages/MyBookings.tsx";

// AuthSuccess IS a default export
import AuthSuccess from "./pages/AuthSuccess.jsx";

export default function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup", "/auth-success"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  // Google OAuth redirect handler
  const handleGoogleLogin = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role) window.location.href = "/";
  };

  // Navigation handler
  const navigate = (view, data) => {
    if (view === "map") window.location.href = "/map";
    if (view === "spot") window.location.href = `/spot/${data}`;
    if (view === "booking") window.location.href = `/booking/${data}`;
    if (view === "host") window.location.href = "/host";
    if (view === "bookings") window.location.href = "/bookings";
    if (view === "profile") window.location.href = "/profile";
  };

  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/auth-success"
          element={<AuthSuccess onLogin={handleGoogleLogin} />}
        />

        {/* Main pages */}
        <Route path="/" element={<HomePage onNavigate={navigate} />} />
        <Route
          path="/map"
          element={<MapView onNavigate={navigate} selectedVenue={selectedVenue} />}
        />
        <Route path="/spot/:id" element={<SpotDetails onNavigate={navigate} />} />
        <Route path="/booking/:id" element={<BookingFlow onNavigate={navigate} />} />

        {/* Host pages */}
        <Route path="/host" element={<HostDashboard onNavigate={navigate} />} />
        <Route
          path="/bookings"
          element={<MyBookings onNavigate={navigate} userType="guest" />}
        />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage onNavigate={navigate} />} />
      </Routes>
    </>
  );
}

