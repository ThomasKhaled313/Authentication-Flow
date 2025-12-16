const express = require("express");
const { requestLimiter } = require('../middlewares/rateLimiter');
const router = express.Router();

const authController = require("../controllers/auth.controllers");

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../validators/auth.validators");

router.route("/register").post(validateRegister, authController.registerController);

router.route("/login").post(validateLogin, requestLimiter, authController.loginController);

router.route("/forgot-password").post(validateForgotPassword, requestLimiter, authController.forgotPassword);

router.route("/reset-password/:token").post(validateResetPassword, requestLimiter, authController.resetPassword);


module.exports = router;
