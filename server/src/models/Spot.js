import mongoose from "mongoose";

const SpotSchema = new mongoose.Schema(
  {
    // Host information
    hostName: { type: String, default: "" },

    // Address of spot
    address: { type: String, default: "" },

    // Stadium
    closestStadium: { type: String, default: "" },

    // Price
    price: { type: Number, default: 0 },

    // Spaces available
    spacesAvailable: { type: Number, default: 0 },

    // Event info (optional)
    eventDate: { type: String, default: "" },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },

    // Geocoded coordinates
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Spot", SpotSchema);
