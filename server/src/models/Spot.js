import mongoose from "mongoose";

const SpotSchema = new mongoose.Schema(
  {
    // Host information
    hostName: { type: String, default: "" },

    // Address of spot
    address: { type: String, default: "" },

    title: { type: String, default: "" },
    description: { type: String, default: "" },

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

    amenities: {
      bathroom: { type: Boolean, default: false },
      evCharging: { type: Boolean, default: false },
      shuttle: { type: Boolean, default: false },
      tailgateFriendly: { type: Boolean, default: false },
      overnightAllowed: { type: Boolean, default: false },
    },

    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Spot", SpotSchema);
