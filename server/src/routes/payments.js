import express from "express";
import Stripe from "stripe";
import auth from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import Spot from "../models/Spot.js";
import User from "../models/User.js";

const router = express.Router();

/* ============================================
   STRIPE INIT
============================================ */
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error("❌ Missing STRIPE_SECRET_KEY in .env");
}

const stripe = new Stripe(STRIPE_KEY);

/* ============================================
   GET OR CREATE STRIPE CUSTOMER
============================================ */
async function getOrCreateCustomer(userId) {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  // If user already has a Stripe customer ID, reuse it
  if (user.stripeCustomerId) return user.stripeCustomerId;

  // Create new customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
  });

  user.stripeCustomerId = customer.id;
  await user.save();

  return customer.id;
}

/* ============================================
   SAVE CARD (CREATE SETUP INTENT)
============================================ */
router.post("/save-card", auth("user"), async (req, res) => {
  try {
    const customerId = await getOrCreateCustomer(req.user.id);

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error("Save card error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   GET SAVED CARDS
============================================ */
router.get("/cards", auth("user"), async (req, res) => {
  try {
    const customerId = await getOrCreateCustomer(req.user.id);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    res.json(paymentMethods.data);
  } catch (err) {
    console.error("Get cards error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   DELETE SAVED CARD
============================================ */
router.delete("/cards/:pmId", auth("user"), async (req, res) => {
  try {
    const { pmId } = req.params;

    await stripe.paymentMethods.detach(pmId);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete card error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   CHECKOUT SESSION (EXISTING LOGIC PRESERVED)
============================================ */
router.post("/checkout-session", auth("user"), async (req, res) => {
  try {
    const { listingId } = req.body;

    if (!listingId)
      return res.status(400).json({ error: "listingId is required" });

    const listing = await Listing.findById(listingId).populate("spotId");

    if (!listing || !listing.isActive || listing.status !== "active") {
      return res.status(404).json({ error: "Listing unavailable" });
    }

    if (listing.bookedSpaces >= listing.spacesAvailable) {
      return res.status(409).json({ error: "Listing is full" });
    }

    const spot = await Spot.findById(listing.spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found for this listing" });
    }

    const amount = listing.price * 100;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: req.user.email || undefined,
      metadata: {
        listingId: listing._id.toString(),
        spotId: spot._id.toString(),
        userId: req.user.id,
        totalPrice: listing.price.toString(),
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: spot.title || "Parking Spot",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/payments/cancel`,
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error("Checkout session error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   CONFIRM CHECKOUT SESSION
============================================ */
router.post("/confirm", auth("user"), async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.metadata.userId !== req.user.id)
      return res.status(403).json({ error: "Unauthorized session" });

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const listingId = session.metadata.listingId;
    const spotId = session.metadata.spotId;

    const listing = await Listing.findById(listingId);
    const spot = await Spot.findById(spotId);

    const booking = await Booking.create({
      userId: req.user.id,
      listingId,
      spotId,
      totalPrice: session.amount_total / 100,
      eventVenue: spot.address,
      eventDate: listing.date,
    });

    listing.bookedSpaces += 1;
    if (listing.bookedSpaces >= listing.spacesAvailable)
      listing.status = "full";
    await listing.save();

    res.json({ booking });
  } catch (err) {
    console.error("Confirm checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
