import { FiUser } from "react-icons/fi";
import { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#06B6D4] rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-map-pin w-6 h-6 text-white"
              aria-hidden="true"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>

          <span className="text-2xl text-[#0A2540]">ParkIt</span>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium size-9 rounded-md text-[#0A2540] hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user w-5 h-5"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="profile-menu">
            {name && <div className="menu-name">👋 {name}</div>}
            <div
              className="menu-item"
              onClick={() => {
                setOpen(false);
                onNavigate("profile");
              }}
            >
              View Profile
            </div>
            <div className="menu-item logout" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
