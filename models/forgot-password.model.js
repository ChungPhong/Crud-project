const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const customer = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    expireAt: {
      type: Date,
      expires: 180,
    },
  },
  {
    timestamps: true,
  }
);
const ForgotPassword = mongoose.model(
  "ForgotPassword",
  customer,
  "forgot-password"
);

module.exports = ForgotPassword;
