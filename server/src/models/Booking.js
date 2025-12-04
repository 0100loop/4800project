import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required: true },

  // ONE date field for event-based parking
  date: { type: Date, required: true },

  // how many vehicle spaces this booking takes
  spacesBooked: { type: Number, default: 1 },

  // user info for confirmation
  email: String,
  phone: String,

  totalPrice: Number,
  status: { 
    type: String, 
    enum: ["paid", "pending", "cancelled", "confirmed"], 
    default: "paid" 
  },
  paymentId: String,
}, 
{ timestamps: true });

export default mongoose.model("Booking", BookingSchema);
