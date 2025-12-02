import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("⚠️ MongoDB not connected. Continuing without DB.");
    console.error(error.message);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(`✔ SeatGeek Proxy ready at http://localhost:${PORT}/sg/events`);
  });
}

start();
