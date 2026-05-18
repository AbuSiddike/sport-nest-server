const facilityRepository = require("../facilities/facility.rapository");
const bookingRepository = require("./booking.rapository");

async function getMyBookings(userEmail) {
  const bookings = await bookingRepository.findByUserEmail(userEmail);

  const facilityIds = [...new Set(bookings.map((b) => String(b.facility_id)))];
  const facilities = await Promise.all(facilityIds.map((id) => facilityRepository.findById(id)));

  const facilityMap = new Map(
    facilities.filter(Boolean).map((facility) => [String(facility._id), facility]),
  );

  return bookings.map((booking) => ({
    ...booking,
    facility_name: facilityMap.get(String(booking.facility_id))?.name || null,
  }));
}

module.exports = {
  getMyBookings,
};
