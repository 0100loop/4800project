import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },

  googleId: { type: String },
  avatar: { type: String },

  phone: { type: String },
  location: { type: String },

  memberSince: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
