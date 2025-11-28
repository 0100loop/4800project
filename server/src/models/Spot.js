import mongoose from "mongoose";

const SpotSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: false },
    description: { type: String },
    price: { type: Number, default: 10 },

    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// IMPORTANT: GEO INDEX FOR $near SEARCH
SpotSchema.index({ location: "2dsphere" });

export default mongoose.model("Spot", SpotSchema);

