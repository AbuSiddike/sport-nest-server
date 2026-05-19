const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || "SportNest");

  await db.collection("facilities").createIndex({ owner_email: 1 });
  await db.collection("facilities").createIndex({ facility_type: 1 });
  await db.collection("facilities").createIndex({ name: 1 });
  await db.collection("bookings").createIndex({ user_email: 1 });
  await db.collection("bookings").createIndex({ facility_id: 1 });

  return db;
}

function getDb() {
  if (!db) {
    throw new Error("Database is not connected. Call connectDatabase() first.");
  }
  return db;
}

async function closeDatabase() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}

module.exports = {
  connectDatabase,
  getDb,
  closeDatabase,
};
