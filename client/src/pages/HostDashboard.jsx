import { useState } from "react";

export default function HostDashboard(){
  const [msg, setMsg] = useState("");
  const API = import.meta.env.VITE_API_URL || "/api";

  async function onSubmit(e){
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      title: f.get("title"),
      price: Number(f.get("price")),
      distance: "5 min walk",
      amenities: { bathroom: !!f.get("bathroom"), ev: !!f.get("ev"), shuttle: !!f.get("shuttle") },
      tailgateFriendly: !!f.get("tailgate"),
      overnight: !!f.get("overnight"),
      location: { type:"Point", coordinates:[ Number(f.get("lng")), Number(f.get("lat")) ] }
    };
    try{
      const r = await fetch(`${API}/spots`, {method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body)});
      const j = await r.json();
      if(!r.ok) throw new Error(j.error || "Failed");
      setMsg("Spot added ✔️"); e.currentTarget.reset();
    }catch(err){ setMsg("Error: " + err.message) }
  }

  return (
    <div className="container" style={{padding:"18px 0 30px"}}>
      <div className="panel" style={{maxWidth:760, margin:"0 auto"}}>
        <h2 style={{marginTop:0}}>Host Dashboard</h2>
        <p style={{color:"var(--muted)"}}>List your driveway, mark tailgate-friendly, set overnight options.</p>
        <form onSubmit={onSubmit} className="row">
          <input className="pill" name="title" placeholder="Title" required />
          <input className="pill" name="price" type="number" placeholder="Price (USD)" required />
          <input className="pill" name="lat" type="number" step="0.000001" placeholder="Latitude" required />
          <input className="pill" name="lng" type="number" step="0.000001" placeholder="Longitude" required />
          <label className="badge"><input type="checkbox" name="bathroom" />&nbsp;Bathroom</label>
          <label className="badge"><input type="checkbox" name="ev" />&nbsp;EV</label>
          <label className="badge"><input type="checkbox" name="shuttle" />&nbsp;Shuttle</label>
          <label className="badge"><input type="checkbox" name="tailgate" />&nbsp;Tailgate-friendly</label>
          <label className="badge"><input type="checkbox" name="overnight" />&nbsp;Overnight</label>
          <button className="cta">Add Spot</button>
        </form>
        {msg && <p style={{marginTop:10}}>{msg}</p>}
      </div>
    </div>
  );
}
