import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref:"Listing", required:true },
  start: Date,
  end: Date,
  totalPrice: Number,
  status: { type:String, enum:["paid","pending","cancelled"], default:"paid" },
  paymentId: String
}, { timestamps:true });
export default mongoose.model("Booking", BookingSchema);
