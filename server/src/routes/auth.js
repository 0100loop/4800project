import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

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
   EMAIL SIGNUP + WELCOME EMAIL
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

    // ------------------------------
    // SEND WELCOME EMAIL
    // ------------------------------
    await sendEmail(
      email,
      "🎉 Welcome to ParkIt!",
      `
        <h2>Welcome to ParkIt, ${name}!</h2>
        <p>We're excited to have you join our community. Here's what you can do now:</p>

        <ul>
          <li>🚗 <strong>Start renting your parking space</strong> or find convenient parking near your favorite events.</li>
          <li>💰 <strong>Earn extra income</strong> as a host.</li>
          <li>📍 <strong>Find parking near any venue</strong> easily.</li>
          <li>🔒 <strong>Enjoy a secure and trusted platform</strong> for parking.</li>
        </ul>

        <p>Let’s get started!</p>
        <p>— The ParkIt Team</p>
      `
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Signup error:", err);
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
   FORGOT PASSWORD
=========================================================================== */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Security: always return ok
    if (!user) return res.json({ ok: true });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Send Email
    await sendEmail(
      user.email,
      "ParkIt Password Reset",
      `
        <h2>Password Reset Requested</h2>
        <p>Click the button below to reset your password:</p>

        <p><a href="${resetLink}" 
        style="
          display:inline-block;
          padding:10px 20px;
          background:#06B6D4;
          color:white;
          border-radius:8px;
          text-decoration:none;
          font-weight:bold;
        ">Reset Password</a></p>

        <p>If you did not request this, please ignore this email.</p>
      `
    );

    res.json({ ok: true, message: "Reset link sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

/* =========================================================================
   GET LOGGED-IN USER
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
   UPDATE USER PROFILE
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
   GOOGLE LOGIN ROUTE + REDIRECT
=========================================================================== */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

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



