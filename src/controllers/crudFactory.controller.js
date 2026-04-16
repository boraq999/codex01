const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const buildCrudController = (service, entityLabel) => ({
  list: asyncHandler(async (_req, res) => {
    const data = await service.list();
    return sendResponse(res, {
      message: `${entityLabel} fetched successfully.`,
      data,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const data = await service.getById(Number(req.params.id));
    return sendResponse(res, {
      message: `${entityLabel} fetched successfully.`,
      data,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.user?.id);
    return sendResponse(res, {
      statusCode: 201,
      message: `${entityLabel} created successfully.`,
      data,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const data = await service.update(Number(req.params.id), req.body, req.user?.id);
    return sendResponse(res, {
      message: `${entityLabel} updated successfully.`,
      data,
    });
  }),

  remove: asyncHandler(async (req, res) => {
    await service.remove(Number(req.params.id), req.user?.id);
    return sendResponse(res, {
      message: `${entityLabel} deleted successfully.`,
      data: null,
    });
  }),
});

module.exports = buildCrudController;

