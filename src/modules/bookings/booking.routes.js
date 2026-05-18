const express = require("express");
const bookingController = require("./booking.controller");

const router = express.Router();

router.get("/mine", bookingController.getMyBookings);

module.exports = router;