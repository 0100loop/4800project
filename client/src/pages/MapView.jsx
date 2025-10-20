import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MapView(){
  const [spots, setSpots] = useState([]);
  const API = import.meta.env.VITE_API_URL || "/api";
  useEffect(()=>{ fetch(`${API}/spots`).then(r=>r.json()).then(setSpots).catch(()=>setSpots([])); },[]);
  return (
    <div className="container" style={{padding:"18px 0 30px"}}>
      <div className="row" style={{marginBottom:12}}>
        <Link to="/" className="pill">← Back</Link>
        <span className="badge">Spots: {spots.length}</span>
      </div>
      <div className="panel">
        <h3 className="panel-title">Interactive map (coming soon)</h3>
        <div className="mapbox"></div>
      </div>
    </div>
  );
}
