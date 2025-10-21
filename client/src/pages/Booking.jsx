import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Booking(){
  const { id } = useParams();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    const now = new Date();
    const later = new Date(now.getTime()+2*3600000);
    setStart(now.toISOString().slice(0,16));
    setEnd(later.toISOString().slice(0,16));
  },[]);

  async function book(){
    setMsg("");
    const token = localStorage.getItem("token");
    if(!token){ setMsg("Please login first."); return; }
    const r = await fetch("/api/bookings", {
      method:"POST",
      headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
      body: JSON.stringify({ spotId:id, start: new Date(start), end: new Date(end) })
    });
    const data = await r.json();
    if(!r.ok){ setMsg(data.error || "Booking failed"); return; }
    setMsg(`✅ ${data.message} • Payment ID: ${data.booking.paymentId}`);
  }

  return (
    <div className="container" style={{padding:"18px 0 28px"}}>
      <div className="card" style={{display:"grid", gap:12}}>
        <h2 style={{marginTop:0}}>Complete your reservation</h2>
        <label>Start</label>
        <input className="input" type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
        <label>End</label>
        <input className="input" type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
        <button className="btn" onClick={book}>Pay & Reserve</button>
        {msg && <div style={{color:"#9FE2F0"}}>{msg}</div>}
      </div>
    </div>
  );
}
