import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required: true },

  // GeoJSON location (REQUIRED FOR RADIUS SEARCH)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  eventName: { type: String },
  lat: { type: Number, required: true },
lng: { type: Number, required: true },

location: {
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
},
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  price: { type: Number, required: true },
  spacesAvailable: { type: Number, required: true },
  bookedSpaces: { type: Number, default: 0 },
  status: { 
    type: String, 
    default: "active",
    enum: ["active", "full", "inactive"]
  },
  isActive: { type: Boolean, default: true }
},
{
  timestamps: true
});

// REQUIRED for $geoNear
ListingSchema.index({ location: "2dsphere" });

export default mongoose.model("Listing", ListingSchema);





