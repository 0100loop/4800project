import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../lib/mailer.js";
import passport from "../lib/googleAuth.js";

const router = express.Router();

// Ensure JWT secret exists
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in environment variables!");
  process.exit(1);
}

/* ============================
      USER SIGNUP
============================ */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "user",
    });

    // Send welcome email (async)
    sendWelcomeEmail(user.email, user.name, user.role).catch(() => {});

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Account created successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error." });
  }
});

/* ============================
      USER LOGIN
============================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error." });
  }
});

/* ============================
    GOOGLE OAUTH (LOCALHOST)
============================ */

// Step 1: Redirect to Google with scope + choose account
router.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account"   // Force account chooser
  })
);

// Step 2: Google Callback → issue token → redirect to frontend
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;

    // Local frontend callback
    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }
);

export default router;

