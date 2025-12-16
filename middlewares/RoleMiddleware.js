const appError = require("../utils/appError");
const HttpStatusText = require("../utils/httpStatusText");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        appError.create("You are not allowed to access this route", 403, HttpStatusText.FAIL)
      );
    }

    next();
  };
};

module.exports = roleMiddleware;
