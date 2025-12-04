const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const controller = require("../controllers/bookingController");

router.get("/", authMiddleware, controller.getUserBookings);

module.exports = router;
