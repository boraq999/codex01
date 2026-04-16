const authService = require("../services/auth.service");
const { sendResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports = {
  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    return sendResponse(res, {
      message: "Login successful.",
      data,
    });
  }),
};

