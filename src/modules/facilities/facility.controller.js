const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/apiResponse");
const facilityService = require("./facility.service");

const getFeaturedFacilities = asyncHandler(async (req, res) => {
  const facilities = await facilityService.getFeaturedFacilities();
  sendSuccess(res, { data: facilities });
});

const createFacility = asyncHandler(async (req, res) => {
  const facility = await facilityService.createFacility(req.body, req.user.email);
  sendSuccess(res, {
    statusCode: 201,
    message: "Facility created successfully",
    data: facility,
  });
});

module.exports = {
  createFacility,
  getFeaturedFacilities
};
