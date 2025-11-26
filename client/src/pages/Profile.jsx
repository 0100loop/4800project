import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "John Doe";
  const email = localStorage.getItem("email") || "john.doe@example.com";
  const avatar = localStorage.getItem("avatar");
  const memberSince = "Nov 2024";

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* Top card */}
      <div className="profile-header-card">
        <div className="avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt="avatar" className="avatar-img" />
          ) : (
            <div className="avatar-circle">
              {name.split(" ").map((n) => n[0]).join("")}
            </div>
          )}
        </div>

        <h2>{name}</h2>
        <p className="member-text">Member since {memberSince}</p>

        <button
          className="edit-btn"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>
      </div>

      {/* Account info */}
      <div className="card">
        <h3>Account Information</h3>
        <p><strong>Email:</strong> {email}</p>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3>Notifications</h3>
        <div className="toggle-row">
          <span>Booking Updates</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
        <div className="toggle-row">
          <span>Promotional Offers</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Payment methods */}
      <div className="card">
        <h3>Payment Methods</h3>
        <p style={{ color: "gray" }}>Add or manage payment methods</p>
      </div>
    </div>
  );
}



