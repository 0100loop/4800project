import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { MapView } from "./pages/MapView";
import { SpotDetails } from "./pages/SpotDetails";
import { BookingFlow } from "./pages/BookingFlow";
import { HostDashboard } from "./pages/HostDashboard";
import { ProfilePage } from "./pages/ProfilePage";
import { MyBookings } from "./pages/MyBookings";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentCancel } from "./pages/PaymentCancel";
import AuthSuccess from "./pages/AuthSuccess.jsx";


export type ViewName =
  | "login"
  | "home"
  | "map"
  | "spot"
  | "booking"
  | "host"
  | "bookings"
  | "profile";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"guest" | "host">("guest");
  const [view, setView] = useState<ViewName>("login");
  const [selectedSpotId, setSelectedSpotId] = useState<number | undefined>();
  const [selectedVenue, setSelectedVenue] = useState<any>();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  if (pathname === "/payments/success") {
    return <PaymentSuccess />;
  }

  if (pathname === "/payments/cancel") {
    return <PaymentCancel />;
  }

  // -------------------------------------------
  // RESTORE SESSION FROM LOCALSTORAGE ON RELOAD
  // -------------------------------------------
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(window.location.search);
    const deepLinkView = params.get("view") as ViewName | null;

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        const role = user.role === "host" ? "host" : "guest";

        setUserType(role);
        setIsLoggedIn(true);
        setView(deepLinkView || "home");
        if (deepLinkView) {
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch {
        // invalid data: clear it
        localStorage.clear();
      }
    }
  }, []);

  // -------------------------------------------
  // CALLED WHEN LOGINPAGE COMPLETES LOGIN/SIGNUP
  // -------------------------------------------
  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (token && user && user.role) {
      const role = user.role === "host" ? "host" : "guest";
      setUserType(role);
      setIsLoggedIn(true);
      setView("home");
    }
  };

  // -------------------------------------------
  // LOGOUT — CLEAR TOKEN + RETURN TO LOGIN PAGE
  // -------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setView("login");
  };

  // -------------------------------------------
  // INTERNAL NAVIGATION FOR APP
  // -------------------------------------------
  const navigate = (next: ViewName, data?: any) => {
    setView(next);

    if ((next === "spot" || next === "booking") && typeof data === "number") {
      setSelectedSpotId(data);
    }

    if (next === "map" && data) {
      setSelectedVenue(data);
    }
  };

  // -------------------------------------------
  // IF NOT LOGGED IN → SHOW LOGIN PAGE
  // -------------------------------------------
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // -------------------------------------------
  // MAIN APP ROUTER
  // -------------------------------------------
  return (
    <div className="w-full h-screen overflow-hidden">

      {view === "home" && (
        <HomePage onNavigate={navigate} userType={userType} />
      )}

      {view === "map" && (
        <MapView onNavigate={navigate} selectedVenue={selectedVenue} />
      )}

      {view === "spot" && selectedSpotId && (
        <SpotDetails spotId={selectedSpotId} onNavigate={navigate} />
      )}

      {view === "booking" && selectedSpotId && (
        <BookingFlow spotId={selectedSpotId} onNavigate={navigate} />
      )}

      {view === "host" && (
        <HostDashboard onNavigate={navigate} />
      )}

      {view === "bookings" && (
        <MyBookings onNavigate={navigate} userType={userType} />
      )}

      {view === "profile" && (
        <ProfilePage onNavigate={navigate} onLogout={handleLogout} />
      )}

    </div>
  );
}
