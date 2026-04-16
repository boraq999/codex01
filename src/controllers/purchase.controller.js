const purchaseService = require("../services/purchase.service");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  list: asyncHandler(async (_req, res) => {
    const data = await purchaseService.list();
    return sendResponse(res, {
      message: "Purchases fetched successfully.",
      data,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const data = await purchaseService.getById(Number(req.params.id));
    return sendResponse(res, {
      message: "Purchase fetched successfully.",
      data,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const data = await purchaseService.create(req.body, req.user?.id);
    return sendResponse(res, {
      statusCode: 201,
      message: "Purchase created successfully.",
      data,
    });
  }),
};

