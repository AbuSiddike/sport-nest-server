const AppError = require('../../utils/AppError');
const facilityRapository = require('./facility.rapository');

const REQUIRED_CREATE_FIELDS = [
  'name',
  'facility_type',
  'image',
  'location',
  'price_per_hour',
  'capacity',
  'available_slots',
  'description',
];

function validateCreatePayload(body) {
  const missing = REQUIRED_CREATE_FIELDS.filter(
    (field) => body[field] === undefined || body[field] === ''
  );

  if (missing.length) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }

  if (!Array.isArray(body.available_slots) || body.available_slots.length === 0) {
    throw new AppError('available_slots must be a non-empty array', 400);
  }

  const price = Number(body.price_per_hour);
  const capacity = Number(body.capacity);

  if (Number.isNaN(price) || price <= 0) {
    throw new AppError('price_per_hour must be a positive number', 400);
  }

  if (Number.isNaN(capacity) || capacity <= 0) {
    throw new AppError('capacity must be a positive number', 400);
  }
}

async function createFacility(body, ownerEmail) {
  validateCreatePayload(body);

  const facility = {
    name: body.name.trim(),
    facility_type: body.facility_type.trim(),
    image: body.image.trim(),
    location: body.location.trim(),
    price_per_hour: Number(body.price_per_hour),
    capacity: Number(body.capacity),
    available_slots: body.available_slots,
    description: body.description.trim(),
    owner_email: ownerEmail,
    booking_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return facilityRapository.insertOne(facility);
}

module.exports = {
  createFacility,
};
