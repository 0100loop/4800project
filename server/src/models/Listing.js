import mongoose from "mongoose";
const ListingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  title: String,
  address: String,
  lat: Number,
  lng: Number,
  pricePerHour: Number,
  bathroom: Boolean,
  evCharging: Boolean,
  shuttle: Boolean,
  tailgateFriendly: Boolean,
  overnightAllowed: Boolean,
  safetyScore: { type:String, default:"A" }, // simple placeholder
  isActive: { type:Boolean, default:true }
}, { timestamps:true });
ListingSchema.index({ lat:1, lng:1 });
export default mongoose.model("Listing", ListingSchema);
