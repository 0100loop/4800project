const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./config/db")();

// FIXED: Correct path to route folder
const authRoutes = require("./src/routes/auth");
const bookingRoutes = require("./src/routes/bookings");
const spotRoutes = require("./src/routes/spots");
// Host dashboard route lives in listings.js (NOT host.js)
const hostRoutes = require("./src/routes/listings");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes now correctly map to src/routes/
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/spots", spotRoutes);
app.use("/api/bookings/host", hostRoutes);

app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
