import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata.bookingId;

      await Booking.findByIdAndUpdate(bookingId, {
        paid: true,
        paymentId: session.id,
      });

      console.log("Booking confirmed:", bookingId);
    }

    res.status(200).send();
  }
);

export default router;
