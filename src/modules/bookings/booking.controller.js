const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/apiResponse");
const bookingService = require("./booking.service");

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user.email);
  sendSuccess(res, { data: bookings });
});

const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user.email);
  sendSuccess(res, {
    statusCode: 201,
    message: "Booking created successfully",
    data: booking,
  });
});

module.exports = {
  getMyBookings,
  createBooking,
};
