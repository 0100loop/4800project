import { Link } from "react-router-dom";

export default function Booking(){
  return (
    <div className="container" style={{padding:"20px 0 30px"}}>
      <div className="panel" style={{maxWidth:560, margin:"0 auto", textAlign:"center"}}>
        <h2 style={{marginTop:0}}>Confirm Reservation</h2>
        <p style={{color:"var(--muted)"}}>Spot #1 — <strong>$20/day</strong></p>
        <button className="cta" style={{marginTop:8}}>Confirm & Pay</button>
        <div className="badge badge--ok" style={{marginTop:12}}>Payment successful! 🎉</div>
        <Link to="/" className="pill" style={{marginTop:14, display:"inline-block"}}>Back to Home</Link>
      </div>
    </div>
  );
}
