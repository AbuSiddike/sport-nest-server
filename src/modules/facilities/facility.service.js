const AppError = require("../../utils/AppError");
const bookingRepository = require("../bookings/booking.repository");
const facilityRepository = require("./facility.repository");

const REQUIRED_CREATE_FIELDS = [
  "name",
  "facility_type",
  "image",
  "location",
  "price_per_hour",
  "capacity",
  "available_slots",
  "description",
];

const UPDATABLE_FIELDS = [
  "name",
  "facility_type",
  "image",
  "location",
  "price_per_hour",
  "capacity",
  "available_slots",
  "description",
];

function parseTypes(typesQuery) {
  if (!typesQuery) return undefined;

  const types = String(typesQuery)
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);

  return types.length ? types : undefined;
}

function pickFields(source, fields) {
  return fields.reduce((result, field) => {
    if (source[field] !== undefined) {
      result[field] = source[field];
    }
    return result;
  }, {});
}

function validateCreatePayload(body) {
  const missing = REQUIRED_CREATE_FIELDS.filter(
    (field) => body[field] === undefined || body[field] === "",
  );

  if (missing.length) {
    throw new AppError(`Missing required fields: ${missing.join(", ")}`, 400);
  }

  if (!Array.isArray(body.available_slots) || body.available_slots.length === 0) {
    throw new AppError("available_slots must be a non-empty array", 400);
  }

  const price = Number(body.price_per_hour);
  const capacity = Number(body.capacity);

  if (Number.isNaN(price) || price <= 0) {
    throw new AppError("price_per_hour must be a positive number", 400);
  }

  if (Number.isNaN(capacity) || capacity <= 0) {
    throw new AppError("capacity must be a positive number", 400);
  }
}

function assertOwner(facility, userEmail) {
  if (!facility) {
    throw new AppError("Facility not found", 404);
  }

  if (facility.owner_email !== userEmail) {
    throw new AppError("You are not allowed to modify this facility", 403);
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

  return facilityRepository.insertOne(facility);
}

async function getFeaturedFacilities() {
  return facilityRepository.findFeatured(6);
}

async function listFacilities(query) {
  const search = query.search?.trim();
  const types = parseTypes(query.types);

  return facilityRepository.findAll({ search, types });
}

async function getFacilityById(id) {
  const facility = await facilityRepository.findById(id);

  if (!facility) {
    throw new AppError("Facility not found", 404);
  }

  return facility;
}

async function getMyFacilities(ownerEmail) {
  return facilityRepository.findByOwnerEmail(ownerEmail);
}

async function updateFacility(id, body, ownerEmail) {
  const existing = await facilityRepository.findById(id);
  assertOwner(existing, ownerEmail);

  const updates = pickFields(body, UPDATABLE_FIELDS);

  if (updates.price_per_hour !== undefined) {
    updates.price_per_hour = Number(updates.price_per_hour);
    if (Number.isNaN(updates.price_per_hour) || updates.price_per_hour <= 0) {
      throw new AppError("price_per_hour must be a positive number", 400);
    }
  }

  if (updates.capacity !== undefined) {
    updates.capacity = Number(updates.capacity);
    if (Number.isNaN(updates.capacity) || updates.capacity <= 0) {
      throw new AppError("capacity must be a positive number", 400);
    }
  }

  if (updates.available_slots !== undefined) {
    if (!Array.isArray(updates.available_slots) || !updates.available_slots.length) {
      throw new AppError("available_slots must be a non-empty array", 400);
    }
  }

  if (!Object.keys(updates).length) {
    throw new AppError("No valid fields provided for update", 400);
  }

  updates.updated_at = new Date();

  const updated = await facilityRepository.updateById(id, updates);
  return updated;
}

async function deleteFacility(id, ownerEmail) {
  const existing = await facilityRepository.findById(id);
  assertOwner(existing, ownerEmail);

  const deleted = await facilityRepository
    .deleteById(id)
    .then(() => bookingRepository.deleteManyByFacilityId(existing._id));

  if (!deleted) {
    throw new AppError("Facility not found", 404);
  }

  return { id };
}

module.exports = {
  createFacility,
  getFeaturedFacilities,
  listFacilities,
  getFacilityById,
  getMyFacilities,
  updateFacility,
  deleteFacility,
};
