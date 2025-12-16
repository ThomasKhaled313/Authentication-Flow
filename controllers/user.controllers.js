const AppError = require("../utils/appError");
const HttpStatusText = require("../utils/httpStatusText");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const getProfileController = async (req, res, next) => {
  const { id } = req.user;
  const currentUser = await User.findById(id);
  if (!currentUser) {
    next(AppError.create("Invalid user", 401, HttpStatusText.FAIL));
  }

  const { username, email, role, createdAt } = currentUser;

  res.status(200).json({
    status: 200,
    data: {
      username,
      email,
      role,
      createdAt,
    },
  });
};

const updateProfileController = async (req, res, next) => {
  const { username, old_password, new_password } = req.body;
  const { id } = req.user;

  const currentUser = await User.findById(id).select("+password");
  if (!currentUser) {
    return next(AppError.create("Invalid user", 401, HttpStatusText.FAIL));
  }

  if (username) {
    currentUser.username = username;
  }

  const isOldPasswordCorrect = await bcrypt.compare(
    old_password,
    currentUser.password
  );

  if (!isOldPasswordCorrect) {
    return next(
      AppError.create("Old password is incorrect", 401, HttpStatusText.FAIL)
    );
  }

  currentUser.password = await bcrypt.hash(new_password, 10);
  currentUser.passwordChangedAt = new Date();

  await currentUser.save();

  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    message: "Profile updated successfully",
    data: {
      id: currentUser._id,
      username: currentUser.username,
      email: currentUser.email,
    },
  });
};

const getAllUsersController = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 2;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const allUsers = await User.find().limit(limit).skip(skip);
  const totalCount = await User.countDocuments();
  const totalPages = Math.ceil(totalCount / limit);



  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    totalCount,
    totalPages,
    data: allUsers.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
    })),
  });
};

const deleteProfileController = async (req, res, next) => {
  const { id } = req.user;
  
  await User.findByIdAndDelete(id);

  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    message: "Account deleted successfully"
  })
}

module.exports = {
  getProfileController,
  updateProfileController,
  getAllUsersController,
  deleteProfileController
};
