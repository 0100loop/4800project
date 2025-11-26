import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">ParkIt</Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/map" className="nav-link">Map</Link>
        <Link to="/host" className="nav-link">Host</Link>
      </div>

      <div className="navbar-right">
        <div
          className="profile-wrapper"
          onClick={() => setOpen(!open)}
        >
          {avatar ? (
            <img src={avatar} className="navbar-avatar" />
          ) : (
            <FiUser size={22} color="white" />
          )}
        </div>

        {open && (
          <div className="profile-menu">
            {name && <p className="menu-name">👋 {name}</p>}

            <p
              className="menu-item"
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            >
              View Profile
            </p>

            <p
              className="menu-item logout"
              onClick={handleLogout}
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}

