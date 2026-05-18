const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/apiResponse");
const bookingService = require("./booking.service");

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user.email);
  sendSuccess(res, { data: bookings });
});

module.exports = {
  getMyBookings,
};
