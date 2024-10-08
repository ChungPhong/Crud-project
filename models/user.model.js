const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const customer = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: () => generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    friendList: [
      {
        user_id: String,
        room_chat_id: String,
      },
    ],
    acceptFriends: Array, //Ngươi gửi kết bạn
    requestFriends: Array, //Người nhận kb
    statusOnline: String,
    status: {
      default: "active",
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", customer, "users");

module.exports = User;
