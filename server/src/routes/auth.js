import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../lib/mailer.js";

const router = express.Router();

router.post("/signup", async (req,res)=>{
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error:"Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || "user" });
    // fire-and-forget email
    sendWelcomeEmail(user.email, user.name, user.role).catch(()=>{});
    res.json({ message:"Account created", user: { id:user._id, name:user.name, email:user.email, role:user.role }});
  } catch(e){ res.status(500).json({ error:e.message }); }
});

router.post("/login", async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error:"Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({ error:"Invalid credentials" });
    const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role }});
  } catch(e){ res.status(500).json({ error:e.message }); }
});

export default router;
