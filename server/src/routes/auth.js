import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../lib/mailer.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const router = express.Router();
const FRONTEND_URL = process.env.VITE_FRONTEND_URL;

// Ensure JWT secret exists
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in environment variables!");
  process.exit(1);
}

/* ============================
      GOOGLE STRATEGY
============================ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          // Create a Google-only user (no password required)
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            role: "user",
          });
        }

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        done(null, { ...user.toObject(), token });

      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* ============================
          SIGNUP
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
           LOGIN
============================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    // BLOCK Google-only accounts from password login
    if (!user.passwordHash) {
      return res.status(400).json({
        error: "This account uses Google login. Please sign in with Google.",
      });
    }

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
      GOOGLE OAUTH ROUTES
============================ */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;
    const name = req.user.name; // <-- get user's name from the Google profile

    // Redirect to frontend with token and name
    res.redirect(
      `http://${FRONTEND_URL}/auth-success?token=${token}&name=${encodeURIComponent(name)}`
    );
  }
);


export default router;
