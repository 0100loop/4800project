import AuthSuccess from "./pages/Auth/AuthSuccess";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import ForgotPassword from "./pages/Auth/ForgotPassword";

import { HomeScreen } from "./figma/HomeScreen";
import { MapView } from "./figma/MapView";
import { HostDashboard } from "./figma/HostDashboard";
import { BookingConfirmation } from "./figma/BookingConfirmation";
import MyBookings from "./figma/MyBookings";
import { UserProfile } from "./figma/UserProfile";
import { SpotManagement } from "./figma/SpotManagement";
import { CreateListing } from "./figma/CreateListing";
import { BookingFlow } from "./pages/BookingFlow.tsx";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { apiFetch } from "./lib/api";

// ⭐ Import correct JSX version
import PaymentMethodsPage from "./pages/PaymentMethodsPage.jsx";

export default function App() {
  const location = useLocation();

  /* Hide navbar for login & signup */
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
      {showNavbar && <Navbar onNavigate={onNavigate} />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <>
                {/* HOME */}
                {view === "home" && <HomeScreen onNavigate={onNavigate} />}

                {/* MAP */}
                {view === "map" && (
                  <MapView onNavigate={onNavigate} viewData={data} />
                )}

                {/* HOST DASHBOARD */}
                {view === "host" && (
                  <HostDashboard
                    onNavigate={onNavigate}
                    apiFetch={apiFetch}
                  />
                )}

                {/* USER BOOKINGS */}
                {view === "bookings" && (
                  <MyBookings
                    onNavigate={onNavigate}
                    apiFetch={apiFetch}
                  />
                )}

                {/* USER PROFILE */}
                {view === "profile" && (
                  <UserProfile onNavigate={onNavigate} />
                )}

                {/* SPOT MANAGEMENT */}
                {view === "spotManagement" && (
                  <SpotManagement
                    onNavigate={onNavigate}
                    spotData={data}
                    apiFetch={apiFetch}
                  />
                )}

                {/* CREATE LISTING */}
                {view === "createListing" && (
                  <CreateListing
                    spotId={data?.spotId || data?.id}
                    onBack={() => onNavigate("spotManagement", data)}
                    onNavigate={onNavigate}
                  />
                )}

                {/* BOOKING CONFIRMATION */}
                {view === "book" && (
                  <BookingConfirmation
                    onNavigate={onNavigate}
                    bookingData={data}
                  />
                )}

                {/* BOOKING FLOW */}
                {view === "bookingFlow" && (
                  <BookingFlow
                    onNavigate={onNavigate}
                    listingId={data?.listingId}
                    spotId={data?.spotId}
                    listing={data?.listing}
                    returnTo={data?.returnTo}
                  />
                )}

                {/* ⭐ PAYMENT METHODS PAGE */}
                {view === "payment-methods" && (
                  <PaymentMethodsPage onNavigate={onNavigate} />
                )}
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
