import express from "express";
import mongoose from "mongoose";
const router = express.Router();
router.get("/", (_req,res)=>{
  const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ status:"ok", message:"Server is running properly!", mongoDB:mongoStatus, time:new Date().toISOString() });
});
export default router;
