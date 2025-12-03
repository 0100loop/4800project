import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import routes from "./routes/index.js";

// Load environment variables
dotenv.config();

const app = express();

/* =========================================================================
   CORS CONFIGURATION (⭐ REQUIRED FOR AUTH + COOKIES)
=========================================================================== */
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight support

/* =========================================================================
   MIDDLEWARE
=========================================================================== */
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

/* =========================================================================
   TEST ROUTE — CONFIRM API IS RUNNING
=========================================================================== */
app.get("/", (req, res) => {
  res.json({ status: "API Running" });
});

/* =========================================================================
   API ROUTES
=========================================================================== */
app.use("/api", routes);

/* =========================================================================
   404 HANDLER
=========================================================================== */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
