import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home(){
  const [spots, setSpots] = useState([]);
  const [status, setStatus] = useState("ok");
  const API = import.meta.env.VITE_API_URL || "/api";

  useEffect(() => {
    fetch(`${API}/spots`).then(r=>r.json()).then(setSpots).catch(()=>setSpots([]));
    fetch(`${API}/health`).then(r=>r.json()).then(()=>setStatus("ok")).catch(()=>setStatus("offline"));
  }, []);

  return (
    <>
      {/* Search + health row */}
      <section style={{padding:"18px 0"}}>
        <div className="container">
          <div className="search">
            <span>🔎</span>
            <input placeholder="Search venues, events, or neighborhoods..." />
            <button className="cta">List your driveway</button>
          </div>
          <div style={{marginTop:8, color:"var(--muted)", display:"flex", alignItems:"center", gap:8}}>
            <span>🩺</span> <small>Backend health: {status}</small>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section>
        <div className="container grid grid-3">
          {/* Left: Map preview panel */}
          <div className="panel">
            <h3 className="panel-title">Available spots near you</h3>
            <div className="mapbox">
              <div className="pin pin--1">$28</div>
              <div className="pin pin--2">$19</div>
              <div className="pin pin--3">$24</div>
            </div>
            <div style={{marginTop:10, color:"var(--muted)", display:"flex", gap:8}}>
              <span>🗺️</span>
              <small>Map preview (static) — integration ready</small>
            </div>
          </div>

          {/* Right: Spot list */}
          <aside>
            {(spots.length? spots : [
              { _id:"1", title:"Driveway • 2 min from West Bay Stadium", price:28, distance:"4 min walk", amenities:{ev:true,bathroom:true}, tailgateFriendly:true, safetyScore:92 },
              { _id:"2", title:"Garage spot • 5 min from Grand Theater", price:19, distance:"7 min walk", amenities:{ev:true, shuttle:true}, overnight:true, safetyScore:88 },
              { _id:"3", title:"Side yard • Tailgate-friendly by Arena", price:24, distance:"6 min walk", amenities:{bathroom:true, shuttle:true}, tailgateFriendly:true, safetyScore:85 },
            ]).map((s)=>(
              <div key={s._id} className="card">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div style={{maxWidth:"70%"}}>
                    <h4>{s.title}</h4>
                    <div className="row" style={{marginTop:6}}>
                      {s.amenities?.ev && <span className="badge">⚡ EV</span>}
                      {s.amenities?.bathroom && <span className="badge">🚻 Bathroom</span>}
                      {s.amenities?.shuttle && <span className="badge">🚌 Shuttle</span>}
                      {s.tailgateFriendly && <span className="badge">🎉 Tailgate</span>}
                      {s.overnight && <span className="badge">🌙 Overnight</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="price">${s.price}</div>
                    <small style={{color:"var(--muted)"}}>{s.distance || ""}</small>
                    <div style={{marginTop:6}}><span className="badge badge--ok">Safety {s.safetyScore || "90"}</span></div>
                  </div>
                </div>
                <div style={{marginTop:10, display:"flex", justifyContent:"flex-end"}}>
                  <Link to={`/spot/${s._id}`} className="pill">Book</Link>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Food & drinks */}
      <section style={{padding:"16px 0 24px"}}>
        <div className="container panel">
          <h3 className="panel-title">Nearby food & drinks</h3>
          <div className="row">
            {[
              "Bay Bites Food Hall","Cornerstone Taproom","Slice & Smoke Pizza","Luna Coffee Bar",
              "Taqueria del Sol","Neptune Oyster","Harbor Dogs","Pier Pints","Maki Box"
            ].map(tag => <span key={tag} className="pill">{tag}</span>)}
          </div>
        </div>
      </section>
    </>
  );
}
