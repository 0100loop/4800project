import "./Profile.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");

  const saveChanges = () => {
    if (name) localStorage.setItem("name", name);
    if (email) localStorage.setItem("email", email);
    if (avatar) localStorage.setItem("avatar", avatar);
    navigate("/profile");
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result.toString());
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate("/profile")}>
        ← Back
      </button>

      <div className="profile-header-card">
        <div className="avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt="avatar" className="avatar-img" />
          ) : (
            <div className="avatar-circle">
              {name ? name.slice(0, 2).toUpperCase() : "U"}
            </div>
          )}
        </div>

        <input type="file" accept="image/*" onChange={onAvatarChange} />

        <div style={{ marginTop: "16px" }}>
          <input
            className="input-field"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="edit-btn" onClick={saveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

