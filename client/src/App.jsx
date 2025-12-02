import AuthSuccess from "./pages/Auth/AuthSuccess";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

import { HomeScreen } from "./figma/HomeScreen";
import { MapView } from "./figma/MapView";
import { HostDashboard } from "./figma/HostDashboard";
import { BookingConfirmation } from "./figma/BookingConfirmation";
import MyBookings from "./figma/MyBookings";         // ✔ FIXED DEFAULT IMPORT
import { UserProfile } from "./figma/UserProfile";
import { SpotManagement } from "./figma/SpotManagement";
import { CreateListing } from "./figma/CreateListing";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { apiFetch } from "./lib/api";

export default function App() {
  const location = useLocation();

  // Hide navbar on login/signup/auth-success
  const hideNavbarRoutes = ["/login", "/signup", "/auth-success"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  // Old navigation system inside the protected area
  const [view, setView] = useState("home");
  const [data, setData] = useState(null);

  const onNavigate = (v, d) => {
    setView(v);
    setData(d || null);
  };

  return (
    <>
      {showNavbar && <Navbar onNavigate={onNavigate} />}

      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* MAIN APP ROUTE (protected) */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <>
                {view === "home" && <HomeScreen onNavigate={onNavigate} />}

                {view === "map" && (
                  <MapView onNavigate={onNavigate} viewData={data} />
                )}

                {view === "host" && (
                  <HostDashboard onNavigate={onNavigate} apiFetch={apiFetch} />
                )}

                {view === "bookings" && (
                  <MyBookings onNavigate={onNavigate} apiFetch={apiFetch} />
                )}

                {view === "profile" && (
                  <UserProfile onNavigate={onNavigate} />
                )}

                {view === "spotManagement" && (
                  <SpotManagement
                    onNavigate={onNavigate}
                    spotData={data}
                    apiFetch={apiFetch}
                  />
                )}

                {view === "createListing" && (
                  <CreateListing
                    spotId={data?.spotId || data?.id}
                    onBack={() => onNavigate("spotManagement", data)}
                  />
                )}

                {view === "book" && (
                  <BookingConfirmation
                    onNavigate={onNavigate}
                    bookingData={data}
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

