const saleService = require("../services/sale.service");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  list: asyncHandler(async (_req, res) => {
    const data = await saleService.list();
    return sendResponse(res, {
      message: "Sales fetched successfully.",
      data,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const data = await saleService.getById(Number(req.params.id));
    return sendResponse(res, {
      message: "Sale fetched successfully.",
      data,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const data = await saleService.create(req.body, req.user?.id);
    return sendResponse(res, {
      statusCode: 201,
      message: "Sale created successfully.",
      data,
    });
  }),
};

