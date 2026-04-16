const activityLogService = require("../services/activityLog.service");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  list: asyncHandler(async (_req, res) => {
    const data = await activityLogService.list();
    return sendResponse(res, {
      message: "Activity logs fetched successfully.",
      data,
    });
  }),

  listByEntity: asyncHandler(async (req, res) => {
    const data = await activityLogService.listByEntity(req.params.entityType, Number(req.params.entityId));
    return sendResponse(res, {
      message: "Entity activity logs fetched successfully.",
      data,
    });
  }),
};

