import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe =
  stripeSecret && stripeSecret !== "sk_test_placeholder"
    ? new Stripe(stripeSecret)
    : null;

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || "http://localhost:5173";
const SUCCESS_PATH = process.env.STRIPE_SUCCESS_PATH || "/payments/success";
const CANCEL_PATH = process.env.STRIPE_CANCEL_PATH || "/payments/cancel";
const DEFAULT_CURRENCY = process.env.STRIPE_CURRENCY || "usd";

const ensureStripeConfigured = (res) => {
  if (!stripe) {
    res
      .status(500)
      .json({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY." });
    return false;
  }
  return true;
};

const calculateBookingTotals = (start, end, pricePerHour = 10) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error("Invalid start or end time");
  }

  if (endDate <= startDate) {
    throw new Error("End time must be after start time");
  }

  const hours = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
  );
  const totalPrice = Math.round(hours * pricePerHour);

  return { hours, totalPrice, startDate, endDate };
};

router.post("/checkout-session", auth("user"), async (req, res) => {
  if (!ensureStripeConfigured(res)) return;

  try {
    const { listingId, start, end } = req.body;
    if (!listingId || !start || !end) {
      return res
        .status(400)
        .json({ error: "listingId, start, and end are required" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      return res.status(404).json({ error: "Listing unavailable" });
    }

    const { hours, totalPrice, startDate, endDate } = calculateBookingTotals(
      start,
      end,
      listing.pricePerHour ?? 10
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: req.user.email || undefined,
      metadata: {
        listingId: listing._id.toString(),
        userId: req.user.id,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        hours: hours.toString(),
        totalPrice: totalPrice.toString(),
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: DEFAULT_CURRENCY,
            unit_amount: totalPrice * 100,
            product_data: {
              name: listing.title || "Parking reservation",
              description: `${hours} hour reservation`,
            },
          },
        },
      ],
      success_url: `${CLIENT_BASE_URL}${SUCCESS_PATH}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_BASE_URL}${CANCEL_PATH}`,
    });

    res.json({
      sessionId: session.id,
      url: session.url,
      amount: totalPrice,
      currency: DEFAULT_CURRENCY,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/confirm", auth("user"), async (req, res) => {
  if (!ensureStripeConfigured(res)) return;

  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.metadata?.userId !== req.user.id) {
      return res.status(403).json({ error: "Session does not belong to user" });
    }

    if (session.payment_status !== "paid") {
      return res
        .status(409)
        .json({ error: "Payment not completed for this session" });
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntentId) {
      return res
        .status(500)
        .json({ error: "Missing payment intent for this session" });
    }

    let booking = await Booking.findOne({ paymentId: paymentIntentId });
    if (booking) {
      return res.json({ booking });
    }

    const { listingId, start, end, totalPrice } = session.metadata || {};
    if (!listingId || !start || !end || !totalPrice) {
      return res
        .status(400)
        .json({ error: "Session metadata incomplete, cannot create booking" });
    }

    booking = await Booking.create({
      userId: req.user.id,
      listingId,
      start: new Date(start),
      end: new Date(end),
      totalPrice: Number(totalPrice),
      status: "paid",
      paymentId: paymentIntentId,
    });

    res.json({ booking });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
