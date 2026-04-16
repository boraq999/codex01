const { sendResponse } = require("../utils/apiResponse");

const errorMiddleware = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  return sendResponse(res, {
    statusCode,
    success: false,
    message: error.message || "Internal server error.",
    data: null,
  });
};

module.exports = errorMiddleware;

