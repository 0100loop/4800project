import mongoose from "mongoose";
import Spot from "../models/Spot.js";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGO_URI in env");
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Minimal sample docs — tweak as you like
  const docs = [
    {
      title: "Driveway near Oracle Park",
      price: 25,
      currency: "USD",
      address: "100 3rd St, San Francisco, CA",
      distance: "8 min walk",
      amenities: { bathroom: true, ev: true, shuttle: false },
      tailgateFriendly: true,
      overnight: false,
      safetyScore: "A",
      foodTips: ["Brew & Grill", "Stadium Snacks", "Café Azul"],
      location: { type: "Point", coordinates: [-122.3893, 37.7786] }, // [lng, lat]
    },
    {
      title: "Garage by Chase Center",
      price: 18,
      currency: "USD",
      address: "500 Terry Francois Blvd, SF",
      distance: "10 min walk",
      amenities: { bathroom: false, ev: true, shuttle: true },
      tailgateFriendly: false,
      overnight: true,
      safetyScore: "B+",
      foodTips: ["Spark Social SF", "The Ramp"],
      location: { type: "Point", coordinates: [-122.387, 37.7689] },
    },
  ];

  // Create 2dsphere index for geo queries if missing
  const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Missing MONGO_URI in env");
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Ensure model indexes exist
  await Spot.syncIndexes();

  const docs = [
    {
      pricePerEvent: 25,
      address: "100 3rd St, San Francisco, CA",
      capacity: 1,
      host: new mongoose.Types.ObjectId(), // placeholder
      location: { type: "Point", coordinates: [-122.3893, 37.7786] },
    },
    {
      pricePerEvent: 18,
      address: "500 Terry Francois Blvd, SF",
      capacity: 1,
      host: new mongoose.Types.ObjectId(),
      location: { type: "Point", coordinates: [-122.387, 37.7689] },
    },
  ];

  await Spot.insertMany(docs);
  console.log("Seeded spots:", docs.length);

  await mongoose.disconnect();
  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

  await mongoose.connection.db.collection("spots").insertMany(docs);
  console.log("Seeded spots:", docs.length);

  await mongoose.disconnect();
  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
