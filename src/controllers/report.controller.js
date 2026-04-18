const reportService = require("../services/report.service");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  dashboard: asyncHandler(async (_req, res) => {
    const data = await reportService.getDashboard();
    return sendResponse(res, {
      message: "Dashboard report fetched successfully.",
      data,
    });
  }),

  sales: asyncHandler(async (req, res) => {
    const data = await reportService.getSales(req.query);
    return sendResponse(res, {
      message: "Sales report fetched successfully.",
      data,
    });
  }),

  purchases: asyncHandler(async (req, res) => {
    const data = await reportService.getPurchases(req.query);
    return sendResponse(res, {
      message: "Purchases report fetched successfully.",
      data,
    });
  }),
};

