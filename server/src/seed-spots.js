import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGO_URI in env");
  process.exit(1);
}

const Spot =
  mongoose.models.__ParkItSpot ||
  mongoose.model(
    "__ParkItSpot",
    new mongoose.Schema({}, { strict: false }),
    "spots"
  );

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
  await mongoose.connection.db
    .collection("spots")
    .createIndex({ location: "2dsphere" });

  await mongoose.connection.db.collection("spots").insertMany(docs);
  console.log("Seeded spots:", docs.length);

  await mongoose.disconnect();
  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
