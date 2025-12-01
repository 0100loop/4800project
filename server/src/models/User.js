import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: { type:String, required:true },
  email: { type:String, required:true, unique:true, index:true },
  passwordHash: {
  type: String,
  required: function () {
    return !this.googleId; // required only if no Google login
  }
},
googleId: {
  type: String,
  required: function () {
    return !this.passwordHash; // required only if no password login
  }
},
  role: { type:String, enum:["user","lister"], default:"user" },
}, { timestamps:true });
export default mongoose.model("User", UserSchema);
