const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User"); // adjust if your User model is somewhere else
const sendEmail = require("../utils/sendEmail"); // we will make this next

// POST /api/auth/forgot-password
router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Do not tell user if email exists for security
      return res.json({ ok: true });
    }

    // Create token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "ParkIt Password Reset",
      `Click the link below to reset your password:\n\n${resetLink}`
    );

    res.json({ ok: true, message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
