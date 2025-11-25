import AuthSuccess from "./pages/Auth/AuthSuccess";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { HomeScreen } from "./pages/HomeScreen";
import { MapView } from "./pages/MapView";
import { HostDashboard } from "./figma/HostDashboard";
import { BookingConfirmation } from "./pages/BookingConfirmation";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

export default function App(){
  const [view, setView] = useState("home");
  const [data, setData] = useState(null);
  const onNavigate = (v, d)=>{ setView(v); setData(d||null); };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
<Route path="/auth-success" element={<AuthSuccess />} />

      <Route path="*" element={
        <>
          <div className="nav">
            <div className="nav-inner container">
              <a href="#" className="brand" onClick={(e)=>{e.preventDefault(); onNavigate('home');}}>ParkIt</a>
              <div className="linkbar">
                <a href="#" className="pill" onClick={(e)=>{e.preventDefault(); onNavigate('home');}}>Home</a>
                <a href="#" className="pill" onClick={(e)=>{e.preventDefault(); onNavigate('map');}}>Map</a>
                <a href="#" className="pill" onClick={(e)=>{e.preventDefault(); onNavigate('host');}}>Host</a>
              </div>
            </div>
          </div>



          {view==="home" && <HomeScreen onNavigate={onNavigate} />}
          {view==="map" && <MapView onNavigate={onNavigate} viewData={data} />}
          {view==="host" && <HostDashboard onNavigate={onNavigate} />}
          {view==="book" && <BookingConfirmation onNavigate={onNavigate} bookingData={data} />}
          {view==="spot" && <BookingConfirmation onNavigate={onNavigate} bookingData={{total:15}} /> }
        </>
      } />
    </Routes>
  );
}