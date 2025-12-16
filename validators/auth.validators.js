const validator = require("validator");
const HttpStatusText = require("../utils/httpStatusText");

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.length < 5) {
    errors.push({
      field: "username",
      message: "username must be at least 5 characters",
    });
  }

  if (!email || !validator.isEmail(email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (!password || password.length < 8) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      message: "Validation error",
      errors,
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push({ field: "email", message: "Invalid email" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      message: "Validation error",
      errors,
    });
  }
  next();
};

const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push({ field: "email", message: "Invalid email" });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      message: "Validation error",
      errors,
    });
  }
  next();
};

const validateResetPassword = (req, res, next) => {
  const { token } = req.params;
  const { new_password } = req.body;
  const errors = [];

  if (!token) {
    errors.push({ field: "token", message: "Reset token is required" });
  }

  if (!new_password || new_password.length < 8) {
    errors.push({
      field: "new_password",
      message: "Password must be at least 8 characters",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      message: "Validation error",
      errors,
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
