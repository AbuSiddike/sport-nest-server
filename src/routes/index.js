const express = require("express");
const bookingRoutes = require("../modules/bookings/booking.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "SportNest API is running" });
});

router.use("/bookings", bookingRoutes);

module.exports = router;
