import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const router = express.Router();

/* =========================================================================
   GOOGLE STRATEGY
=========================================================================== */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name,
            email,
            avatar,
            googleId: profile.id,
            memberSince: new Date(),
          });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        done(null, { token, user });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* =========================================================================
   EMAIL SIGNUP
=========================================================================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    if (!email || !password || !name)
      return res.status(400).json({ error: "Missing required fields." });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists." });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      location,
      memberSince: new Date(),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

/* =========================================================================
   EMAIL LOGIN
=========================================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash)
      return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* =========================================================================
   GET LOGGED-IN USER (/me)
=========================================================================== */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-passwordHash");

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

/* =========================================================================
   UPDATE USER PROFILE (/me)
=========================================================================== */
router.put("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, phone, location, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(avatar && { avatar }),
      },
      { new: true }
    ).select("-passwordHash");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* =========================================================================
   GOOGLE LOGIN REDIRECT
=========================================================================== */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token, user } = req.user;

    res.redirect(
      `http://localhost:5173/auth-success?token=${token}&name=${encodeURIComponent(
        user.name
      )}&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(
        user.avatar || ""
      )}`
    );
  }
);

export default router;


