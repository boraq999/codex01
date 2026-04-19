const AppError = require("../utils/appError");

const roleMiddleware = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }

  // Admin has full access to everything
  if (req.user.role === "admin") {
    return next();
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }

  return next();
};

module.exports = roleMiddleware;

