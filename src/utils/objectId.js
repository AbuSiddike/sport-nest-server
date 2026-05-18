const { ObjectId } = require("mongodb");
const AppError = require("./AppError");

function toObjectId(id, label = "ID") {
  if (!ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
  return new ObjectId(id);
}

module.exports = { toObjectId };
