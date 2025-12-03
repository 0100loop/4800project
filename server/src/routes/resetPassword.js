import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/* =========================================================================
   RESET PASSWORD  (RESTORED ORIGINAL)
=========================================================================== */
router.post("/", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ ok: true, message: "Password successfully reset" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;


