import AuthSuccess from "./pages/Auth/AuthSuccess";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

import { HomeScreen } from "./figma/HomeScreen";
import { MapView } from "./pages/MapView";
import { HostDashboard } from "./figma/HostDashboard";
import { BookingConfirmation } from "./figma/BookingConfirmation";
import { MyBookings } from "./figma/MyBookings";
import { UserProfile } from "./figma/UserProfile";
import { SpotManagement } from "./figma/SpotManagement";
import {CreateListing} from "./figma/CreateListing";
import { apiFetch } from "./lib/api.js";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import Navbar from "./components/Navbar";

import ProtectedRoute from './components/ProtectedRoute'; // adjust path if needed

export default function App() {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbarRoutes = ["/login", "/signup", "/auth-success"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  // Local navigation state (your old system)
  const [view, setView] = useState("home");
  const [data, setData] = useState(null);

const onNavigate = (v, d) => {
  setView(v);
  setData(d || null);
};

  return (
    <>
      {/* Navbar */}
      {showNavbar && <Navbar onNavigate={onNavigate} />}

      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* Main view-based navigation */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
            <>
              {view === "home" && <HomeScreen onNavigate={onNavigate} />}
              {view === "map" && <MapView onNavigate={onNavigate} viewData={data} />}
              {view === "host" && <HostDashboard onNavigate={onNavigate} />}
              {view === "book" && <BookingConfirmation onNavigate={onNavigate} bookingData={data} />}
              {view === "spot" && (
                <BookingConfirmation
                  onNavigate={onNavigate}
                  bookingData={data} 
                />
              )}
              {view === "bookings" && (
                <MyBookings 
                  onNavigate={onNavigate}
                  apiFetch={apiFetch}  
                />
              )}
              {view === "profile" && <UserProfile onNavigate={onNavigate} />}
              {view === "spotManagement" && (
                <SpotManagement 
                  onNavigate={onNavigate} 
                  spotData={data?.spotData || data}
                  apiFetch={apiFetch}
                />
              )}
              {view === "createListing" && (
                <CreateListing 
                  spotId={data?.spotId || data?.id}  // Handle both structures
                  onBack={() => onNavigate("spotManagement", data?.spotData || data)}  // Pass correct data back
                />
              )}
            </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
