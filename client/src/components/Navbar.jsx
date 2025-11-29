import { FiUser } from "react-icons/fi";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    onNavigate("home");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="#" className="brand" onClick={e => { e.preventDefault(); onNavigate("home"); }}>
          ParkIt
        </a>
      </div>

      <div className="navbar-center">
        <a href="#" className="nav-link" onClick={e => { e.preventDefault(); onNavigate("home"); }}>Home</a>
        <a href="#" className="nav-link" onClick={e => { e.preventDefault(); onNavigate("map"); }}>Map</a>
        <a href="#" className="nav-link" onClick={e => { e.preventDefault(); onNavigate("host"); }}>Host</a>
      </div>

      <div className="navbar-right">
        <div className="profile-wrapper" onClick={() => setOpen(!open)}>
          {avatar ? <img src={avatar} className="navbar-avatar" alt="avatar" /> : <FiUser size={22} color="white" />}
        </div>

        {open && (
          <div className="profile-menu">
            {name && <div className="menu-name">👋 {name}</div>}
            <div className="menu-item" onClick={() => { setOpen(false); onNavigate("profile"); }}>View Profile</div>
            <div className="menu-item logout" onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
}
