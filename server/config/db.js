const mongoose = require("mongoose");

module.exports = async function () {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/parkit");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
