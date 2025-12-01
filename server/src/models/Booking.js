import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required: true },

  // Event-based fields
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventVenue: { type: String, required: true },

  totalPrice: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", BookingSchema);

