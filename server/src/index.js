import express from "express";
import cors from "cors";
import { connectDB } from "./database.js";
import authRoutes from "./routes/auth.js";
import spotRoutes from "./routes/spots.js";
import listingRoutes from "./routes/listings.js";
import bookingRoutes from "./routes/bookings.js";
import paymentsRoutes from "./routes/payments.js";   // ⭐ ADDED

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/spots", spotRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);

// ⭐ MOUNT PAYMENT ROUTES CORRECTLY
app.use("/payments", paymentsRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
