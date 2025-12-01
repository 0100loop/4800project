import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref:"Listing", required:true },
  start: Date,
  end: Date,
  totalPrice: Number,
  status: { type:String, enum:["paid","pending","cancelled", "confirmed"], default:"paid" },
  paymentId: String,
  // Add these fields to your Booking schema
email: String,
phone: String,
vehicleInfo: String,
date: Date,
spotId: { type: mongoose.Schema.Types.ObjectId, ref: "Spot" },
}, { timestamps:true });
export default mongoose.model("Booking", BookingSchema);
