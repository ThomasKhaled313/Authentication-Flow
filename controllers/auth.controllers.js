const AppError = require("../utils/appError");
const HttpStatusText = require("../utils/httpStatusText");
const crypto = require("crypto");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const registerController = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  let userRole = "User"; 
  if (role === "Admin") {
    if (!req.user || req.user.role !== "Admin") {
      return next(AppError.create(
        "Only admins can create another admin",
        403,
        HttpStatusText.FAIL
      ));
    }
    userRole = "Admin";
  }

  const newUser = await User.create({
    username,
    email,
    password: passwordHash,
    role: userRole
  });

  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    message: "User registered successfully",
    data: {
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    },
  });
};


const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) {
    return next(AppError.create("User not found", 404, HttpStatusText.FAIL));
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return next(AppError.create("Wrong password", 401, HttpStatusText.FAIL));
  }

  const token = jwt.sign(
    { id: existingUser._id, email: existingUser.email, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    message: "Loggedin successfully",
    token,
    data: {
      role: existingUser.role,
      username: existingUser.username,
      email: existingUser.email,
    },
  });
};


const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const findUser = await User.findOne({ email });

  if (!findUser) {
    return next(
      AppError.create("No user found with this email", 404, HttpStatusText.FAIL)
    );
  }

  const resetToken = findUser.createPasswordResetToken();

  await findUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    message: "Password reset token generated",
    resetToken
  });
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { new_password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      AppError.create("Token is invalid or expired", 400, HttpStatusText.FAIL)
    );
  }

  user.password = await bcrypt.hash(new_password, 10);
  user.passwordChangedAt = new Date();

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: {},
    message: "Password has been reset successfully, please log in",
  });
};

module.exports = {
  registerController,
  loginController,
  forgotPassword,
  resetPassword,
};
