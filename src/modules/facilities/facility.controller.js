const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const facilityService = require('./facility.service');

const createFacility = asyncHandler(async (req, res) => {
  const email = req.body.owner_email
  // const facility = await facilityService.createFacility(req.body, req.user.email);
    const facility = await facilityService.createFacility(req.body, email);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Facility created successfully',
    data: facility,
  });
});

module.exports = {
  createFacility,
};
