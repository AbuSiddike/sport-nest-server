const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/apiResponse");
const facilityService = require("./facility.service");

const listFacilities = asyncHandler(async (req, res) => {
  const facilities = await facilityService.listFacilities(req.query);
  sendSuccess(res, { data: facilities });
});

const getFeaturedFacilities = asyncHandler(async (req, res) => {
  const facilities = await facilityService.getFeaturedFacilities();
  sendSuccess(res, { data: facilities });
});

const getFacilityById = asyncHandler(async (req, res) => {
  const facility = await facilityService.getFacilityById(req.params.id);
  sendSuccess(res, { data: facility });
});

const getMyFacilities = asyncHandler(async (req, res) => {
  const facilities = await facilityService.getMyFacilities(req.user.email);
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

const updateFacility = asyncHandler(async (req, res) => {
  const facility = await facilityService.updateFacility(req.params.id, req.body, req.user.email);
  sendSuccess(res, {
    message: "Facility updated successfully",
    data: facility,
  });
});

module.exports = {
  createFacility,
  getFeaturedFacilities,
  listFacilities,
  getFacilityById,
  getMyFacilities,
  updateFacility
};
