// Load environment variables
import "dotenv/config";
import mongoose from "mongoose";
import Spot from "./models/Spot.js";

/**
 * SAMPLE SPOTS WITH GEO COORDINATES
 * (LAT = north/south, LNG = east/west)
 */
const sampleSpots = [
  {
    address: "123 Maple St",
    city: "Los Angeles",
    price: 20,
    host: null,
    description: "Driveway near the stadium.",
    location: {
      type: "Point",
      coordinates: [-118.2700, 34.0500], // lng, lat
    },
  },
  {
    address: "700 Stadium Dr",
    city: "Inglewood",
    price: 35,
    host: null,
    description: "5 minute walk to SoFi Stadium.",
    location: {
      type: "Point",
      coordinates: [-118.3387, 33.9533],
    },
  },
  {
    address: "456 Sunset Blvd",
    city: "Los Angeles",
    price: 15,
    host: null,
    description: "Near downtown theaters.",
    location: {
      type: "Point",
      coordinates: [-118.2551, 34.0522],
    },
  },
];

// START SCRIPT
async function run() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ Missing MONGO_URI in .env");
      return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Clearing old spots...");
    await Spot.deleteMany({});

    console.log("Inserting sample spots...");
    await Spot.insertMany(sampleSpots);

    console.log("✅ Sample spots inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

run();

