import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import Spot from "../models/Spot.js";
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

router.post("/checkout-session", auth("user"), async (req, res) => {
  if (!ensureStripeConfigured(res)) return;

  try {
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: "listingId is required" });
    }

    const listing = await Listing.findById(listingId).populate("spotId");
    if (!listing || !listing.isActive || listing.status !== "active") {
      return res.status(404).json({ error: "Listing unavailable" });
    }

    // Check if there's space available
    if (listing.bookedSpaces >= listing.spacesAvailable) {
      return res.status(409).json({ error: "Listing is full" });
    }

    const spot = await Spot.findById(listing.spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found for this listing" });
    }

    // Use the listing's price (set by host)
    const totalPrice = listing.price;

    // Format date/time for display
    const listingDate = new Date(listing.date);
    const dateStr = listingDate.toLocaleDateString();
    const timeRange = `${listing.startTime} - ${listing.endTime}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: req.user.email || undefined,
      metadata: {
        listingId: listing._id.toString(),
        spotId: listing.spotId.toString(),
        userId: req.user.id,
        eventName: listing.eventName || "Parking Reservation",
        eventDate: listing.date.toISOString(),
        totalPrice: totalPrice.toString(),
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: DEFAULT_CURRENCY,
            unit_amount: totalPrice * 100,
            product_data: {
              name: spot.title || "Parking reservation",
              description: `${dateStr} • ${timeRange}${listing.eventName ? ` • ${listing.eventName}` : ""}`,
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

    const { listingId, spotId, eventName, eventDate, totalPrice } = session.metadata || {};
    if (!listingId || !spotId || !totalPrice) {
      return res
        .status(400)
        .json({ error: "Session metadata incomplete, cannot create booking" });
    }

    // Get listing to check availability and update bookedSpaces
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.bookedSpaces >= listing.spacesAvailable) {
      return res.status(409).json({ error: "Listing is now full" });
    }

    // Get spot for eventVenue
    const spot = await Spot.findById(spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    booking = await Booking.create({
      userId: req.user.id,
      listingId,
      spotId,
      eventName: eventName || "Parking Reservation",
      eventDate: eventDate || new Date(listing.date).toISOString(),
      eventVenue: spot.address || "Location TBD",
      totalPrice: Number(totalPrice),
    });

    // Update listing's bookedSpaces count
    listing.bookedSpaces += 1;
    if (listing.bookedSpaces >= listing.spacesAvailable) {
      listing.status = "full";
    }
    await listing.save();

    res.json({ booking });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
