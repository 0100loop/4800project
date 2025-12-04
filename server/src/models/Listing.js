import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    spotId: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    eventName: { type: String, default: "" },
    address: { type: String, default: "" },
    closestStadium: { type: String, default: "" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    pricePerHour: { type: Number, default: 0 },
    spacesAvailable: { type: Number, required: true },
    bookedSpaces: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "full", "inactive"],
      default: "active",
    },
    isActive: { type: Boolean, default: true },
    amenities: {
      bathroom: { type: Boolean, default: false },
      evCharging: { type: Boolean, default: false },
      shuttle: { type: Boolean, default: false },
      tailgateFriendly: { type: Boolean, default: false },
      overnightAllowed: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

ListingSchema.index({ location: "2dsphere" });

export default mongoose.model("Listing", ListingSchema);





