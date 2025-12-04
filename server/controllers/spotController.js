const Spot = require("../models/Spot");

exports.getSpot = async (req, res) => {
  const spot = await Spot.findById(req.params.id);
  if (!spot) return res.status(404).json({ error: "Spot not found" });
  res.json(spot);
};
