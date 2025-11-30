import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required: true },
  eventName: { type: String }, // Optional: "Lakers vs Warriors"
  date: { type: Date, required: true }, // Use Date type instead of String
  startTime: { type: String, required: true }, // "17:00"
  endTime: { type: String, required: true }, // "23:00"
  price: { type: Number, required: true },
  spacesAvailable: { type: Number, required: true },
  bookedSpaces: { type: Number, default: 0 }, // Track bookings
  status: { type: String, default: "active", enum: ["active", "full", "inactive"] },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});
ListingSchema.index({ lat:1, lng:1 });
export default mongoose.model("Listing", ListingSchema);





