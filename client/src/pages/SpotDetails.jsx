import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function SpotDetails(){
  const { id } = useParams();
  const [spot, setSpot] = useState(null);

  useEffect(()=>{
    // pull all then find one (simpler than adding /listings/:id route now)
    navigator.geolocation.getCurrentPosition(async p=>{
      const r = await fetch(`/api/listings?lat=${p.coords.latitude}&lng=${p.coords.longitude}&maxKm=1000`);
      const arr = await r.json();
      setSpot(arr.find(x=>x._id===id));
    }, async ()=>{
      const r = await fetch(`/api/listings?lat=34.013&lng=-118.287&maxKm=1000`);
      const arr = await r.json();
      setSpot(arr.find(x=>x._id===id));
    });
  },[id]);

  if(!spot) return <div className="container">Loading…</div>;

  const amenities = [
    spot.bathroom && "Bathroom access",
    spot.evCharging && "EV charging",
    spot.shuttle && "Shuttle available",
    spot.tailgateFriendly && "Tailgate-friendly",
    spot.overnightAllowed && "Overnight OK"
  ].filter(Boolean);

  return (
    <div className="container" style={{padding:"18px 0 28px"}}>
      <div className="card" style={{display:"grid", gap:12}}>
        <h2 style={{marginTop:0}}>{spot.title}</h2>
        <div>{spot.address}</div>
        <div><b>${spot.pricePerHour}/hr</b></div>
        <div>Safety score: <span className="badge badge--ok">{spot.safetyScore || "A"}</span></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {amenities.length ? amenities.map(a=><span key={a} className="pill">{a}</span>): <span className="pill">No add-ons</span>}
        </div>
        <div className="row" style={{marginTop:8}}>
          <Link className="btn" to={`/book/${spot._id}`}>Reserve</Link>
          <Link className="btn btn--ghost" to="/map">Back to map</Link>
        </div>
      </div>
    </div>
  );
}
