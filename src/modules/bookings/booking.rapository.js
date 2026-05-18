const { getDb } = require("../../config/db");

function getCollection() {
  return getDb().collection("bookings");
}

async function findByUserEmail(userEmail) {
  return getCollection().find({ user_email: userEmail }).sort({ created_at: -1 }).toArray();
}

module.exports = {
  findByUserEmail,
};
