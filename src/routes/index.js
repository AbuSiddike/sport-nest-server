const express = require("express");
const bookingRoutes = require("../modules/bookings/booking.routes");
const facilityRoutes = require("../modules/facilities/facility.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "SportNest API is running" });
});

router.use("/bookings", bookingRoutes);
router.use("/facilities", facilityRoutes);

module.exports = router;
