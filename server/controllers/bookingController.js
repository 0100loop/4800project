const Booking = require("../models/Booking");

exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate("spot");
  res.json(bookings);
};
