const Booking = require("../models/Booking");
const Spot = require("../models/Spot");

exports.getHostDashboard = async (req, res) => {
  const spots = await Spot.find({ owner: req.user.id });
  const bookings = await Booking.find({ spot: { $in: spots.map(s => s._id) } })
    .populate("spot")
    .populate("user");

  res.json({ spots, bookings });
};
