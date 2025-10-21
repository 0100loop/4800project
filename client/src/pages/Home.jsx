import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home(){
  const [q, setQ] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking..."); 
  const nav = useNavigate();

  useEffect(()=>{
    fetch("/api/health")
      .then(r=>r.ok?r.json():Promise.reject(new Error("health failed")))
      .then(d=>setBackendStatus(`${d.message} | MongoDB: ${d.mongoDB}`))
      .catch(e=>setBackendStatus(`Error: ${e.message}`));
  },[]);

  async function search(){
    const r = await fetch(`/api/events?venue=${encodeURIComponent(q)}&range=week`);
    if(!r.ok){ alert("Event search failed"); return; }
    const events = await r.json();
    nav("/map", { state:{ q, events }});
  }

  return (
    <div className="container" style={{padding:"24px 0"}}>
      <div className="card" style={{display:"grid",gap:16}}>
        <h1 style={{margin:0}}>Find parking for your event</h1>
        <p className="muted">Search a stadium or artist, then reserve a nearby driveway.</p>
        <input className="input" placeholder="Search stadium or event (e.g., SoFi Stadium)" value={q} onChange={e=>setQ(e.target.value)} />
        <div className="row">
          <button className="btn" onClick={search}>Search events</button>
          <Link className="btn btn--ghost" to="/map">Open map</Link>
        </div>
      </div>

      <div style={{marginTop:20,color:"#9FB6C7"}}>Backend health: {backendStatus}</div>
    </div>
  );
}
