const inventoryService = require("../services/inventory.service");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  list: asyncHandler(async (_req, res) => {
    const data = await inventoryService.list();
    return sendResponse(res, {
      message: "Inventory transactions fetched successfully.",
      data,
    });
  }),

  listByProduct: asyncHandler(async (req, res) => {
    const data = await inventoryService.listByProduct(Number(req.params.productId));
    return sendResponse(res, {
      message: "Product inventory history fetched successfully.",
      data,
    });
  }),

  adjustStock: asyncHandler(async (req, res) => {
    const data = await inventoryService.adjustStock(req.body, req.user?.id);
    return sendResponse(res, {
      statusCode: 201,
      message: "Stock adjusted successfully.",
      data,
    });
  }),
};

