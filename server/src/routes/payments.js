import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.VITE_FRONTEND_URL;

// POST /api/payments/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ error: "Missing amount or bookingId" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      metadata: { bookingId },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Parking Spot Booking" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `http://${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://${FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Stripe error" });
  }
});

export default router;
