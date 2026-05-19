const { getDb } = require("../../config/db");

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


module.exports = {
  findByUserEmail,
  insertOne,
  findById,
};
