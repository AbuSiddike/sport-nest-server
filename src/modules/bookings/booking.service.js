const facilityRepository = require("../facilities/facility.repository");
const bookingRepository = require("./booking.repository");

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

function validateBookingPayload(body) {
  const required = ["facility_id", "booking_date", "time_slot", "hours"];
  const missing = required.filter((field) => body[field] === undefined || body[field] === "");

  if (missing.length) {
    throw new AppError(`Missing required fields: ${missing.join(", ")}`, 400);
  }

  const hours = Number(body.hours);
  if (Number.isNaN(hours) || hours <= 0) {
    throw new AppError("hours must be a positive number", 400);
  }

  return { hours };
}

async function getMyBookings(userEmail) {
  const bookings = await bookingRepository.findByUserEmail(userEmail);

  return bookings;
}

async function createBooking(body, userEmail) {
  const { hours } = validateBookingPayload(body);

  const facility = await facilityRepository.findById(body.facility_id);
  if (!facility) {
    throw new AppError("Facility not found", 404);
  }

  if (!facility.available_slots.includes(body.time_slot)) {
    throw new AppError("Selected time slot is not available for this facility", 400);
  }

  const totalPrice = facility.price_per_hour * hours;

  const booking = {
    facility_id: facility._id,
    facility_name: facility.name,
    user_email: userEmail,
    booking_date: body.booking_date,
    time_slot: body.time_slot,
    hours,
    total_price: totalPrice,
    status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const created = await bookingRepository.insertOne(booking);
  await facilityRepository.incrementBookingCount(facility._id, 1);

  return created;
}

async function cancelBooking(id, userEmail) {
  const booking = await bookingRepository.findById(id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.user_email !== userEmail) {
    throw new AppError("You are not allowed to cancel this booking", 403);
  }

  if (!CANCELLABLE_STATUSES.includes(booking.status)) {
    throw new AppError(`Booking cannot be cancelled while status is ${booking.status}`, 400);
  }

  const updated = await bookingRepository.updateStatusById(id, "cancelled");
  return updated;
}

module.exports = {
  getMyBookings,
  createBooking,
  cancelBooking,
};
