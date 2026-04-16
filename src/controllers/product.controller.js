const productService = require("../services/product.service");
const buildCrudController = require("./crudFactory.controller");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const controller = buildCrudController(productService, "Product");

controller.list = asyncHandler(async (_req, res) => {
  const data = await productService.listDetailed();
  return sendResponse(res, {
    message: "Products fetched successfully.",
    data,
  });
});

module.exports = controller;

