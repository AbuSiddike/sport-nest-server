const express = require("express");
const authenticate = require("../../middleware/authenticate");
const bookingController = require("./booking.controller");

const router = express.Router();

router.use(authenticate);

router.get("/mine", bookingController.getMyBookings);
router.post("/", bookingController.createBooking);

module.exports = router;
