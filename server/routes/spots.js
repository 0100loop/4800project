const express = require("express");
const router = express.Router();
const controller = require("../controllers/spotController");

router.get("/:id", controller.getSpot);

module.exports = router;
