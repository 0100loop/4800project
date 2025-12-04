const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/hostController");

router.get("/", auth, controller.getHostDashboard);

module.exports = router;
