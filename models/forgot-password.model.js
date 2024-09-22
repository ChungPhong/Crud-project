const mongoose = require("mongoose");
const customer = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    expireAt: {
      type: Date,
      expires: 60,
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
