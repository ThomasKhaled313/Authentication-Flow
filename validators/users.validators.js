const validator = require("validator");
const HttpStatusText = require("../utils/httpStatusText");
const User = require("../models/user.model");
const userRoles = require("../utils/userRoles");
const bcrypt = require('bcrypt');

const validateUpdateProfile = (req, res, next) => {
  const { username, old_password, new_password } = req.body;
  const errors = [];

  if (username && username.length < 5) {
    errors.push({
      field: "username",
      message: "Username must be at least 5 characters",
    });
  }

  if ((old_password && !new_password) || (!old_password && new_password)) {
    errors.push({
      field: "password",
      message: "Both old_password and new_password must be provided together",
    });
  }

  if (new_password && new_password.length < 8) {
    errors.push({
      field: "new_password",
      message: "New password must be at least 8 characters",
    });
  }

  if (!username && !old_password && !new_password) {
    errors.push({ field: "body", message: "No data provided" });
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


const validateDeleteProfile = async (req, res, next) => {
  const { id, role } = req.user;
  const { password } = req.body;
  const errors = [];

  const currentUser = await User.findOne({_id: id}).select("+password");
  
  const isPasswordCorrect = await bcrypt.compare(password, currentUser.password);

  
  if(!isPasswordCorrect){
    errors.push({
      field: "password",
      message: "Password is incorrect.",
    });
  }

  if(!currentUser){
    errors.push({
      field: "_id",
      message: "No users found by this ID.",
    });
  }

  if(role === userRoles.ADMIN){
    errors.push({
      field: "role",
      message: "Admin accounts cannot be deleted",
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
}

module.exports = {
  validateUpdateProfile,
  validateDeleteProfile
};