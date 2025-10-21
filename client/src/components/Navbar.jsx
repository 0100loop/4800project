import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="header">
      <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px"}}>
        <div className="brand"><Link to="/" className="navlink" style={{color:"#e6f0ff",textDecoration:"none"}}>ParkIt</Link></div>
        <div className="nav">
          <Link to="/" className="navlink">Home</Link>
          <Link to="/map" className="navlink">Map</Link>
          <Link to="/host" className="navlink">Host</Link>
          <Link to="/safety" className="navlink">Safety</Link>
          <Link to="/login" className="navlink">Login</Link>
          <Link to="/signup" className="btn" style={{textDecoration:"none"}}>Create account</Link>
        </div>
      </div>
    </nav>
  );
}
