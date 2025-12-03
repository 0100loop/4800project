import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/forgot-password
 * User submits email => send reset link (placeholder demo version)
 */
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Normally you send email here
    console.log(`Password reset requested for: ${email}`);

    res.json({
      message: "If this email exists, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Server error processing request" });
  }
});

export default router;

