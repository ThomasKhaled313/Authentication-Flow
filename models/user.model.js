const mongoose = require("mongoose");
const validator = require('validator');
const userRoles = require("../utils/userRoles");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter a valid email']
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MODERATOR],
    default: userRoles.USER
  },
  passwordChangedAt : {
    type: Date
  },
  passwordResetToken : {
    type: String
  },
  passwordResetExpires : {
    type: Date
  },
},{
    timestamps: true
  });

userSchema.methods.createPasswordResetToken = function()  {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 5 * 60 * 1000);

  return resetToken;
}

module.exports = mongoose.model('User', userSchema);
