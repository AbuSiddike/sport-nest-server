const { ObjectId } = require("mongodb");
const { getDb } = require("../../config/db");
const { toObjectId } = require("../../utils/objectId");

function getCollection() {
  return getDb().collection("facilities");
}

function buildListFilter({ search, types }) {
  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (types?.length) {
    filter.facility_type = { $in: types };
  }

  return filter;
}

async function findAll({ search, types } = {}) {
  const filter = buildListFilter({ search, types });
  return getCollection().find(filter).sort({ created_at: -1 }).toArray();
}

async function findFeatured(limit = 6) {
  return getCollection()
    .find({})
    .sort({ booking_count: -1, created_at: -1 })
    .limit(limit)
    .toArray();
}

async function findById(id) {
  return getCollection().findOne({ _id: toObjectId(id, "facility id") });
}

async function findByOwnerEmail(ownerEmail) {
  return getCollection().find({ owner_email: ownerEmail }).sort({ created_at: -1 }).toArray();
}

async function insertOne(facility) {
  const result = await getCollection().insertOne(facility);
  return { ...facility, _id: result.insertedId };
}

async function updateById(id, update) {
  const result = await getCollection().findOneAndUpdate(
    { _id: toObjectId(id, "facility id") },
    { $set: update },
    { returnDocument: "after" },
  );

  return result;
}

async function deleteById(id) {
  const result = await getCollection().deleteOne({
    _id: toObjectId(id, "facility id"),
  });

  return result.deletedCount > 0;
}

async function findByIds(ids) {
  const objectIds = ids.map((id) => toObjectId(id, "facility id"));
  return getCollection()
    .find({ _id: { $in: objectIds } })
    .toArray();
}

async function incrementBookingCount(facilityId, amount = 1) {
  await getCollection().updateOne(
    { _id: new ObjectId(facilityId) },
    { $inc: { booking_count: amount } },
  );
}

module.exports = {
  findAll,
  findFeatured,
  findById,
  findByIds,
  findByOwnerEmail,
  insertOne,
  updateById,
  deleteById,
  incrementBookingCount,
};
