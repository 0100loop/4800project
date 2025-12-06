// bookings.js - Updated with better error handling
import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Spot from "../models/Spot.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/payments/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Create checkout session request:", req.body);

    const { amount, bookingId, spotId } = req.body;

    // Validation
    if (!amount || !bookingId) {
      console.error("Missing required fields:", { amount, bookingId });
      return res.status(400).json({ 
        error: "Missing amount or bookingId",
        received: { amount, bookingId, spotId }
      });
    }

    // Validate amount is a positive number
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ 
        error: "Invalid amount",
        received: amount
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { 
        bookingId: String(bookingId),
        spotId: String(spotId || "")
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Parking Spot Booking",
              description: `Booking ID: ${bookingId}`
            },
            unit_amount: Math.round(numAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    console.log("Stripe session created:", session.id);

    // Always respond with JSON
    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (err) {
    console.error("Stripe checkout session error:", err);
    
    // Return proper JSON error response
    return res.status(500).json({
      error: "Failed to create checkout session",
      message: err.message || "Unknown error",
      type: err.type || "stripe_error"
    });
  }
});

// GET /api/payments/verify-session/:sessionId
// Optional: Verify payment after redirect
router.get("/verify-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return res.json({
      paid: session.payment_status === "paid",
      bookingId: session.metadata?.bookingId,
      amount: session.amount_total / 100,
    });
  } catch (err) {
    console.error("Session verification error:", err);
    return res.status(500).json({ 
      error: "Failed to verify session",
      message: err.message 
    });
  }
});

export default router;