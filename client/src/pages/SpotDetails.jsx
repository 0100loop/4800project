import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SpotDetails(){
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const API = import.meta.env.VITE_API_URL || "/api";

  useEffect(()=>{
    fetch(`${API}/spots/${id}`).then(r=>r.json()).then(setSpot).catch(()=>setSpot(null));
  },[id]);

  const s = spot || { title:"Driveway • 2 min from West Bay Stadium", price:28, distance:"4 min walk", amenities:{ev:true,bathroom:true,shuttle:false}, tailgateFriendly:true, safetyScore:92 };

  return (
    <div className="container" style={{padding:"18px 0 30px"}}>
      <div className="row" style={{marginBottom:12}}>
        <Link to="/map" className="pill">← Back to map</Link>
        <span className="badge badge--ok">Safety {s.safetyScore}</span>
      </div>
      <div className="panel">
        <h2 style={{marginTop:0}}>{s.title}</h2>
        <div className="row" style={{margin:"8px 0"}}>
          <span className="badge">${s.price}</span>
          <span className="badge">{s.distance}</span>
          {s.amenities?.ev && <span className="badge">⚡ EV</span>}
          {s.amenities?.bathroom && <span className="badge">🚻 Bathroom</span>}
          {s.amenities?.shuttle && <span className="badge">🚌 Shuttle</span>}
          {s.tailgateFriendly && <span className="badge">🎉 Tailgate</span>}
        </div>
        <Link to="/book" className="cta" style={{display:"inline-block", marginTop:8}}>Reserve Spot</Link>
      </div>
    </div>
  );
}
