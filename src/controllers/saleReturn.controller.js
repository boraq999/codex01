const saleReturnService = require("../services/saleReturn.service");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  list: asyncHandler(async (_req, res) => {
    const data = await saleReturnService.list();
    return sendResponse(res, {
      message: "Sale returns fetched successfully.",
      data,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const data = await saleReturnService.getById(Number(req.params.id));
    return sendResponse(res, {
      message: "Sale return fetched successfully.",
      data,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const data = await saleReturnService.create(req.body, req.user?.id);
    return sendResponse(res, {
      statusCode: 201,
      message: "Sale return created successfully.",
      data,
    });
  }),
};

