const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  lat: Number,
  lng: Number,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Spot", SpotSchema);
