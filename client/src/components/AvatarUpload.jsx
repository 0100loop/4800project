import { useState } from "react";

export default function AvatarUpload() {
  const [image, setImage] = useState(localStorage.getItem("avatar") || null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      localStorage.setItem("avatar", reader.result);
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="avatar-upload">
      <img 
        src={image || "/default-avatar.png"}
        className="avatar-preview"
      />

      <input 
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />
    </div>
  );
}

