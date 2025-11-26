import AuthSuccess from "./pages/Auth/AuthSuccess";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

import { HomeScreen } from "./pages/HomeScreen";
import { MapView } from "./pages/MapView";
import { HostDashboard } from "./figma/HostDashboard";
import { BookingConfirmation } from "./pages/BookingConfirmation";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

import Navbar from "./components/Navbar";

export default function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/auth-success"];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  const [view, setView] = useState("home");
  const [data, setData] = useState(null);
  const onNavigate = (v, d) => {
    setView(v);
    setData(d || null);
  };

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Auth-only screens (NO NAVBAR) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* Profile screens */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Main app screens */}
        <Route
          path="*"
          element={
            <>
              {view === "home" && <HomeScreen onNavigate={onNavigate} />}
              {view === "map" && <MapView onNavigate={onNavigate} viewData={data} />}
              {view === "host" && <HostDashboard onNavigate={onNavigate} />}
              {view === "book" && (
                <BookingConfirmation onNavigate={onNavigate} bookingData={data} />
              )}
              {view === "spot" && (
                <BookingConfirmation
                  onNavigate={onNavigate}
                  bookingData={{ total: 15 }}
                />
              )}
            </>
          }
        />
      </Routes>
    </>
  );
}

