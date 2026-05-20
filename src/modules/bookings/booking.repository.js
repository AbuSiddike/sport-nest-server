const { getDb } = require("../../config/db");
const { toObjectId } = require("../../utils/objectId");

function getCollection() {
  return getDb().collection("bookings");
}

async function findByUserEmail(userEmail) {
  return getCollection().find({ user_email: userEmail }).sort({ created_at: -1 }).toArray();
}

async function insertOne(booking) {
  const result = await getCollection().insertOne(booking);
  return { ...booking, _id: result.insertedId };
}

async function findById(id) {
  return getCollection().findOne({ _id: toObjectId(id, "booking id") });
}

async function updateStatusById(id, status) {
  const result = await getCollection().findOneAndUpdate(
    { _id: toObjectId(id, "booking id") },
    { $set: { status, updated_at: new Date() } },
    { returnDocument: "after" },
  );

  return result;
}

async function deleteById(id) {
  const result = await getCollection().deleteOne({
    _id: toObjectId(id, "booking id"),
  });

  return result.deletedCount > 0;
}

async function deleteManyByFacilityId(id) {
  const result = await getCollection().deleteMany({
    facility_id: toObjectId(id, "facility id"),
  });
  
  return result.deletedCount > 0;
}

module.exports = {
  findByUserEmail,
  insertOne,
  findById,
  updateStatusById,
  deleteById,
  deleteManyByFacilityId,
};
