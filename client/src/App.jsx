import { useState } from "react";
import "./index.css";
import { HomeScreen } from "./figma/HomeScreen";
import { MapView } from "./figma/MapView";
import { HostDashboard } from "./figma/HostDashboard";
import { BookingConfirmation } from "./figma/BookingConfirmation";
/*import {LoginScreen} from "./figma/Login";*/

export default function App(){
  const [view, setView] = useState("home");
  const [data, setData] = useState(null);
  const onNavigate = (v, d)=>{ setView(v); setData(d||null); };

  return (
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
      {/*view === "home" && <LoginScreen onNavigate={onNavigate} />*/}
    </>
  );
}
