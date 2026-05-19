const express = require("express");
const facilityController = require("./facility.controller");
const authenticate = require("../../middleware/authenticate");

const router = express.Router();

router.get("/featured", facilityController.getFeaturedFacilities);
router.post("/", authenticate, facilityController.createFacility);

module.exports = router;
