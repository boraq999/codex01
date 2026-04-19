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

  verify: asyncHandler(async (req, res) => {
    // If we reach here, the auth middleware has already verified the token
    return sendResponse(res, {
      message: "Token is valid.",
      data: {
        user: req.user,
        valid: true
      }
    });
  }),

  refresh: asyncHandler(async (req, res) => {
    const data = await authService.refreshToken(req.user);
    return sendResponse(res, {
      message: "Token refreshed successfully.",
      data,
    });
  }),
};

