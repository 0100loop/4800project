import mongoose from "mongoose";
import auth from "../middleware/auth.js"

const SpotSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pricePerEvent: { type: Number, required: true, min: 0 },
  address: { type: String, required: true },
  bathroom: { type: Boolean, default: false },
  evCharging: { type: Boolean, default: false },
  shuttle: { type: Boolean, default: false },
  tailgateFriendly: { type: Boolean, default: false },
  overnightAllowed: { type: Boolean, default: false },
  spaces: {type: Number, default: 0},
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  }
}, { timestamps: true });

SpotSchema.index({ location: "2dsphere" });

export default mongoose.model("Spot", SpotSchema);
