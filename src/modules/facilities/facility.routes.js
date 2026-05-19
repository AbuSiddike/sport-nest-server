const express = require("express");
const facilityController = require("./facility.controller");
const authenticate = require("../../middleware/authenticate");

const router = express.Router();

router.get("/featured", facilityController.getFeaturedFacilities);
router.get("/", facilityController.listFacilities);
router.get("/mine", authenticate, facilityController.getMyFacilities);
router.get("/:id", facilityController.getFacilityById);

router.post("/", authenticate, facilityController.createFacility);
router.patch("/:id", authenticate, facilityController.updateFacility);

module.exports = router;
