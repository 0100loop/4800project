import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import dotenv from "dotenv";
import auth from "../middleware/auth.js";  // import your auth middleware


// Load environment variables
dotenv.config();

const router = express.Router();
// Apply auth to all routes in this router


/* =========================================================================
   GOOGLE STRATEGY
=========================================================================== */

// Make sure env vars exist
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(
    "❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env file"
  );
}

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
        console.error("Google OAuth error:", err);
        done(err, null);
      }
    }
  )
);



/* =========================================================================
   EMAIL SIGNUP + WELCOME EMAIL (PUBLIC)
=========================================================================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    // Send welcome email
    await sendEmail(
      user.email,
      "Welcome to ParkIt!",
      `<h2>Welcome, ${user.name}!</h2><p>Thanks for signing up.</p>`
    );

    res.json({ ok: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

/* =========================================================================
   EMAIL LOGIN (PUBLIC)
=========================================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

/* =========================================================================
   FORGOT PASSWORD (PUBLIC)
=========================================================================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Security: never reveal if user exists
    if (!user) return res.json({ ok: true });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "ParkIt Password Reset",
      `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto;">
        <h2>Password Reset Requested</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" style="background:#03B4D8;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;">Reset Password</a>
        <p>If you did not request this, please ignore.</p>
      </div>
      `
    );

    res.json({ ok: true, message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================================
   GET LOGGED-IN USER (PROTECTED)
=========================================================================== */
router.get("/me", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json({ user });
  } catch (err) {
    console.error("Token check error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

/* =========================================================================
   UPDATE USER PROFILE (PROTECTED)
=========================================================================== */
router.put("/me", auth(), async (req, res) => {
  try {
    const { name, phone, location, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...(name && { name }), ...(phone && { phone }), ...(location && { location }), ...(avatar && { avatar }) },
      { new: true }
    ).select("-passwordHash");

    res.json({ user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* =========================================================================
   GOOGLE LOGIN + REDIRECT (PUBLIC)
=========================================================================== */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `http://localhost:5173/auth-success?token=${token}` +
        `&name=${encodeURIComponent(user.name)}` +
        `&email=${encodeURIComponent(user.email)}` +
        `&avatar=${encodeURIComponent(user.avatar || "")}`
    );
  }
);

export default router;